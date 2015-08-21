"use strict";

(function(sf) {
    /**
     * Spiral lock for forms
     * @constructor lock
     */

    var Lock = function(spiral, node, options){
        this._construct(spiral, node, options);
    };

    /**
     * @lends Lock.prototype
     */
    Lock.prototype = Object.create(sf.modules.core.BaseDOMConstructor.prototype);

    /**
     * Name of module
     * @type {string}
     */
    Lock.prototype.name = "lock";

    /**
     * Function that call on new instance is created.
     * @param {Object} spiral
     * @param {Object} node  DomNode of form
     * @param {Object} [options] all options to override default
     * @private
     */
    Lock.prototype._construct = function(spiral, node, options){
        this.init(spiral, node, options);//call parent
        this.add(this.options.type,this.node);
    };
    /**
     * Add lock
     * @param {String} [type] type of lock @see spiral.lock.types
     * @param {Object} context context to add lock
     * @returns {Function|*}
     */
    Lock.prototype.add =function(type, context){
        if (!this.types.hasOwnProperty(type)){
            return false;
        }
        var node = document.createElement("div");
        node.className = "spiral-lock " + this.types[type].className;
        node.innerHTML = this.types[type].html;
        context.appendChild(node);
        context.classList.add("locked");
        return this.types[type].progress;
    };
    /**
     * Clear all variables and die
     */
    Lock.prototype.die = function () {
        this.remove();
    };
    /**
     * Remove lock
     */
    Lock.prototype.remove = function(){
        context.classList.remove("locked");
        var spiralLock = this.node.querySelector(".spiral-lock");
        if (spiralLock) {
            this.node.removeChild(spiralLock);
        }
        return true;
    };
    /**
     * Object with lock types.
     * @enum {Object}
     */
    Lock.prototype.types  = {
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
            className: "spiral-lock-default",
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
    };

    /**
     * Register lock
     */
    sf.instancesController.registerInstanceType(Lock);

})(spiralFrontend);
