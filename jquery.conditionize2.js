;(function($) {
  $.fn.conditionize = function(options) {
    // Set options
    var settings = $.extend({
      // Array of events on which to update condition
      updateOn: [ 'change' ],
      // Initial action. By default: hide everything first
      initialAction: function($section) {
        $section.hide();
      },
      // Toggle visibility
      showAndHide: true,
      // Clear all input values
      clearFields: false,
      // Add your own custom handler. A function(is_met, $section) {...}
      additionalHandler: false
    }, options );

    // Is function
    function isFunction(obj) {
      return (obj && {}.toString.call(obj) === '[object Function]');
    }
    // Clear all input values
    var clearSection = function($section) {
        $section.find('select, input').each(function(){
            if ( ($(this).attr('type')=='radio') || ($(this).attr('type')=='checkbox') ) {
                $(this).prop('checked', false).trigger('change');
            }
            else{
                $(this).val('').trigger('change');
            }
        });
    }
    // Main handler for a conditional section
    var handler = function(is_met, $section, settings) {
      if (settings.showAndHide) {
        if (is_met) {
          $section.slideDown();
        }
        else {
          $section.slideUp();
        }
      }
      if (settings.clearFields && !is_met) {
        clearSection($section);
      }
      // if additionalHandler is a function
      if (isFunction(settings.additionalHandler)) {
        settings.additionalHandler(is_met, $section);
      }
    }

    return this.each( function() {
      var $section = $(this);
      var cond = $(this).data('condition');
      // This is a regex suffix that will make sure that the string is not inside quotes
      var ifNotInQuotes = "(?:(?=([^\"]*\"[^\"]*\")*[^\"]*$)(?=([^']*'[^']*')*[^']*$))";
      // First get all (distinct) used field/inputs
      var re = new RegExp("(#?[0-9a-z-_]*[a-z][0-9a-z-_]*)" + ifNotInQuotes, 'gi');
      var match = re.exec(cond);
      var inputs = {}, e = "", name ="", tmp_re = "";
      while(match !== null) {
        name = match[1];
        e = (name.substring(0,1)=='#' ? name : "[name=" + name + "]");
        if ( $(e).length && ! (name in inputs) ) {
            inputs[name] = e;
        }
        match = re.exec(cond);
      }
      // Replace fields names/ids by $().val()
      for (name in inputs) {
        e = inputs[name];
        tmp_re = new RegExp("(" + name + ")\\b" + ifNotInQuotes, 'g')
        if ( ($(e).attr('type')=='radio') || ($(e).attr('type')=='checkbox') ) {
          cond = cond.replace(tmp_re,"$('" + e + ":checked').val()");
        }
        else {
          cond = cond.replace(tmp_re,"$('" + e + "').val()");
        }
      }
      // Set up event listeners
      for (name in inputs) {
        $(inputs[name]).on(updateOn.join(' '), function() {
          handler(eval(cond), $section, settings);
        });
      }
      // Apply initial action
      if (isFunction(settings.initialAction)) {
        settings.initialAction($section);
      }
      // Apply handler based on current value on page load
      handler(eval(cond), $section, settings);
    });
  }
}(jQuery));
