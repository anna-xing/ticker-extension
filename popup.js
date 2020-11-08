// Attach event listeners to graph mode buttons
let graph_modes = document.querySelectorAll(".graph-mode");
graph_modes.forEach((graph_mode) => {
    graph_mode.addEventListener("click", () => {
        if (!graph_mode.classList.contains("active")) {
            document.querySelector(".graph-mode.active").classList.remove("active");
            graph_mode.classList.add("active");
        }
    });
});

// Prompt highlight.js content script to get ticker from page
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { cmd: "get_ticker" }, (response) => {
        if (response.status === "done") {
            console.log("Highlight script finished processing.");

            // Prompt background script to get stock information from ticker
            chrome.runtime.sendMessage({
                    cmd: "get_info",
					ticker: response.ticker,
					api_key: ALPHAVANTAGE_API_KEY
                }, (response) => {
                    if (response.status === "done") {
                        console.log("Background script finished processing.");
                        update_stock_info(response.stocks);
                    }
                }
            );
        }
    });
});

// Update popup fields with stock information
// Delegate to update_choose_exchange if multiple stocks are provided
// list stocks: List of stock info objects, each containing respective stock info
function update_stock_info(stocks) {
    stock_found = document.querySelector("#stock-found");
    no_stock_found = document.querySelector("#no-stock-found");

    switch (stocks.length) {
        case 0:
            // No stock found
            if (!stock_found.classList.contains("hidden")) {
                stock_found.classList.add("hidden");
                no_stock_found.classList.remove("hidden");
            }
            console.log("No stock found.");
            break;
        case 1:
            // Stock found
            stock_found.classList.remove("hidden");
            no_stock_found.classList.add("hidden");

            let info = stocks[0];
            const info_list = [
                "stock_name",
                "exchange",
                "ticker",
                "current_price",
                "currency_change",
                "percent_change",
                "high",
                "low",
                "day_volume",
                "div_yield",
                "pe_ratio",
                "market_cap",
            ];
            for (field of info_list) {
                let dom_id = field.split("_").join("-");
                window[dom_id].innerHTML = info[field];
            }
            console.log("Extension display updated.");
            break;
        default:
			// Multiple stocks found
            choose_exchange(stocks);
    }
}

// Update popup to ask for intended exchange
// list stocks: List of stock info objects
function choose_exchange(stocks) {
    console.log("choose_exchange testing");
    update_stock_info([stocks[0]]); // For testing, display first option
}
