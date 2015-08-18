"use strict";
/**
 * Spiral lock for forms
 * @constructor lock
 */
var lock = {
    /**
     * Add lock
     * @param {String} [type] type of lock @see spiral.lock.types
     * @param {Object} context context to add lock
     * @returns {Function|*}
     */
    add: function (type, context) {
        if (!this.types.hasOwnProperty(type)) return false;
        var node = document.createElement("div");
        node.className = "spiral-lock " + this.types[type].class;
        node.innerHTML = this.types[type].html;
        context.appendChild(node);
        context.classList.add("locked");
        return this.types[type].progress;
    },
    /**
     * Remove lock
     * @param {String} type type of lock
     * @param {Object} context
     */
    remove: function (type, context) {
        if (!this.types.hasOwnProperty(type)) return false;
        context.classList.remove("locked");
        var spiralLock = context.querySelector(".spiral-lock");
        if (spiralLock) context.removeChild(spiralLock);
        return true;
    },
    /**
     * Object with lock types.
     * @enum {Object}
     */
    types: {
        /**
         * default lock type. <b>className:</b>spiral-lock-default
         * @type {Object}
         */
        "default": {
            /**
             * class name
             * @inner
             * @type String
             */
            class: "spiral-lock-default",
            /**
             * HTML
             * @inner
             * @type String
             */
            html: ''
            /**
             * Optional is to pass a function that will process progress. Below is example for bootstrap
             * @param current
             * @param total
             * progress: function (current, total) {
             *   var progress = this.context.getElementsByClassName("progress-bar")[0],
             *       sr = progress.getElementsByClassName("sr-only")[0],
             *       percent = ''+100 * (current / total);
             *   progress.setAttribute("aria-valuenow", percent);
             *   progress.style.width = percent + "%";
             *   sr.innerHTML = percent + "%  Complete";
             * }
             */

        }
    }
};

module.exports = lock;