$(document).ready(function() {

  var DEFAULT_VALUE_SUFFIX = "-default-value";
  var HISTORY = 6;

  $("input:not([type='submit']):not([type='password']),textarea").each(function(i, e) {
    
    initAutocompleteForField($(this));
    
    $(".ui-autocomplete").eq(i).css('width', $(this).width());

    // Only fill in the default value if there isn't something there already
    if (!$(this).val()) {
      var name = $(this).attr('name');
      var defaultValue;
      if (defaultValue = getDefaultValue(name)) {
        $(this).val(defaultValue);
      }
    }

  }).on('blur', function() {
    var name = $(this).attr('name');
    var val = $(this).val();
    if (val.length) {
      updateStore(name, val);
    }
    initAutocompleteForField($(this));
  });

  function initAutocompleteForField(field) {
    var name = $(field).attr('name');

    var source;
    if (source = getFieldStorage(name)) {
      $(field).autocomplete({
        source: source.reverse(),
        minLength: 0
      }).on('click focus', function() {
        $(field).autocomplete('search', '');
      });
    }
  }

  function updateStore(name, val) {
    var fieldLocalStorage = getFieldStorage(name);
    
    // Remove any past duplicates
    fieldLocalStorage = $.grep(fieldLocalStorage, function(value) {
      return value != val;
    });
    
    fieldLocalStorage.push(val);
    fieldLocalStorage = fieldLocalStorage.slice(-HISTORY);

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
    $.achtung({message: 'Default value cleared', className: 'achtungFail', timeout:5});
  }

  function setDefaultValue(name, val) {
    localStorage[name + DEFAULT_VALUE_SUFFIX] = val;
    $.achtung({message: 'Default value set', className: 'achtungSuccess', timeout:5});
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
