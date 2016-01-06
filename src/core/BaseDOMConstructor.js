"use strict";
//var tools = require("../helpers/tools");
/**
 * This a base constructor (class) for any DOM based instance.
 * This constructor just grab all node attributes and generates options. All processed options stored at this.options
 * @example
 * We have html like this:
 * <div data-test="testValue" data-value="value123">.....</div>
 * this.options will be:
 * {
 *  test:"testValue",
 *  value:"value"
 * }
 * Note: data-test and data-value should be described in attributesToGrab
 * @constructor
 */
var BaseDOMConstructor = function () {
};
/**
 * Init method. Call after construct instance
 * @param {Object} spiral
 * @param {Object} node  DomNode of form
 * @param {Object} [options] all options to override default
 */
BaseDOMConstructor.prototype.init = function (spiral, node, options) {
    //TODO data-spiral-JSON
    this.spiral = spiral;
    this.node = node;
    this.options = Object.assign(this.grabOptions(node), options);
    //this.options = tools.extend(this.getProcessedAttributes(node), this.getProcessedOptions(node));
    //if (options) {//if we pass options extend all options by passed options
    //    this.options = tools.extend(this.options, options);
    //}
};


/**
 * This is a attributes to grab from node. All child should have own list of attributesToGrab.
 * All options are optional. But recommended to provide value or processor to avoid error when dom node have no this attribute
 * @type {Object}
 * @deprecated
 * @property {Object} propertyKey - object of one attribute name
 * @property {String} propertyKey.value - default value (if attribute not provided this value will be returned
 * @property {String} propertyKey.key - key to return. If not provided will be use attribute of node ("propertyKey" in this case)
 * @property {Function} propertyKey.processor -  processor to process data before return
 * @property {Object}  ... - Another object of one property
 * @example
 * "data-some-attribute": {// attribute of node
 *      value: true,
 *      key: "someAttribute",
 *      processor: function (val, node, instance) {
 *          //some calculations
 *      return someValue;
 *      }
 *  },
 *  "data-another-attribute":{...},
 *  "..."
 *
 * @example
 * //Grab attribute "data-attribute" as "MyAttribute" if attribute not provided return "DefaultValue"
 * // Dom node <div data-attribute="someValue"></div>
 * "data-attribute": {
 *      value: "DefaultValue",
 *      key: "MyAttribute"
 *  }
 *  //after processing we should have
 *  {"MyAttribute":"someValue"}
 * @example
 * //Grab attribute "data-attribute" as "MyAttribute" and return some value instead
 * //Dom node  <div data-attribute="someValue"></div>
 * "data-attribute": {
 *      key: "MyAttribute"
 *      processor: function (val, node, instance) {
 *          return val+"SomeCalculation";
 *      }
 *  }
 *  //after processing we should have
 *  {"MyAttribute":"someValueSomeCalculation"}
 */
BaseDOMConstructor.prototype.attributesToGrab = {};
/**
 * This is a options to generate.
 * You should provide processor or value.
 * Key difference between attributesToGrab that optionsToProcess can generate some values (like init time, this reference, etc)
 * and this option is not depending on dom.
 * @deprecated
 * @type {Object}
 * @property {Object} propertyKey - object of property
 * @property {String} propertyKey.value - default value to return
 * @property {Function} propertyKey.processor -  processor to process data before return
 * @property {Object}  ... - Another object of one property
 * @example
 *  "context": {
 *      "processor": function (form) { //processor
 *          return form;
 *      }
 *  },
 *  "Another-key":{...},
 *  "..."
 *
 * @example
 * processAnswer: {
 *      "value": function (options) {
 *         return "someVal";
 *      }
 *  //after processing we should have
 *  {"processAnswer":function (options) {
 *         return "someVal";
 *      }
 *   }
 *
 * @example
 * initTime: {
 *      "processor": function (options) {
 *         return new Date().getTime;
 *      }
 *  //after processing we should have
 *  {"initTime":1429808977404}
 * @example
 * processAnswer: {
 *      "processor": function (options) {
 *         return "someVal";
 *      }
 *  //after processing we should have
 *  {"processAnswer":"someVal"}
 */
BaseDOMConstructor.prototype.optionsToProcess = {};

