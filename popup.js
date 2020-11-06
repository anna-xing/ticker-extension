// Attach event listeners to graph mode buttons
let graph_modes = document.querySelectorAll('.graph-mode');
graph_modes.forEach((graph_mode) => {
	graph_mode.addEventListener('click', () => {
		if (!graph_mode.classList.contains('active')) {
			document.querySelector('.graph-mode.active').classList.remove('active');
			graph_mode.classList.add('active');
		}
	});
});

// Prompt highlight.js content script to get ticker from page
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { cmd: 'get_ticker' }, (response) => {
        if (response.status === 'done') {
			console.log("Highlight script finished processing.");

            // Prompt background script to get stock information from ticker
            chrome.runtime.sendMessage(
                {
                    cmd: 'get_info',
                    ticker: response.ticker
                },
                (response) => {
                    if (response.status === 'done') {
                        console.log("Background script finished processing.");
                        update_stock_info(response.info);
                    }
                }
            );
        }
    });
});

// Update popup fields with stock information
function update_stock_info(info) {
	stock_found = document.querySelector('#stock-found');
	no_stock_found = document.querySelector('#no-stock-found');

	if (info === '') {
		// No stock found
		if (!stock_found.classList.contains('hidden')) {
			stock_found.classList.add('hidden');
			no_stock_found.classList.remove('hidden');
		}
		console.log("No stock found.");
	} else {
		// Stock found
		stock_found.classList.remove('hidden');
		no_stock_found.classList.add('hidden');

		const info_list = [
			'stock_name', 'exchange', 'ticker',
			'current_price', 'currency_change', 'percent_change',
			'high', 'low', 
			'day_volume', 'avg_volume', 
			'pe_ratio', 'market_cap'
		];
		for (field of info_list) {
			dom_id = field.split('_').join('-');
			window[dom_id].innerHTML = info[field];
		}
		console.log('Extension display updated.');
	}
}
