// Attach event listeners to graph buttons
let graph_modes = document.querySelectorAll(".graph-mode");
graph_modes.forEach((graph_mode) => {
    graph_mode.addEventListener("click", () => {
        if (!graph_mode.classList.contains("active")) {
            document.querySelector(".graph-mode.active").classList.remove("active");
            graph_mode.classList.add("active");

            let active_id = graph_mode
                .getAttribute("id")
                .split("-")
                .slice(0, -1)
                .join("-");
            document.querySelector("canvas.active").classList.remove("active");
            document.querySelector("canvas#" + active_id).classList.add("active");
        }
    });
});

// Prompt highlight.js content script to get ticker from page
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { cmd: "get_ticker" }, (response) => {
        if (response.status === "done") {
            console.log("Highlight script finished processing.");

            // Prompt background script to get stock information from ticker
            chrome.runtime.sendMessage(
                {
                    cmd: "get_info",
                    ticker: response.ticker,
                    api_keys: [
                        ALPHAVANTAGE_API_KEY_1,
                        ALPHAVANTAGE_API_KEY_2,
                        ALPHAVANTAGE_API_KEY_3,
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
        const graph_list = ["graph_w", "graph_m"];
        for (graph_type of graph_list) {
            let dom_id = graph_type.split("_").join("-");
            let new_graph = new Chart(dom_id, {
                type: "scatter",
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
                },
            });
            console.log(stock[graph_type + "_pts"]);
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
