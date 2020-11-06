// When popup opens, send highlighted text to background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.cmd === 'getTicker') {
		let highlighted = window.getSelection().toString().toUpperCase().trim();
		sendResponse({status: 'done', ticker: highlighted});
	}
	return true;
});
