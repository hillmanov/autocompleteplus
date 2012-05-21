$(document).ready(function() {

	$("input[type!='submit'],textarea").each(function(i, e) {
		var name = $(this).attr('name');
		$(this).autocomplete({
			source: getFieldStorage(name).reverse(),
			minLength: 0
		}).on('click focus', function() {
			$(this).autocomplete('search', '');
		})
	});

	$("form").submit(function() {
		$("input[type!='submit'],textarea").each(function(i, e) {
			var name = $(this).attr('name');
			var val = $(this).val();
			updateStore(name, val);
		});
		return true;
	})

	function updateStore(name, val) {
		var fieldLocalStorage = getFieldStorage(name);

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
});