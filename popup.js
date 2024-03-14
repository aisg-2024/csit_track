var messageList = [];
var decisionList = [];
var analysisList = [];

chrome.runtime.sendMessage({data:"Handshake"},function(response){
});

/*
Function that handles latest messages from background.js
*/
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



chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
    analysisList = message.analysis;
    decisionList = message.decisions;
    var str = '';
    if (decisionList == []){
        str += '<div class="loader"></div>';
    } else {
        messageList.forEach(function(message) {
            str += '<div id="emailContent">' + '<p>' + message + '</p>' + '</div>';
        });       
    }
    document.getElementById("messages").innerHTML = str;
});