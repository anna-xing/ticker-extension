let key1 = document.getElementById("alphavantage-key1");
let key2 = document.getElementById("alphavantage-key2");
let save_btn = document.getElementById("api-keys-save");

// Display initial API key values
let set_initial_key = (key_type, target_elem) => {
	chrome.storage.sync.get([key_type], (key) => {
		if (key[key_type] !== undefined) {
			target_elem.value = key[key_type];
		}
	});
}
set_initial_key('av_key1', key1);
set_initial_key('av_key2', key2);

// Remove saved notification when keys change
let remove_saved_notif = () => {
	save_btn.disabled = false;
}
key1.addEventListener('keydown', remove_saved_notif);
key2.addEventListener('keydown', remove_saved_notif);

// Save new keys to storage
let update_keys = () => {
	key1_val = key1.value;
	key2_val = key2.value;
	chrome.storage.sync.set({av_key1: key1_val}, () => {
		console.log("Alpha Vantage API key (1) has been stored.");
	});
	chrome.storage.sync.set({av_key2: key2_val}, () => {
		console.log("Alpha Vantage API key (2) has been stored.");
	});
	if (!save_btn.disabled) {
		save_btn.disabled = true;
	}
}

// Attach functions to submit action to avoid inline scripting
document.getElementById("api-keys").addEventListener('submit', (event) => {
	update_keys();
	event.preventDefault();
	return false;
});
