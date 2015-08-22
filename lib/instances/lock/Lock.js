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
        node.className = this.types[type].className || 'js-sf-lock';
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
        this.node.classList.remove("locked");
        var spiralLock = this.node.querySelector(".js-sf-lock");//todo this.lockNode ?
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
         * @type {Object}
         */
        spinner: {
            /**
             * HTML
             * @inner
             * @type String
             */
            html: '<div class="sf-spinner"></div>'
        },
        progress: {
            /**
             * HTML
             * @inner
             * @type String
             */
            html: '<div class="sf-progress"><div class="progress-line"></div></div>',
            /**
             * Function to change styles while AJAX progress
             * @param current
             * @param total
             */
            progress: function (current, total) {
                var progress = this.context.getElementsByClassName("progress-line")[0];
                progress.style.width = 100 * (current / total) + "%";
            }
        }
    };

    //we have to have some default locker, let it be spinner
    Lock.prototype.types.default = Lock.prototype.types.spinner;

    /**
     * Register lock
     */
    sf.instancesController.registerInstanceType(Lock);

})(spiralFrontend);
