"use strict";

(function(sf){

    /**
     * Spiral Forms
     * @param {Object} spiral
     * @param {Object} node  DomNode of form
     * @param {Object} [options] all options to override default
     * @constructor
     * @extends BaseDOMConstructor
     */
    var Form = function (spiral, node, options) {
        this._construct(spiral, node, options);
    };


    /**
     * @lends spiral.Form.prototype
     */
    Form.prototype = Object.create(sf.modules.core.BaseDOMConstructor.prototype);

    /**
     * Name to register
     * @type {string}
     */
    Form.prototype.name = "form";

    /**
     * Function that call on new instance is created.
     * @param {Object} spiral
     * @param {Object} node  DomNode of form
     * @param {Object} [options] all options to override default
     * @private
     */
    Form.prototype._construct = function(spiral, node, options){
        this.init(spiral, node, options);//call parent

        if (this.options.fillFrom) {//id required to fill form
            this.fillFieldsFrom();
        }
        /**
         * @extends DOMEvents
         * @type {DOMEvents}
         * @inheritDoc
         * */
        this.DOMEvents = new this.spiral.modules.helpers.DOMEvents();
        this.addEvents();

        this.events = new this.spiral.modules.core.Events(["onBeforeSend", "onSuccess", "onError", "onAlways"]);
    };
    /**
     * @override
     * @inheritDoc
     * @enum {Object}
     */
    Form.prototype.optionsToProcess = {
        /**
         * Link to form
         */
        "context": {
            "processor": function (form) { //processor
                return form;
            }
        },
        /**
         * Link to 'this'
         */
        self: {
            "processor": function (form) {
                return this;
            }
        }
    };

    /**
     * @override
     * @inheritDoc
     * @enum {String}
     */
    Form.prototype.attributesToGrab = {//option to grab from forms
        /**
         * URL to send form (if ajax form) <b>Default: "/"</b>
         */
        "action": {
            "key": "url",
            "value": "/"
        },
        /**
         * Method to send to send form (if ajax form) <b>Default: "POST"</b>
         */
        "method": {
            "value": "POST"
        },
        /**
         * Lock type when form sending <b>Default: "default"</b> @see spiral.lock
         */
        "data-lockType": {
            "value": "default",
            "key": "lockType"
        },
        /**
         *
         */
        "data-messagesType": {
            "value": "spiral",
            "key": "messagesType"
        },
        /**
         * Position for the message. bottom || top || selector <b>Default: "bottom"</b>
         */
        "data-messagePosition": {
            "value": "bottom",
            "key": "messagePosition"
        },
        /**
         * Position of the inputs messages. bottom || top || selector <b>Default: "bottom"</b>
         */
        "data-messagesPosition": {
            "value": "bottom",
            "key": "messagesPosition"
        },
        /**
         * Use ajax to submit form <b>Default: true</b>
         */
        "data-useAjax": {// attribute of form
            "value": true, //default value
            "key": "useAjax", // key to return
            "processor": function (val, form) { // processor to process data before return
                val = (val !== void 0 && val !== null) ? val.toLowerCase() : '';
                if (val === 'false') {
                    val = false;
                } else if (val === 'true') {
                    val = true;
                } else {
                    val = this.value;// default value available as this.value
                }
                return val;
            }
        },
        /**
         * Callback after form submitting <b>Default: false</b>
         * <br/>
         * <b> Example </b>
         * function(options){
     *  //options contains all options after send
     * }
         */
        "data-callback": {// attribute of form
            "value": false, //default value
            "key": "ajaxCallback" // key to return
        },
        "data-before-submit": {// attribute of form
            "value": false, //default value
            "key": "beforeSubmitCallback" // key to return
        },
        "data-after-submit": {// attribute of form
            "value": false, //default value
            "key": "afterSubmitCallback" // key to return
        }
    };


    /**
     * Call on form submit
     * @param {Event} e submit event
     */
    Form.prototype.onSubmit = function (e) {
        if (this.spiral.instancesController.getInstance('lock',this.node)){//on lock we should'n do any actions
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        if (this.options.messagesType && this.getAddon('formMessages',this.options.messagesType)){
            this.getAddon('formMessages',this.options.messagesType).clear(this.options);
        }

        this.options.data = this.getFormData();

        // We can send files only with FormData
        // If form contain files and no FormData than disable ajax
        if (!window.FormData && this.options.context.querySelectorAll("input[type='file']").length !== 0) {
            this.options.useAjax = false;
        }

        //spiral.events.performAction("beforeSubmit", this.options);
        //this.events.performAction("beforeSubmit", this.options);

        if (this.options.useAjax) {

            this.send(this.options);

            e.preventDefault();
            e.stopPropagation();
        }
    };

    /**
     * Locker. Add or remove.
     * @param {Boolean} [remove]
     */
    Form.prototype.lock = function (remove) {
        if (!this.options.lockType || this.options.lockType === 'none'){
            return;
        }
        if (remove){
            if (!this.spiral.instancesController.removeInstance("lock",this.node)){
                console.warn("You try to remove 'lock' instance, but it not available or not started");
            }
        } else {
            if (!this.spiral.instancesController.addInstance("lock",this.node,{type:this.options.lockType})){
                console.warn("You try to add 'lock' instance, but it not available or already started");
            }
        }
    };

    /**
     * Send form to server
     * @param sendOptions
     */
    Form.prototype.send = function (sendOptions) {
        var that = this;
        this.lock();
        if (sendOptions.beforeSubmitCallback) {
            var fn = eval(sendOptions.beforeSubmitCallback);
            if (typeof(fn) === "function") {
                fn.call(sendOptions);
            }
        }
        //this.spiral.ajax.send(tools.extend(sendOptions)).then(
        this.spiral.ajax.send(sendOptions).then(
            function(answer){
                that.events.trigger("onSuccess", sendOptions);
                return answer;
            },
            function(error){
                that.events.trigger("onError", sendOptions);
                return error;
            }).then(function(answer){
                that.lock(true);
                if (that.options.messagesType && that.getAddon('formMessages',that.options.messagesType)){
                    that.getAddon('formMessages',that.options.messagesType).show(that.options, answer);
                }
                that.events.trigger("onAlways", sendOptions);
            });
    };

    /**
     * Serialize form
     */
    Form.prototype.getFormData = function () {
        if (!!window.FormData) {
            return new FormData(this.options.context);
        } else {
            console.log("Form `" + this.options.context + "` were processed without FormData.");
            return new formToObject(this.options.context);
        }
    };

    /**
     * Set options (overwrite current)
     * @param {Object} opt options
     */
    Form.prototype.setOptions = function (opt) {
        this.options = this.spiral.modules.tools.extend(this.options, opt);
    };

    /**
     * Add all events for forms
     */
    Form.prototype.addEvents = function () {
        var that = this;
        this.DOMEvents.add([
            {
                DOMNode: this.options.context,
                eventType: "submit",
                eventFunction: function (e) {
                    that.onSubmit.call(that, e)
                }
            }
        ]);
    };

    /**
     * Clear all variables and die
     */
    Form.prototype.die = function () {
        this.DOMEvents.removeAll();
    };

    /**
     * Register form
     */
    sf.instancesController.registerInstanceType(Form,"js-spiral-form");

})(spiralFrontend);


