# Description

A Google Chrome extension which displays stock information about a highlighted ticker symbol on the page. 

This is currently operational, though a file with Alpha Vantage API keys needs to be manually added to the project's root folder in order to use it. These keys will always have to be manually generated through the [Alpha Vantage website](https://www.alphavantage.co/support/#api-key), but I'm currently adding the ability for users to add their keys through the extension options interface rather than through the source code.

To use the extension as is (it's not *yet* available through the Chrome Web Store):

* Clone this repository locally.
* Add a keys.js file to the root directory which defines 2 constant strings, named ALPHAVANTAGE_API_KEY_1 and ALPHAVANTAGE_API_KEY_2.
* Open Google Chrome and navigate to chrome://extensions.
* With Developer Mode turned on (see top right corner of browser), click the Load Unpacked button (near top left corner) and select your cloned folder.

This should allow you to see the extension in your list of Chrome extensions. Once it's enabled, you should be able to load a new page, highlight a ticker symbol, and click on the extension icon in your browser toolbar to see information on the ticker.

# Tech Stack

* JavaScript
* Chart.js
* Alpha Vantage API

# WIP Notes

Consider switching to IEX Cloud API for better data.

Options to implement in options.html:

* Add your own API keys from Alpha Vantage?
* Currency type (but this isn't very important b/c technicals stay the same besides the raw share value)
* High + low type (day, week, month, year, 5-year, all-time)
* Absolute + percent change type (daily, weekly, monthly)
