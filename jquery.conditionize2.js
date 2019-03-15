( function( $ ) {
    $.fn.conditionize = function( options ) {

        // Set options
        var settings = $.extend( {

            // Array of events on which to update condition
            updateOn: ["load", "change"],

            // Set actions for condition
            ifTrue: 'show',
            ifFalse: 'hide'
        }, options );

        // Prepare and validate settings
        // TODO: Validate types
        // TODO: Validate that actions exist
        if (Array.isArray(settings.updateOn)) {
            settings.updateOn = settings.updateOn.join(' ');
        }
        if ((typeof settings.ifTrue === "string") ||
            (typeof settings.ifTrue === "function")) {
            settings.ifTrue = [ settings.ifTrue ];
        }
        if ((typeof settings.ifFalse === "string") ||
            (typeof settings.ifFalse === "function")) {
            settings.ifFalse = [ settings.ifFalse ];
        }

        // Main handler for a conditional section
        var handler = function( isMet, $section ) {
            var actions;
            if (isMet) {
                actions = settings.ifTrue;
            } else {
                actions = settings.ifFalse;
            }

            actions.forEach(
                function( h ) {
                    if ( typeof h === "string" ) {
                        if ( h.startsWith("trigger") ) {
                            if (h === "trigger") {
                                $.fn.conditionize.actions[ h ]( $section, settings.updateOn );
                            } else {
                                $.fn.conditionize.actions[ h ]( $section, h.slice(8).split(/[\s,]+/) );
                            }
                        } else {
                            $.fn.conditionize.actions[ h ]( $section );
                        }
                    } else {
                        if ( typeof h === "function" ) {
                            h( $section );
                        }
                    }
                }
            );
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
                $( field ).on( settings.updateOn, function() {
                  handler( eval( cond ), $section );
                } );
            } );

            //Show based on current value on page load
            if (settings.updateOn.split(' ').indexOf('load') !== -1) {
                // If already loaded
                if (document.readyState === 'complete') {
                    handler( eval( cond ), $section );
                } else {
                    $(window).on('load', function(){
                        handler( eval( cond ), $section );
                    });
                }
            }
            if (settings.updateOn.split(' ').indexOf('ready') !== -1) {
                $(document).ready(function(){
                    handler( eval( cond ), $section );
                });
            }
        } );
    };

    $.extend( $.fn.conditionize, {
        // Prepare a regexp to catch potential field names/ids.
        // Regexp has format like: "(#?[" + allowedNameSymbols + "]+)" + ifNotInQuotes
        re: new RegExp( "(#?[a-z0-9_\\[\\]-]+)" +
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

        // Build-in actions
        actions: {
            show : function ($section) {
                $section.slideDown();
            },
            hide: function ($section) {
                $section.slideUp();
            },
            clear: function($section) {
                $section.find( "select, input" ).each( function() {
                    if ( ( $( this ).attr( "type" ) === "radio" ) ||
                         ( $( this ).attr( "type" ) === "checkbox" ) ) {
                        $( this ).prop( "checked", false )
                    } else {
                        $( this ).val( "" );
                    }
                    $( this ).trigger( "change" )
                } );
            },
            trigger: function($section, events) {
                if (Array.isArray(events)) {
                    events = events.join(' ');
                }
                $section.trigger(events);
            }
        }
    } );
} )( jQuery );