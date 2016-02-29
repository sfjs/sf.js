"use strict";

/**
 * @module tools
 * @namespace
 */
var tools = {
    resolveKeyPath : function(path, obj, safe) {
        return path.split('.').reduce(function(prev, curr) {
            return !safe ? prev[curr] : (prev ? prev[curr] : void 0)
        })
    }
};

module.exports = tools;