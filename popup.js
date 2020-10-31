let stockName = document.getElementById('stock-name');
let exchange = document.getElementById('exchange');
let ticker = document.getElementById('ticker');

let currentPrice = document.getElementById('current-price');
let currencyChange = document.getElementById('currency-change');
let percentChange = document.getElementById('percent-change');

/*
let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function(data) {
	changeColor.style.backgroundColor = data.color;
	changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function(element) {
	let color = element.target.value;
	chrome.tabs.query({
		active: true, 
		currentWindow: true
	}, function (tabs) {
		chrome.tabs.executeScript(
			tabs[0].id,
			{code: 'document.body.style.backgroundColor = "' + color + '";'});
	});
};
*/
