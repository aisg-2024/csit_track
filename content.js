//Array of gmail IDs used to look up details of each gmail
var messageIDList;
//Array of full gmail messages extracted from the messageIDList
var messageList;
//Boolean to determine when GPT has finished analysing all fetched emails
var allEmailAnalysed = false;
//Array of senders of emails identified as fraud by GPT
var senderList= [];
//Array of topics of emails identified as fraud by GPT
var topicList = [];
//Array of phishing score ratings from 1 to 10 given to flagged emails to reflect level of likelihood of real fraud
var scoreList = [];
//Array of supporting analysis from GPT for giving fraud decision
var analysisList = [];
//Main function powering the extraction of email contents and sending them to LLM backend
const performLLMCheck = () => {
	var statusStr = '';
	var emailNumber = document.getElementById('email-number').value;
	console.log(emailNumber)
	//Make sure email number is valid
	if(emailNumber == '' || emailNumber == null || parseInt(emailNumber) < 0 || parseInt(emailNumber) > 50){
		alert("Please fill a valid number between 1-50!");
		document.getElementById('email-number').value = ''
		return;
	}
	document.getElementById("messages").innerHTML = '';
	//Initialise with 0 frauds detected	
	chrome.action.setBadgeText({ text: "0" });
	chrome.action.setBadgeBackgroundColor({ color: "gray" });
    chrome.identity.getAuthToken(
    //Retrieve Oauth2 token for Google user
    {'interactive': true}, async (token) => {
        console.log("Token received: ", token);
		statusStr += '<div class = "status-element" id="token-status"><p>Token Received<p></div>';
		document.getElementById("status-bar").innerHTML = statusStr;
		try {
			messageIDList = await fetchGmailList(token, parseInt(emailNumber));
			// console.log("Message IDs");
			console.log(messageIDList);
			statusStr += '<div class = "status-element" id="gmail-status"><p>Gmails Fetched<p></div>';
			document.getElementById("status-bar").innerHTML = statusStr;
			messageList = await fetchBatch(token, messageIDList, 'batch_taskjet_google_lib_api', 'https://www.googleapis.com/batch/gmail/v1');
			// console.log("Messages");
			// console.log(messageList);
			var totalCount = 0;
			var fraudCount = 0;
			document.getElementById("messages").innerHTML = '<div class="loader"></div>';
			messageList.forEach(async function (message) {
				var responseJson = await sendToLLM(message);
				console.log(responseJson);
				//in JSON response 1 means fraud detected, 0 means no fraud
				if(parseInt(responseJson.fraudDetected) == 1){
					fraudCount++;
					analysisList.push(responseJson.result_rationale);
					scoreList.push(responseJson.phishing_score);
					senderList.push(extractSender(message));
					topicList.push(extractTopic(message));
				}
				totalCount++;
				if(totalCount == messageList.length){
					messageStr = '';
					statusStr += '<div class = "status-element" id="llm-status"><p>Analysis Complete<p></div>';
					document.getElementById("status-bar").innerHTML = statusStr;
					allEmailAnalysed = true;
					chrome.action.setBadgeText({ text: fraudCount.toString() });
					if(fraudCount > 0){
						chrome.action.setBadgeBackgroundColor({ color: "red" });
						chrome.action.setBadgeTextColor({ color: "white" });
					} else {
						chrome.action.setBadgeBackgroundColor({ color: "green" });
						chrome.action.setBadgeTextColor({ color: "white" });
					}
					if (analysisList.length != 0) {
						senderList.forEach((sender, index) => {
							const topic = topicList[index];
							const analysis = analysisList[index];
							const score = scoreList[index];
							messageStr += '<div class="apparent-message error-message">' +
							'<div class="message-container">' +
								'<div class="apparent-message-icon fa fa-fw fa-2x fa-exclamation-triangle"></div>' +
									'<div class="content-container">' +
										'<div class="message-header">' +
											'<span>Phishing Alert!</span>' +
										'</div>' +
										'<div class="message-body">' +
										'	<h6><strong>Phishing Score:</strong> ' + score + '</h6>' +
											'<h6><strong>From:</strong> ' + sender + '</h6>' +
											'<h6><strong>Topic:</strong> ' + topic + '</h6>' +
											'<h6><strong>LLM Analysis:</strong></h6>' +
											'<p>' + analysis + '</p>' +
										'</div>' +
									'</div>' +
								'</div>'+
							'</div>'+
						'</div>';
						});      
					} else {
						messageStr += '<div class="apparent-message safe-message">' +
							'<div class="message-container">' +
								'<div class="apparent-message-icon fa fa-check-circle"></div>' +
									'<div class="content-container">' +
										'<div class="message-header">' +
											'<span>Your Emails Are Safe!</span>' +
										'</div>' +
										'<div class="message-body">' +
											'<h6><strong>LLM Analysis:</strong></h6>' +
											'<p>' + 'Our LLM solution did not detect any potential phishing emails ' +
											'among your first '+ emailNumber +' unread emails. However, we still encourage you ' +
											'to exercise caution when reading your emails as malicious sources may ' +
											'deploy new tactics which our LLM have yet to be exposed to and thus may fail at detecting.' + '</p>' +
										'</div>' +
									'</div>' +
								'</div>'+
							'</div>'+
						'</div>';
					}
					document.getElementById("messages").innerHTML = messageStr;
					document.getElementById('email-number').value = ''
				}
			});
	} catch(error){
		console.log(error)
		str = '<div class = "error"></div>'
		document.getElementById("messages").innerHTML = str;
	}
    }
    );
}

