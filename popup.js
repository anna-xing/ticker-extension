// Prompt highlight.js content script to get ticker from page
chrome.runtime.sendMessage({cmd: 'get_ticker'}, (response) => {
	if (response && response.status === 'done') {
		console.log("Highlight script finished processing.");

		// Prompt background script to get stock information from ticker
		chrome.runtime.sendMessage({
			cmd: 'get_info', 
			ticker: response.ticker
		}, (response) => {
			if (response && response.status === 'done') {
				console.log("Background script finished processing.");
				receiveStockInfo(response.info);
			}
		});
	}
});

// Update popup fields with stock information
function receiveStockInfo(info) {
	console.log('Received ticker: ' + info); // testing line
}

/*
	let popupBody = document.getElementsByTagName('body')[0];
	if (response && response.info) {
		// Stock found
		alert('Ticker detected is: ' + response.info);
		popupBody.classList.remove('no-stock-found');
		popupBody.classList.add('stock-found');
		//updateFields(response.info);
	} else {
		// No stock found
		popupBody.classList.remove('stock-found');
		popupBody.classList.add('no-stock-found');
	}
});
*/

