chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed.");
});

// Sends response as object with all stock information, or false if none exists
chrome.runtime.onMessage.addListener((request, sender, send_response) => {
    if (request.cmd === "get_info") {
		get_info(request, send_response);
    }
    return true;
});

async function get_info(request, send_response) {
	let stocks = []
	let respond = () => {
		send_response({ status: "done", stocks: stocks });
	}

    // Check for ticker validity (NYSE dictates 16-char max)
	let ticker = request.ticker.split(" ")[0].slice(0, 16);
    if (ticker === "" || ticker != request.ticker) {
        // Nothing highlighted
        respond();
    } else {
        let APIKEY = request.api_key;
        let stocks = [];
        let overview;
		let global_quote;
		
        await fetch("https://www.alphavantage.co/query?function=OVERVIEW&symbol=" + ticker + "&apikey=" + APIKEY)
			.then((result) => result.json())
            .then((result) => {
				overview = result;
				console.log("Fetching overview succeeded.");
			});
        await fetch("https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + ticker + "&apikey=" + APIKEY)
            .then((result) => result.json())
            .then((result) => {
				global_quote = result['Global Quote'];
				console.log("Fetching global quote succeeded.");
			});

		if (overview === {} || global_quote === {}) {
			respond();
			console.log("No data was found.")
			return;
		}

        let stock_name = overview["Name"];
        let exchange = overview["Exchange"];

        let current_price = global_quote["05. price"];
        let currency_change = global_quote["09. change"];
        let percent_change = global_quote["10. change percent"];

        let high = overview["52WeekHigh"];
        let low = overview["52WeekLow"];

        let day_volume = global_quote["06. volume"];
        let div_yield = overview["DividendYield"];
        let pe_ratio = overview["PERatio"];
        let market_cap = overview["MarketCapitalization"];

        stocks.push({
            stock_name: stock_name,
            exchange: exchange,
            ticker: ticker,
            current_price: current_price,
            currency_change: currency_change,
            percent_change: percent_change,
            high: high,
            low: low,
            day_volume: day_volume,
            div_yield: div_yield,
            pe_ratio: pe_ratio,
            market_cap: market_cap,

            /*
			day_graph: day_graph,
			week_graph: week_graph,
			month_graph: month_graph,
			year_graph: year_graph,
			fiveyear_graph: fiveyear_graph
			*/
        });

        // If multiple stocks are possible, ask user to identify exchange
        // For now, assume NYSE > NASDAQ > TSX

        // Create price graphs
        /*
		let day_graph = make_graph(...);
		let week_graph = make_graph(...);
		let month_graph = make_graph(...);
		let year_graph = make_graph(...);
		let fiveyear_graph = make_graph(...);
		*/

        // Return information
        send_response({
            status: "done",
            stocks: stocks,
        });
    }
}

function make_graph(title, xlabel, ylabel, data) {
    console.log("make_graph testing");
}
