chrome.runtime.onInstalled.addListener(() => {
	console.log("Extension installed.");
});

// Sends response as object with all stock information, or false if none exists
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.cmd === 'get_info') {
		// Check for ticker validity (NYSE dictates 16-char max)
		let ticker = request.ticker.split(' ')[0].slice(0, 16);
		if (request.ticker === '' || ticker != request.ticker) {
			// Nothing highlighted
			sendResponse({status: 'done', info: ''});
		} else {
			// TESTING VALUES
			let stock_name="Test Stock"
			let exchange="EXCH"
			let current_price=120.00
			let currency_change=34.24
			let percent_change=currency_change/current_price * 100
			let high=125.00
			let low=113.11
			let day_volume='12M'
			let avg_volume='9M'
			let pe_ratio=34.2
			let market_cap=234

			// Call stock API
			
			// Create price graphs

			// Return information
			sendResponse({status: 'done', info: {
				stock_name: stock_name, 
				exchange: exchange, 
				ticker: ticker,

				current_price: current_price,
				currency_change: currency_change,
				percent_change: percent_change,

				high: high,
				low: low,

				day_volume: day_volume,
				avg_volume: avg_volume,

				pe_ratio: pe_ratio,
				market_cap: market_cap,

				/*day_graph: day_graph,
				week_graph: week_graph,
				month_graph: month_graph,
				year_graph: year_graph,
				fiveyear_graph: fiveyear_graph*/
			}});
		}

		sendResponse({status: 'done', info: request.ticker}); // testing line
	}
	return true;
});

