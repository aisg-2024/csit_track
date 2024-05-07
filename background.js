chrome.action.onClicked.addListener(async tab => {
	// console.log(`Toggle side panel on ${tab.id}`);
	await chrome.tabs.sendMessage(tab.id,"toggle");
});



  