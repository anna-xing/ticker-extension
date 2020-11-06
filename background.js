chrome.runtime.onInstalled.addListener(() => {
	console.log("Extension installed.");
});

// Sends response as object with all stock information, or false if none exists
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.cmd === 'getInfo') {
		sendResponse({status: 'done', info: request.ticker}); // testing line
	}
	return true;
});

