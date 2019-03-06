( function( $ ) {
    $.fn.conditionize = function( options ) {

        // Set options
        var settings = $.extend( {

            // Array of events on which to update condition
            updateOn: [ "change" ],

            // Main handler for a conditional section
            handlers: [ "toggleVisibility" ]
        }, options );

        // Main handler for a conditional section
        var handler = function( isMet, $section ) {
            settings.handlers.forEach(
                function( h ) {
                    if ( ( typeof h === "string" ) && $.fn.conditionize.handlers[ h ] ) {
                        $.fn.conditionize.handlers[ h ]( isMet, $section );
                    } else {
                        if ( typeof h === "function" ) {
                            h( isMet, $section );
                        }
                    }
                } );
            };

        return this.each( function() {
            var $section = $( this );
            var cond = $( this ).data( "condition" );
            var allFields = []; // All fields in the condition
            // First get all (distinct) used field/inputs
            cond = cond.replace( $.fn.conditionize.re, function( match, group ) {
                var selector = ( group.substring( 0, 1 ) === "#" ) ?
                    group :
                    "[name='" + group + "']";
                if ( $( selector ).length ) {
                    if ( allFields.indexOf( selector ) === -1 ) {
                        allFields.push( selector );
                    }
                    return "$.fn.conditionize.getValue(\"" + selector + "\")";
                } else {
                    return group;
                }

            } );

            //Set up event listeners
            allFields.forEach( function( field ) {
                $( field ).on( settings.updateOn.join( " " ), function() {
                  handler( eval( cond ), $section );
                } );
            } );

            //console.log($section);
            //console.log(cond);
            //Show based on current value on page load
            handler( eval( cond ), $section );
        } );
    };

    $.extend( $.fn.conditionize, {

        // Prepare a regexp to catch potential field names/ids.
        // Regexp has format like: "(#?[" + allowedNameSymbols + "]+)" + ifNotInQuotes
        "re": new RegExp( "(#?[a-z0-9_\\[\\]-]+)" +
            "(?:(?=([^\"]*\"[^\"]*\")*[^\"]*$)(?=([^']*'[^']*')*[^']*$))", "gi" ),

        /**
         * Get value(s) of a field by its selector
         *
         * @param {String} selector A string containing a standard jQuery selector expression
         *
         * @return {(String|Array)} A value of the field or an array values for each field if there are more than one matching inputs
         */
        getValue: function( selector ) {
            var vals;

            // Radio buttons are a special case. They can not be multivalue fields.
            if ( $( selector ).attr( "type" ) === "radio" ) {
                    vals = $( selector + ":checked" ).val();
            } else {
                vals = $( selector ).map( function() {
                    if ( $( this ).attr( "type" ) === "checkbox" ) {
                        return this.checked ? this.value : false;
                    } else {
                        return $( this ).val();
                    }
                } ).get();
                if ( vals.length === 1 ) {
                    vals = vals[ 0 ];
                }
            }
            return vals;
        },

        // Build-in handlers
        "handlers": {
            toggleVisibility: function( isMet, $section ) {
                if ( isMet ) {
                    $section.slideDown();
                } else {
                    $section.slideUp();
                }
            },
            clearFieldsIfNotMet: function( isMet, $section ) {
                if ( !isMet ) {
                    $section.find( "select, input" ).each( function() {
                        if ( ( $( this ).attr( "type" ) === "radio" ) ||
                             ( $( this ).attr( "type" ) === "checkbox" ) ) {
                            $( this ).prop( "checked", false ).trigger( "change" );
                        } else {
                            $( this ).val( "" ).trigger( "change" );
                        }
                    } );
                }
            },
            clearFieldsIfMet: function( isMet, $section ) {
                this.clearFieldsIfNotMet( !isMet, $section );
            }
        }
    } );
} )( jQuery );
