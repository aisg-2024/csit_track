//Initialise with 0 frauds detected
chrome.action.setBadgeText({ text: "0" })

//Array of gmail IDs used to look up details of each gmail
var messageIDList;
//Array of full gmail messages extracted from the messageIDList
var messageList;

//Main function powering the extraction of email contents 
chrome.identity.getAuthToken(
	//Retrieve Oauth2 token for Google user
	{'interactive': true}, async (token) => {
		console.log("Token received: ", token);
		messageIDList = await fetchGmailList(token);
		console.log("Message IDs: ", messageIDList);
		messageList = await fetchBatch(token, messageIDList, 'batch_taskjet_google_lib_api', 'https://www.googleapis.com/batch/gmail/v1');
		console.log("Messages: ", messageList);
	}
);

/*
Returns a promise that yields the gmail list requested
Gmail list will be displayed as a list of message IDs
*/
const fetchGmailList = (token) => {
	return new Promise((resolve, reject) => {
		const headers = new Headers({
			'Authorization' : 'Bearer ' + token,
			'Content-Type': 'application/json'
		})
		const queryParams = { headers };
		let maxEmailResults = 50
		let queryCondition = 'is:unread'
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
			console.log('batchBody', batchBody, 'accessToken', accessToken, 'text', text);
			return resolve(parseBatchResponse(text));
		})
		.catch(function (err) {
			return reject(err);
		});
	});
}

/*
Function that supports batch response parsing 
Credit: https://gist.github.com/moorage/6f599f4dc85ae52c505f5e304c326935
*/
function parsePart(part) {
	var p = part.substring(part.indexOf('{'), part.lastIndexOf('}') + 1)
	return JSON.parse(p)
  }

/*
Function that parses the batch response 
Credit: https://gist.github.com/moorage/6f599f4dc85ae52c505f5e304c326935
*/
const parseBatchResponse = (response) => {
	// Not the same delimiter in the response as was specified in the request,
	// so we have to extract it.
	var delimiter = response.substring(0, response.indexOf('\r\n'))
	var parts = response.split(delimiter)
	// The first part will always be an empty string. Just remove it.
	parts.shift()
	// The last part will be the "--". Just remove it.
	parts.pop()
  
	var result = []
	for (var i = 0; i < parts.length; i++) {
	  var part = parts[i]
	  try {
		result.push(parsePart(part))
	  } catch (e) {
		// A Google API error will contain a JSON response with an array 'errors'.
		// If the parsing should fail, we mimic this.
		result.push({
		  errors: [{ message: part, response: response, parts: parts, error: e }]
		})
	  }
	}

	return result
}

/*
Function that generates a URL query string with parameters for 
requesting specific fields and metadata for Gmail messages
Credit: https://www.labnol.org/gmail-urlfetch-api-230325
*/
const getUrlParts = () => {
	const metadata = ['Subject', 'From', 'To'].map((key) => `metadataHeaders=${key}`).join('&');
	const data = {
		fields: 'payload/headers',
		format: `metadata`,
	};
	const fields = Object.entries(data)
		.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
		.join('&');
	return `${fields}&${metadata}`;
};

/*
Function that constructs a request object for fetching a specific message 
from the Gmail API with an OAuth token
Adapted from: https://www.labnol.org/gmail-urlfetch-api-230325
*/
const createIndivMessageRequest = (messageId, token) => {
	const GMAIL_API_ENDPOINT = `https://www.googleapis.com/gmail/v1/users/me/messages`;
	const urlparts = getUrlParts();
	const headers = new Headers({
		'Authorization' : 'Bearer ' + token,
		'Content-Type': 'application/json'
	})
	return {
	url: `${GMAIL_API_ENDPOINT}/${messageId}?${urlparts}`,
	headers: { headers },
	muteHttpExceptions: true,
	};
}

/*
Function that makes multiple requests to the Gmail API in parallel
as a batch request for higher efficiency
Adapted from: https://www.labnol.org/gmail-urlfetch-api-230325
*/
const makeBatchRequest = (messageIds, messageList) => {
	const messageRequests = messageIds.map(createIndivMessageRequest);
	const responses = UrlFetchApp.fetchAll(messageRequests);
	responses.forEach((response) => {
		const messageData = JSON.parse(response);
		const { error, payload: { headers = [] } = {} } = messageData;
		if (error) {
			console.log('Error', error);
		} else {
			headers.forEach(({ name, value }) => {
				messageList.app(name + ': ' + value);
			});
		}
	});	
};
// const getGmailDetails = (messageList, token) => {
// 	return new Promise((resolve, reject) => {
// 		var emails = []
// 		const headers = new Headers({
// 			'Authorization' : 'Bearer ' + token,
// 			'Content-Type': 'application/json'
// 		})
// 		const batch_header = headers.copy()
// 		batch_header['Content-Type'] = 'multipart/mixed; boundary="email_id"'
// 		var data = ''
// 		var ctr = 0
// 		for (message in messageList) {
// 			data += f'--email_id\nContent-Type: application/http\n\nGET /gmail/v1/users/me/messages/{message["id"]}?format=full\n\n';
// 			if ctr == 99:
// 				data += '--email_id--'
// 				print(data)
// 				r = requests.post(f"https://www.googleapis.com/batch/gmail/v1", 
// 								headers=batch_header, data=data)
// 				bodies = r.content.decode().split('\r\n')
// 				for body in bodies:
// 					if body.startswith('{'):
// 						parsed_body = json.loads(body)
// 						emails.append(parsed_body)
// 				ctr = 0
// 				data = ''
// 				continue
// 			ctr+=1
// 		data += '--email_id--'
// 		r = requests.post(f"https://www.googleapis.com/batch/gmail/v1", 
// 						headers=batch_header, data=data)
// 		bodies = r.content.decode().split('\r\n')
// 		for body in bodies:
// 			if body.startswith('{'):
// 				parsed_body = json.loads(body)
// 				emails.append(parsed_body)
// 	for(var i=0; i<messageList.length; i++){
// 		const headers = new Headers({
// 			'Authorization' : 'Bearer ' + token,
// 			'Content-Type': 'application/json'
// 		})
// 		const queryParams = { headers };
// 		fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/'+messageList[i].id, queryParams)
// 		.then((response) => response.json()) // Transform the data into json
// 		.then(function(data) {
// 			return resolve(data.messages);
// 		})
// 		.catch(function (err) {
// 			return reject(err);
// 		  });
// 	}
// 	var date = extractField(response, "Date");
// 	var subject = extractField(response, "Subject")
// 	var part = message.parts.filter(function(part) {
// 		return part.mimeType == 'text/html';
// 	  });
// 	var html = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
// 	});
// }

function extractField (json, fieldName) {
	return json.payload.headers.filter(function(header) {
	  return header.name === fieldName;
	})[0].value;
  };