/**
 * This is a options to generate.
 * You should provide processor or value.
 * @type {Object}
 * @property {Object} propertyKey - object of property
 * @property {String} propertyKey.value - default value to return
 * @property {String} [propertyKey.domAttr] - dom attribute to grab data
 * @property {Function} [propertyKey.processor] -  processor to process data before return
 * @property {Object}  ... - Another object of one property
 * @type {{}}
 *  @example
 * "someAttribute": {// key
 *      value: true, //default Value
 *      domAttr: "data-some-attribute", // attribute from node to grab
 *      processor: function (node,val) { //processor to process values before return
 *          //some calculations
 *      return someValue;
 *      }
 *  },
 *  "anotherAttribute":{...},
 *  "..."
 *
 *  @example
 *  //return node as value
 *  "context": {
 *      "processor": function (node,val) { //processor
 *          return node;
 *      }
 *  },
 *  "Another-key":{...},
 *  "..."
 * @example
 * //Grab attribute "data-attribute" as "MyAttribute" if attribute not provided return "DefaultValue"
 * // Dom node <div data-attribute="someValue"></div>
 * "MyAttribute": {
 *      value: "DefaultValue",
 *      domAttr: "data-attribute"
 *  }
 *  //after processing we should have
 *  {"MyAttribute":"someValue"}
 *
 *  @example
 * //Grab attribute "data-attribute" as "MyAttribute" and return some value instead
 * //Dom node  <div data-attribute="someValue"></div>
 * "MyAttribute": {
 *      domAttr: "data-attribute",
 *      processor: function (node,val) {
 *          return val+"SomeCalculation";
 *      }
 *  }
 *  //after processing we should have
 *  {"MyAttribute":"someValueSomeCalculation"}
 *
 * @example
 * //return function as value
 * processAnswer: {
 *      "value": function (options) {
 *         return "someVal";
 *      }
 *  //after processing we should have
 *  {"processAnswer":function (options) {
 *         return "someVal";
 *      }
 *   }
 *
 * @example
 * //return init time as value
 * initTime: {
 *      "processor": function (option) {
 *         return new Date().getTime;
 *      }
 *  //after processing we should have
 *  {"initTime":1429808977404}
 * @example
 * //return other value instead of real one
 * processAnswer: {
 *      "processor": function (option) {
 *         return "someVal";
 *      }
 *  //after processing we should have
 *  {"processAnswer":"someVal"}
 */
BaseDOMConstructor.prototype.optionsToGrab = {};

/**
 * Grab all options that described in optionsToGrab
 * @param {Object} node domNode
 * @return {Object}
 */
BaseDOMConstructor.prototype.grabOptions = function (node) {
    var options = {};
    var currentOptionValue;
    var currentOption;
    for (var option in this.optionsToGrab) {
        currentOptionValue = null;
        if (this.optionsToGrab.hasOwnProperty(option)) {//if this is own option
            currentOption = this.optionsToGrab[option];
            if (currentOption.hasOwnProperty("value")) {//we have default option. Let's grab it for first
                currentOptionValue = currentOption.value;
            }

            if (currentOption.hasOwnProperty("domAttr") && node.attributes.hasOwnProperty(currentOption.domAttr)) {//we can grab the attribute of node
                currentOptionValue = node.attributes[currentOption.domAttr].value;
            }

            if (currentOption.hasOwnProperty("processor")) {//we have processor. Let's execute it
                currentOptionValue = currentOption.processor.call(this, node, currentOptionValue, currentOption);
            }

            if (currentOptionValue !== null) {
                options[option] = currentOptionValue;
            }

        }
    }
    return options;
};

/**
 * Iterate over this.attributesToGrab and get processed attributes from node
 * @param {Object} node dom node to grab attributes
 * @returns {Object}
 * @deprecated
 */
BaseDOMConstructor.prototype.getProcessedAttributes = function (node) {
    console.warn("getProcessedAttributes method is deprecated. It will be removed in 0.5 version");
    debugger;
    var options = {},
        index,
        key,
        val;
    for (index in this.attributesToGrab) {// loop over attributesToGrab
        if (this.attributesToGrab.hasOwnProperty(index)) {//if this is own option
            key = (this.attributesToGrab[index].key) ? this.attributesToGrab[index].key : index; //detect key to object
            if (node.attributes.hasOwnProperty(index)) {// if node have this attribute
                val = node.attributes[index].value
            } else {// if node have NO this attribute
                val = null;
            }
            if (this.attributesToGrab[index].processor) {//if processor is available
                options[key] = this.attributesToGrab[index].processor(val, node, this);//call processor
            } else {
                options[key] = (val) ? val : this.attributesToGrab[index].value;//set value
            }
        }
    }
    return options;
};

/**
 * Iterate over this.optionsToProcess and get processed options
 * Process options and return results
 * @param {Object} node dom node
 * @deprecated
 */
BaseDOMConstructor.prototype.getProcessedOptions = function (node) {
    console.warn("getProcessedOptions method is deprecated. It will be removed in 0.5 version");
    debugger;
    var options = {},
        index;
    for (index in this.optionsToProcess) {// loop over this.optionsToProcess
        if (this.optionsToProcess.hasOwnProperty(index)) {//if this is own option
            if (this.optionsToProcess[index].processor) {//if processor is available
                options[index] = this.optionsToProcess[index].processor.call(this, node);//call processor
            } else {
                options[index] = this.optionsToProcess[index].value;//set value
            }
        }
    }
    return options;
};


/**
 * Get addon for instance
 * @param {String} addonType type of addon (message,fill,etc)
 * @param {String} addonName name of addon
 */
BaseDOMConstructor.prototype.getAddon = function (addonType, addonName) {
    return this.spiral.instancesController.getInstanceAddon(this.name, addonType, addonName);
};

module.exports = BaseDOMConstructor;
