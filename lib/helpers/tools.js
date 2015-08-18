"use strict";

/**
 * @module tools
 * @namespace
 */
var tools = {
    /**
     * Merge multiple object into one object. Method will iterate over arguments and on conflict (key already exist in object) key will be overwrite
     * @param {Array} arguments
     * @param {Object} arguments.0 first object to merge
     * @param {Object} arguments.1 second object to merge
     * @param {Object} arguments.n n object to merge
     * @returns {Object}
     * @example
     * var obj1 = {
     *      key1:1
     * }
     * var obj2 = {
     *      key2:2
     * }
     * extend(obj1,obj2);  //return object {key1:1,key2:2}
     * @example
     * var obj1 = {
     *      key:1
     * }
     * var obj2 = {
     *      key:2
     * }
     * extend(obj1,obj2);  //return object {key:2}
     * @example
     * var obj1 = {
     *      key:1
     * }
     * var obj2 = {
     *      key:2
     * }
     * var obj3 = {
     *      key3:3
     * }
     * extend(obj1,obj2,obj3);  //return object {key:2,key3:3}
     *
     */
    extend: function () {
        var retObj = {};
        var attribute;
        for (var n = 0; n < arguments.length; n++) {
            if (Object.prototype.toString.call(arguments[n]) !== "[object Object]") {
                console.warn("Merging allowed only for objects. Passed value:", arguments[n]);
                continue;
            }
            for (attribute in arguments[n]) {
                retObj[attribute] = arguments[n][attribute];
            }
        }
        return retObj;
    }

};

module.exports = tools;