// Prompt highlight.js content script to get ticker from page
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { cmd: "get_ticker" }, (response) => {
        if (response.status === "done") {
            console.log("Highlight script finished processing.");

            // Prompt background script to get stock information from ticker
            key1 = chrome.storage.sync.get(['av_key1'], () => {});
            if (key1) { key1 = key1.trim(); };
            key2 = chrome.storage.sync.get(['av_key2'], () => {});
            if (key2) { key2 = key2.trim(); };
            chrome.runtime.sendMessage(
                {
                    cmd: "get_info",
                    ticker: response.ticker,
                    api_keys: [
                        key1,
                        key2,
                    ],
                },
                (response) => {
                    document.querySelector("#loading").classList.add("hidden");
                    if (response.status === "done") {
                        console.log("Background script finished processing.");
                        update_stock_info(response.stock);
                    } else if (response.status === "overload") {
                        console.log(
                            "Background script has returned: The API has been called too frequently."
                        );
                        document.querySelector("#overload").classList.remove("hidden");
                    }
                }
            );
        }
    });
});

// Update popup fields with stock information
// list stock: List of stock info objects, each containing respective stock info
function update_stock_info(stock) {
    let stock_found = document.querySelector("#stock-found");
    let no_stock_found = document.querySelector("#no-stock-found");

    if (!stock) {
        // No stock found
        if (no_stock_found.classList.contains("hidden")) {
            no_stock_found.classList.remove("hidden");
        }
        console.log("No stock found.");
    } else {
        // Stock found
        stock_found.classList.remove("hidden");
        no_stock_found.classList.add("hidden");

        // Update text fields
        const info_list = [
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
            if (!stock[field] || stock[field] === "None") {
                window[dom_id].classList.add("none");
            } else {
                window[dom_id].classList.remove("none");
            }
            window[dom_id].innerHTML = format_val(stock[field], field);
        }
        // Link stock name to Yahoo Finance
        let name = document.createElement("a");
        name.href = new URL("https://finance.yahoo.com/quote/" + stock["ticker"]);
        name.target = "_blank";
        name.innerText = stock["stock_name"];
        window["stock-name"].appendChild(name);

        // Update graphs
        const graph_list = ["graph_w"]; // Will possibly add more graphs later
        for (graph_type of graph_list) {
            let dom_id = graph_type.split("_").join("-");
            // Remove graph from DOM if information was not returned for it 
            // i.e. API limit has been reached
            if (stock[graph_type + '_pts'].length == 0) {
                let no_graph_msg = document.createElement("p");
                let node = document.createTextNode("Graph data is temporarily unavailable due to API limits.");
                no_graph_msg.appendChild(node);
                window[dom_id].remove();
                document.getElementById("graph").appendChild(no_graph_msg);
            }
            let new_graph = new Chart(dom_id, {
                type: 'line',
                data: {
                    datasets: [
                        {
                            data: stock[graph_type + "_pts"],
                        },
                    ],
                },
                options: {
                    legend: {
                        display: false,
                    },
                    scales: {
                        xAxes: [{
                            type: 'time',
                            distribution: 'series',
                            time: {
                                unit: 'day'
                            }
                        }]
                    }
                },
            });
            window[dom_id] = new_graph;
        }
        console.log("Extension display updated.");
    }
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
        "pe_ratio",
    ];
    let large = ["day_volume", "market_cap"];

    if (dec2.includes(type)) return parseFloat(val).toFixed(2).toString();
    if (large.includes(type)) {
        if (val > 999999999) return (val / 1000000000).toFixed(2).toString() + " B";
        if (val > 999999) return (val / 1000000).toFixed(2).toString() + " M";
        if (val > 999)
            return val.toString().slice(0, -3) + "," + val.toString().slice(-3);
        return val;
    }
}
