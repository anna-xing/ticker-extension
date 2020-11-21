# Description

A Google Chrome extension which displays stock information about a highlighted ticker symbol on the page.

# Tech Stack

* JavaScript
* Chart.js
* Alpha Vantage API

# WIP Notes

Todo:

* Use latest price for current price info, rather than last closing price.
* Figure out why rendered chart isn't showing data points.
* Fix P/E ratio issue where it becomes -9999.9...
* Add support for ETFs (overview returns info but not global_quote) — look into using IEX API?

Options to implement in options.html:

* Currency display
* High + low display (day, week, month, year, 5-year, all-time)
* Absolute + percent change (day, week, month)

Note to self: snake_case for JS, dash-case for HTML
