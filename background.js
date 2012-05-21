createProperties = {
	title: 'Make this the default value',
	contexts: ['editable'],
	onclick: function(data, tab) {
		chrome.tabs.sendRequest(tab.id, {action: 'create', item: data});
	}
}

chrome.contextMenus.create(createProperties);

deleteProperties = {
	title: 'Clear the default Value',
	contexts: ['editable'],
	onclick: function(data, tab) {
		chrome.tabs.sendRequest(tab.id, {action: 'delete', item: data});
	}
}

chrome.contextMenus.create(deleteProperties);