/*
Returns a promise that yields the gmail list requested
Gmail list will be displayed as a list of message IDs
*/
const fetchGmailList = (token, emailNumber) => {
	return new Promise((resolve, reject) => {
		const headers = new Headers({
			'Authorization' : 'Bearer ' + token,
			'Content-Type': 'application/json'
		});
		const queryParams = { headers };
		let maxEmailResults = emailNumber;
		let queryCondition = 'is:unread';
		let labelID = 'INDEX';
		//Send GET request to Gmail REST API and retrieve first 50 unread messages
		fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults='+maxEmailResults+'&q='+queryCondition, queryParams)
		.then((response) => response.json()) // Transform the data into json
		.then(function(data) {
			return resolve(data.messages.map(({ id } = {}) => id));
		})
		.catch(function (err) {
			return reject(err);
		});
	});
} 

/*
Function that constructs a body consisting of individual gmail get requests
for a batch request
Adapted from: https://gist.github.com/moorage/6f599f4dc85ae52c505f5e304c326935
*/
const createBatchBody = (messageIds,boundary) => {
	var batchBody = [];
	messageIds.forEach(function (id) {
	  var method = 'GET'
	  var uri = `https://www.googleapis.com/gmail/v1/users/me/messages/${id}`
	  var body = '\r\n'

	  batchBody = batchBody.concat([
		'--',
		boundary,
		'\r\n',
		'Content-Type: application/http',
		'\r\n\r\n',
		method,
		' ',
		uri,
		'\r\n',
		body
	  ])
	});

	return batchBody.concat(['--', boundary, '--']).join('');
}

/*
Function that constructs the overall batch request and sends it to gmail server
Adapted from: https://gist.github.com/moorage/6f599f4dc85ae52c505f5e304c326935
*/
const fetchBatch = ( accessToken, messageIds, boundary, batchUrl ) => {
	return new Promise((resolve, reject) => {
		var batchBody = createBatchBody(messageIds, boundary);
		fetch(batchUrl, {
		method: 'POST',
		headers: {
			Authorization: 'Bearer ' + accessToken,
			'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
		},
		body: batchBody
		})
		.then((response) => response.text())
		.then(function(text) {
			// console.log('batchBody', batchBody, 'text', text);
			return resolve(parseBatchResponse(text));
		})
		.catch(function (err) {
			return reject(err);
		});
	});
}

/*
Function that parses the batch response 
Adapted from: https://stackoverflow.com/questions/33289711/parsing-gmail-batch-response-in-javascript
*/
const parseBatchResponse = (repsonse) => {
	var parsedMessages = [];
	const bodies = repsonse.split('\r\n');
	for (const body of bodies) {
		if (body[0] === '{') {
			const parsedBody = parseMessage(body);
			var sender = parsedBody.headers.from;
			var replyTo = parsedBody.headers["reply-to"];
			var returnPath = parsedBody.headers["return-path"];
			var subject = parsedBody.headers.subject;
			var plainText = parsedBody.textPlain;
			var trimmedMessage = "From: " + sender + "\n\n"
									+ "Reply to: " + replyTo + "\n\n"
									+ "Return Path: " + returnPath + "\n\n"
									+ "Subject: " + subject + "\n\n"
									+ plainText;
			parsedMessages.push(trimmedMessage);
		}
	}
	return parsedMessages;
}

