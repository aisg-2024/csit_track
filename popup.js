var messageList = [];

chrome.runtime.sendMessage({data:"Handshake"},function(response){
});

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
    messageList = message.messages;
    var str = '';
    if (messageList == []){
        str += '<div class="loader"></div>';
    } else {
        messageList.forEach(function(message) {
            str += '<div id="emailContent">' + '<p>' + message + '</p>' + '</div>';
        });       
    }
    document.getElementById("messages").innerHTML = str;
});

/*
Function that handles latest messages from background.js
Adapted from: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/sendMessage
*/
// const handleMessage = (message, sender, sendResponse) => {
// 	console.log(`Latest message recevied from: ${message.origin}`);
// 	sendResponse({ response: "Successful receipt of latest messages" });
//     messageList = request.messageList;
// }
  
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     handleMessage(message, sender, sendResponse);
//     return true;
// });

// function updatePopup() {
//     chrome.storage.sync.get(['messages'], function (data) {
//         var str = '';
//         data.forEach(function(message) {
//           str += '<div id="emailContent">' + '<p>' + message + '</p>' + '</div>';
//         });       
//         document.getElementById("messages").innerHTML = str;
//     });
// }    
// document.addEventListener('DOMContentLoaded', updatePopup);