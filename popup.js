var messageList = [];
var decisionList = [];
var analysisList = [];

chrome.runtime.sendMessage({data:"Handshake"},function(response){
});

/*
Function that handles latest messages from background.js
*/
// chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
//     messageList = message.messages;
//     var str = '';
//     if (messageList == []){
//         str += '<div class="loader"></div>';
//     } else {
//         messageList.forEach(function(message) {
//             str += '<div id="emailContent">' + '<p>' + message + '</p>' + '</div>';
//         });       
//     }
//     document.getElementById("messages").innerHTML = str;
// });

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
    senderList = message.senders;
    topicList = message.topics;
    analysisList = message.analysis;
    analysed = message.analysed;
    var str = '';
    if (analysed == false){
        str += '<div class="loader"></div>';
    } else {
        senderList.forEach((sender, index) => {
            const topic = topicList[index];
            const analysis = analysisList[index];
            str += '<div class="apparent-message error-message">' +
            '<div class="message-container">' +
                '<div class="apparent-message-icon fa fa-fw fa-2x fa-exclamation-triangle"></div>' +
                    '<div class="content-container">' +
                        '<div class="message-header">' +
                            '<span>Fraud Alert!</span>' +
                        '</div>' +
                        '<div class="message-body">' +
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
    }
    document.getElementById("messages").innerHTML = str;
});