/*
Converts a string into a base-64 decodable format
Credit: https://stackoverflow.com/questions/5234581/base64url-decoding-via-javascript
*/
const base64_decode = (input) => {
	// Replace non-url compatible chars with base64 standard chars
	input = input
		.replace(/-/g, '+')
		.replace(/_/g, '/');

	// Pad out with standard base64 required padding characters
	var pad = input.length % 4;
	if(pad) {
	  if(pad === 1) {
		throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
	  }
	  input += new Array(5-pad).join('=');
	}

	return input;
}

/*
Decodes a url safe Base64 string to its original representation
Credit: https://github.com/EmilTholin/gmail-api-parse-message/blob/master/lib/index.js
*/
const urlB64Decode = (string) => {
	return string
	 ? atob(base64_decode(string))
	 : '';
  }
  
/*
Takes the header array filled with objects and transforms it into a more pleasant key-value object.
Credit: https://github.com/EmilTholin/gmail-api-parse-message/blob/master/lib/index.js
*/
const indexHeaders = (headers) => {
if (!headers) {
	return {};
} else {
	return headers.reduce(function (result, header) {
	result[header.name.toLowerCase()] = header.value;
	return result;
	}, {});
}
}

/*
Function that parses individual message bodies
Credit: https://github.com/EmilTholin/gmail-api-parse-message/blob/master/lib/index.js
*/
const parseMessage = (response) => {
	var response = JSON.parse(response)
	var result = {
	  id: response.id,
	  threadId: response.threadId,
	  labelIds: response.labelIds,
	  snippet: response.snippet,
	  historyId: response.historyId
	};
	if (response.internalDate) {
	  result.internalDate = parseInt(response.internalDate);
	}
  
	var payload = response.payload;
	if (!payload) {
	  return result;
	}
  
	var headers = indexHeaders(payload.headers);
	result.headers = headers;
  
	var parts = [payload];
	var firstPartProcessed = false;
  
	while (parts.length !== 0) {
	  var part = parts.shift();
	  if (part.parts) {
		parts = parts.concat(part.parts);
	  }
	  if (firstPartProcessed) {
		headers = indexHeaders(part.headers);
	  }
  
	  if (!part.body) {
		continue;
	  }
  
	  var isHtml = part.mimeType && part.mimeType.indexOf('text/html') !== -1;
	  var isPlain = part.mimeType && part.mimeType.indexOf('text/plain') !== -1;
	  var isAttachment = Boolean(part.body.attachmentId || (headers['content-disposition'] && headers['content-disposition'].toLowerCase().indexOf('attachment') !== -1));
	  var isInline = headers['content-disposition'] && headers['content-disposition'].toLowerCase().indexOf('inline') !== -1;
  
	  if (isHtml && !isAttachment) {
		result.textHtml = urlB64Decode(part.body.data);
	  } else if (isPlain && !isAttachment) {
		result.textPlain = urlB64Decode(part.body.data);
	  } else if (isAttachment) {
		var body = part.body;
		if(!result.attachments) {
		  result.attachments = [];
		}
		result.attachments.push({
		  filename: part.filename,
		  mimeType: part.mimeType,
		  size: body.size,
		  attachmentId: body.attachmentId,
		  headers: indexHeaders(part.headers)
		});
	  } else if (isInline) {
	  var body = part.body;
	  if(!result.inline) {
		result.inline = [];
	  }
	  result.inline.push({
		filename: part.filename,
		mimeType: part.mimeType,
		size: body.size,
		attachmentId: body.attachmentId,
		headers: indexHeaders(part.headers)
	  });
	}
  
	  firstPartProcessed = true;
	}
  
	return result;
};

/*
Function that sends email messages to LLM and awaits LLM analysis results
*/
const sendToLLM = (message) => {
	return new Promise((resolve, reject) => {
		const messageJSON = JSON.stringify({
			"emailContent": message
		});
		const queryParams = {
			method: 'POST',
			url: 'https://langchain-backend-k9yh.onrender.com/detect-fraud',
			headers: {"Content-type": "application/json; charset=UTF-8"},
			body: messageJSON
		};
		fetch('https://langchain-backend-k9yh.onrender.com/detect-fraud', queryParams)
		.then(function(response) {
			return resolve(response.json());
		})
		.catch(function (err) {
			return reject(err);
		});
	});
}

/*
Function that extracts sender from text email message
*/
const extractSender = (message) => {
	return message.split("From: ")[1].split("\n\n")[0].trim();
}

/*
Function that extracts subject from text email message
*/
const extractTopic = (message) => {
	return message.split("Subject: ")[1].split("\n\n")[0].trim();
}

//Monitors for button press to trigger the LLM analysis
document.getElementById("llmButton").addEventListener("click", performLLMCheck);
