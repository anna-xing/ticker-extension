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
	let stock = false;
	let respond = () => {
		send_response({ status: "done", stock: stock });
	}

    // Check for ticker validity (NYSE dictates 16-char max)
	let ticker = request.ticker.split(" ")[0].slice(0, 16);
    if (ticker === "" || ticker != request.ticker) {
        // Nothing highlighted
        respond();
    } else {
        let APIKEYS = request.api_keys;
    
        // TESTING VALUES
        /*
        ticker = 'IBM'; 
        APIKEYS[0] = 'demokey';
        APIKEYS[1] = 'demokey';
        */

        let overview;
        await fetch("https://www.alphavantage.co/query?function=OVERVIEW&symbol=" + ticker + "&apikey=" + APIKEYS[0])
			.then((result) => result.json())
            .then((result) => {
				overview = result;
				console.log("Fetching overview succeeded.");
            });
            
        let global_quote;
        await fetch("https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + ticker + "&apikey=" + APIKEYS[0])
            .then((result) => result.json())
            .then((result) => {
				global_quote = result['Global Quote'];
                console.log("Fetching global quote succeeded.");
			});

        if (!overview || !global_quote) {
            send_response({ status: "overload", stock: stock });
            console.log("No data was returned. The API has been called too frequently.")
            return;
        } else if (Object.keys(overview).length === 0 || Object.keys(global_quote).length === 0) {
			respond();
			console.log("No data was found.")
			return;
        }

        // Get data for graphs 
        let graph_w_pts = [];
        let graph_m_pts = [];

        // TODO: this returns a csv. need to find way to convert to json.
        // TODO: organize + push appropriate data for both week and month graphs.
        await fetch("https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + ticker + "&interval=60min&apikey=" + APIKEYS[1])
            .then((result) => result.json())
            .then((result) => {
                console.log(result)
                let time_series = result["Time Series (60min)"];
                for (let time in time_series) {
                    graph_w_pts.push({
                        x: time,
                        y: time_series[time]["4. close"]
                    });
                }
                console.log("Fetching intraday time series succeeded.");
            });
        
        let stock_name = overview["Name"];
        let exchange = overview["Exchange"];

        let current_price = global_quote["05. price"];
        let currency_change = global_quote["09. change"];
        let percent_change = global_quote["10. change percent"].replace('%', '');

        let high = overview["52WeekHigh"];
        let low = overview["52WeekLow"];

        let day_volume = global_quote["06. volume"];
        let div_yield = overview["DividendYield"];
        let pe_ratio = overview["PERatio"];
        let market_cap = overview["MarketCapitalization"];

        stock = {
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

			graph_w_pts: graph_w_pts,
			graph_m_pts: graph_m_pts,
        };

        respond();
    }
}
