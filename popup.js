// Attach event listeners to graph buttons
let graph_modes = document.querySelectorAll(".graph-mode");
graph_modes.forEach((graph_mode) => {
    graph_mode.addEventListener("click", () => {
        if (!graph_mode.classList.contains("active")) {
            document.querySelector(".graph-mode.active").classList.remove("active");
            graph_mode.classList.add("active");

            let active_id = graph_mode.getAttribute("id").split("-").slice(0, -1).join('-');
            document.querySelector("canvas.active").classList.remove("active");
            document.querySelector("canvas#" + active_id).classList.add("active");
        }
    });
});

let loading = document.querySelector("#loading");
loading.classList.remove("hidden");

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
                    } else if (response.status === "overload") {
                        console.log("Background script has returned: The API has been called too frequently.");
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
    loading.classList.add("hidden");

    switch (stocks.length) {
        case 0:
            // No stock found
            if (no_stock_found.classList.contains("hidden")) {
                no_stock_found.classList.remove("hidden");
            }
            console.log("No stock found.");
            break;
        case 1:
            // Stock found
            stock_found.classList.remove("hidden");
            no_stock_found.classList.add("hidden");
            let info = stocks[0];

            // Update text fields
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
                if (!info[field] || info[field] === 'None') {
                    window[dom_id].classList.add("none");
                } else {
                    window[dom_id].classList.remove("none");
                }
                window[dom_id].innerHTML = format_val(info[field], field);
            }

            // Update graphs
            const graph_list = [
                "graph_d",
                "graph_w",
                "graph_m",
                "graph_y",
                "graph_5y"
            ];
            for (graph_type of graph_list) {
                let dom_id = graph_type.split("_").join("-");
                let new_graph = new Chart(dom_id, {
                    type: 'line',
                    data: info[graph_type + "_pts"]
                });
                window[dom_id] = new_graph;
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

// Format a returned value (str) based on its type (str)
function format_val(val, type) {
    if (val === "None" || !parseFloat(val)) return val;

    val = parseFloat(val);
    let dec2 = [
        "current_price", 
        "currency_change", 
        "percent_change",
        "high",
        "low",
        "div_yield",
        "pe_ratio"
    ];
    let large = ["day_volume", "market_cap"];

    if (dec2.includes(type)) return parseFloat(val).toFixed(2).toString();
    if (large.includes(type)) {
        if (val > 999999999) return (val / 1000000000).toFixed(2).toString() + ' B';
        if (val > 999999) return (val / 1000000).toFixed(2).toString() + ' M';
        if (val > 999) return val.toString().slice(0, -3) + ',' + val.toString().slice(-3,);
        return val;
    }
}
