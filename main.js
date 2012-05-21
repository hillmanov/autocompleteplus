$(document).ready(function() {

	var DEFAULT_VALUE_SUFFIX = "-default-value";

	$("input[type!='submit'],textarea").each(function(i, e) {
		var name = $(this).attr('name');

		var source;
		if (source = getFieldStorage(name)) {
			$(this).autocomplete({
				source: source.reverse(),
				minLength: 0
			}).on('click focus', function() {
				$(this).autocomplete('search', '');
			});
		}
		
		$(".ui-autocomplete").eq(i).css('width', $(this).width());

		var defaultValue;
		if (defaultValue = getDefaultValue(name)) {
			$(this).val(defaultValue);
		}
	});

	$("form").submit(function() {
		$("input[type!='submit'],textarea").each(function(i, e) {
			var name = $(this).attr('name');
			var val = $(this).val();
			if (val.length) {
				updateStore(name, val);
			}
		});
		return true;
	})

	function updateStore(name, val) {
		var fieldLocalStorage = getFieldStorage(name);
		
		// Remove any past duplicates
		fieldLocalStorage = $.grep(fieldLocalStorage, function(value) {
		  return value != val;
		});
		
		fieldLocalStorage.push(val);
		fieldLocalStorage = fieldLocalStorage.slice(-10);

		localStorage[name] = JSON.stringify(fieldLocalStorage);
	}

	function getFieldStorage(name) {
		var fieldLocalStorage = localStorage[name];
		if (fieldLocalStorage) {
			return JSON.parse(fieldLocalStorage);
		}
		else {
			return [];
		}
	}

	function clearDefaultValue(name) {
		delete localStorage[name + DEFAULT_VALUE_SUFFIX];
		alert("Default value cleared");
	}

	function setDefaultValue(name, val) {
		localStorage[name + DEFAULT_VALUE_SUFFIX] = val;
		alert("Default value set");
	}

	function getDefaultValue(name) {
		return localStorage[name + DEFAULT_VALUE_SUFFIX];
	}

	chrome.extension.onRequest.addListener(
		function(request, sender, sendResponse) {
			
			var fieldName = $(document.activeElement).attr('name');

			switch(request.action) {
				case 'create':
					var value = $(document.activeElement).val();
					setDefaultValue(fieldName, value);
					break;

				case 'delete':
					clearDefaultValue(fieldName);
					break;
			}
		}
	);
});
