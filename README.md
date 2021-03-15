# Description

A Google Chrome extension which displays stock information about a highlighted ticker symbol on the page. 

This extension is currently pending review in the Chrome Web Store. To try it out in the meantime:
* Clone this repository locally.
* Open Google Chrome and navigate to chrome://extensions.
* With Developer Mode turned on (see top right corner of browser), click the Load Unpacked button (near top left corner) and select the cloned repository folder.

This should allow you to see the extension in your list of Chrome extensions. Once it's enabled, you should be able to input your API key(s) as directed, open a new page, highlight a ticker symbol, and click on the extension icon in your browser toolbar to see information on the ticker.

To use it (after it's approved for the Chrome Web Store):
* Install Stock Ticker Lookup through the Chrome Web Store.
* Follow the instructions provided upon installation to obtain your Alpha Vantage API key(s).
* Use your cursor to highlight a ticker symbol on any webpage and click on the extension in your toolbar to display the relevant stock information.

# Tech Stack

* JavaScript
* Chart.js
* Alpha Vantage API

# Troubleshooting

If the popup appears to be loading for a long time without returning results, check that you have inputted valid API keys in the extension options. The options page can be accessed by going to [chrome://extensions](chrome://extensions), clicking on the 'Details' button under Ticker Extension, and opening the 'Extension options' link near the bottom of the page.

# Dev Notes
Features to implement:
* Make extension pop up upon highlight, not upon click -- pre-scan the page?
* Graph different price timelines (1mo, 12mo, 1y, 5y)
* Refactor to use a different API with higher limits?
