//OAuth2 auth
chrome.identity.getAuthToken(
	{'interactive': true},
	function(){
		console.log("STARTING:")
	  //load Google's javascript client libraries
		window.gapi_onload = authorize;
		loadScript('https://apis.google.com/js/client.js');
	}
);

//For Loading Google API Client Script
function loadScript(url){
  var request = new XMLHttpRequest();

	request.onreadystatechange = function(){
		if(request.readyState !== 4) {
			return;
		}

		if(request.status !== 200){
			return;
		}

    eval(request.responseText);
	};

	request.open('GET', url);
	request.send();
}

function authorize(){
  gapi.auth.authorize(
		{
			client_id: '184141298407-396pshlc9gdrpstp2bkkmkev0umb7igp.apps.googleusercontent.com',
			immediate: true,
			scope: 'https://www.googleapis.com/auth/gmail.modify'
		},
		function(){
		  gapi.client.load('gmail', 'v1', gmailAPILoaded);
		}
	);
}

/*	Once connected to Gmail API, display first 50 unread messages
	as plain text in chrome extension
*/
async function gmailAPILoaded(){
	await getMessages();
}

var extractField = function(json, fieldName) {
	return json.payload.headers.filter(function(header) {
	  return header.name === fieldName;
	})[0].value;
  };

//Retrieves the latest 50 unread Gmail messages
async function getMessages(){
	let response;
	try{
		response = await gapi.client.gmail.users.messages.list({
			userId: 'me',
			maxResults: 50,
			q: "is:unread"
		});
	} catch (err) {
		document.getElementById('content').innerText = err.message;
		return;
	}
	const messages = response.result.messages;
	if (!messages || messages.length == 0) {
	document.getElementById('content').innerText = 'No messages found.';
	return;
	}
	document.getElementById('content').innerText = messages;
	console.log(messages)
}

//takes in an array of messages from the getMessages response
 function getMessageDetails(messages){
  var batch = new gapi.client.newBatch();

	for(var i=0; i<messages.length; i++){
		batch.add(gapi.client.gmail.users.messages.get({
			userId: 'me',
			id: messages[i].id
		}));
	}

	batch.then()
	var date = extractField(response, "Date");
	var subject = extractField(response, "Subject")
	var part = message.parts.filter(function(part) {
		return part.mimeType == 'text/html';
	  });
	var html = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
}

