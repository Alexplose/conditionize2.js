( function( $ ) {
    $.fn.conditionize = function( options ) {

        var settings = $.extend( {
            hideJS: true
        }, options );

        $.fn.showOrHide = function( isMet, $section ) {
          if ( isMet ) {
            $section.slideDown();
          } else {
            $section.slideUp();
            $section.find( "select, input" ).each( function() {
                if ( ( $( this ).attr( "type" ) === "radio" ) ||
                     ( $( this ).attr( "type" ) === "checkbox" ) ) {
                    $( this ).prop( "checked", false ).trigger( "change" );
                } else {
                    $( this ).val( "" ).trigger( "change" );
                }
            } );
          }
        };

        /**
         * Get value(s) of a field by its selector
         *
         * @param {string} selector A string containing a standard jQuery selector expression
         *
         * @return {(string|Array)} A value of the field or an array values for each field if there are more than one matching inputs
         */
        function getValue( selector ) {
            var vals = $( selector ).map( function() {
                if ( ( $( this ).attr( "type" ) === "radio" ) ||
                     ( $( this ).attr( "type" ) === "checkbox" ) ) {
                    return this.checked ? this.value : false;
                } else {
                    return $( this ).val();
                }
            } ).get();
            if ( vals.length === 1 ) {
                return vals[ 0 ];
            } else {
                return vals;
            }
        };

        // Prepare a regexp to catch potential field names/ids.
        var ifNotInQuotes = "(?:(?=([^\"]*\"[^\"]*\")*[^\"]*$)(?=([^']*'[^']*')*[^']*$))";
        var allowedNameSymbols = "a-zA-Z0-9_\\-\\[\\]";
        var re = new RegExp( "(#?[" + allowedNameSymbols + "]+)" + ifNotInQuotes, "gi" );

        return this.each( function() {
            var $section = $( this );
            var cond = $( this ).data( "condition" );
            var allFields = []; // All fields in the condition

            // First get all (distinct) used field/inputs
            cond = cond.replace( re, function( match, group ) {
                var selector = ( group.substring( 0, 1 ) === "#" ) ?
                    group :
                    "[name='" + group + "']";
                if ( $( selector ).length ) {
                    if ( allFields.indexOf( selector ) === -1 ) {
                        allFields.push( selector );
                    }
                    return "getValue(\"" + selector + "\")";
                } else {
                    return group;
                }

            } );

            //Set up event listeners
            allFields.forEach( function( field ) {
                $( field ).on( "change", function() {
                  $.fn.showOrHide( eval( cond ), $section );
                } );
            } );

            //If setting was chosen, hide everything first...
            if ( settings.hideJS ) {
                $( this ).hide();
            }

            //Show based on current value on page load
            $.fn.showOrHide( eval( cond ), $section );
        } );
    };
} )( jQuery );
