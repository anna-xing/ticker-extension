// When popup opens, send highlighted text to background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.cmd === 'get_ticker') {
		// Ensure that any valid ticker will be returned properly formatted
		let highlighted = window.getSelection().toString().toUpperCase().trim();
		sendResponse({status: 'done', ticker: highlighted});
	}
	return true;
});
