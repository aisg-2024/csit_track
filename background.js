//OAuth2 auth
chrome.identity.getAuthToken(
	{'interactive': true},
	function(){
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
			client_id: '<clientid>',
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
    const messages = getMessages();
    const messageBatch = getMessageDetails(messages);
    
}


//Retrieves the latest 50 unread Gmail messages
async function getMessages(){
    return await gapi.client.gmail.users.messages.list({
		userId: 'me',
        maxResults: 50,
        q: "is:unread"
	}); //returns a promise
}

//takes in an array of messages from the getMessages response
async function getMessageDetails(messages){
  var batch = new gapi.client.newBatch();

	for(var i=0; i<messages.length; i++){
		batch.add(gapi.client.gmail.users.messages.get({
			userId: 'me',
			id: messages[i].id
		}));
	}

	batch.then()
}

