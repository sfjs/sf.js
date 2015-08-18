/**
 @overview Escape HTML tags in examples.
 @module plugins/escapeHtml
 @author Andrey Logunov <systerr@gmail.com>
 Based on https://github.com/jsdoc3/jsdoc/blob/master/plugins/escapeHtml.js
 */
'use strict';

exports.handlers = {
    /**
     Translate HTML tags in examples into safe entities.
     Replaces <, & and newlines
     */
    newDoclet: function(e) {

        if (e.doclet.examples) {
            e.doclet.examples.forEach(function(val,key,arr){
                arr[key] = val
                    .replace(/&/g,'&amp;')
                    .replace(/</g,'&lt;')
                    .replace(/\r\n|\n|\r/g, '<br>');
            })

        }
    }
};