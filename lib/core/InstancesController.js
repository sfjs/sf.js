"use strict";

/**
 * Instance controller
 * @param spiral
 * @constructor
 */
var InstancesController = function (spiral) {
    this.spiral = spiral;
    if (!this.constructor){
        console.error("Please call InstancesController with new  - 'new InstancesController()' ");
        return;
    }
    this._storage = {
        settings: {},
        instances: {}
    };

    //todo decide if we need this
    //["onAddInstance", "onRemoveInstance"]
    //this.events = new spiral.modules.core.Events();
};
/**
 * Register new instance type
 * @param {Function} constructorFunction - constructor function of instance
 * @param {String} className - class name of instance
 * @param {Boolean} [isSkipInitialization]  - skip component initialization, just adding, no init nodes.
 */
InstancesController.prototype.registerInstanceType = function (constructorFunction, className, isSkipInitialization) {
    if (!constructorFunction.prototype.name){
        console.error("Instance constructor should have name inside it");
    }
     if (this._storage.settings.hasOwnProperty(className)){
        console.error("Instance Constructor for type %s already added. Skipping",constructorFunction.prototype.name);
        return;
    }
    this._storage.settings[className] = {//init storage fields
        "typeName": constructorFunction.prototype.name,
        "constructor": constructorFunction
    };
    this._storage.instances[constructorFunction.prototype.name] = [];
    if (!isSkipInitialization){
        var nodes = document.getElementsByClassName(className);//init add nodes with this class
        for (var i = 0, max = nodes.length; i < max; i++) {
            this.addInstance(className, nodes[i]);
        }
    }

};

/**
 * Old method to register instance type
 * @param className
 * @param constructorFunction
 * @param isSkipInitialization
 * @deprecated
 */
InstancesController.prototype.addInstanceType =function(className,constructorFunction, isSkipInitialization){
    console.warn("addInstanceType is deprecated. Please use registerInstanceType instead");
    return this.registerInstanceType(constructorFunction, isSkipInitialization);
};
/**
 * Add instance
 * @param {String} className - name of inited class
 * @param {Object} node - dom node
 * @param {Object} [options] all options for send to the constructor
 * @returns {boolean}
 */
InstancesController.prototype.addInstance = function (className, node, options) {
    var instanceType = this._storage.settings[className],
        isAlreadyAdded = this.getInstance(instanceType.typeName,node);
    if (!instanceType || isAlreadyAdded) {//if not found this type  or already added - return
        return false;
    }
//    console.log("Adding instance for type -",setting.typeName,". Node - ",node);
    var instance = new instanceType.constructor(this.spiral,node, options);
    this._storage.instances[instanceType.typeName].push({//add new instance of this type
        "node": node,
        "instance": instance
    });

    //this.events.trigger("onAddInstance", instance);

    return true;
};
/**
 * Remove instance.
 * @param {String} className - name of inited class
 * @param {Object|String} node - dom node o dome node ID
 * @returns {boolean}
 */
InstancesController.prototype.removeInstance = function (className, node) {
    var setting = this._storage.settings[className],
        instanceObj = this.getInstance(setting.typeName, node,true),
        key;
    if (!instanceObj) {
        return false;
    }
    instanceObj.instance.die();//avoid memory leak
    key = this._storage.instances[setting.typeName].indexOf(instanceObj);
    if (key !== -1){//remove key
        this._storage.instances[setting.typeName].splice(key, 1);
    }
    return true;
};
/**
 * Get instance. Return instance object of this dom node
 * @param {String} typeName - type of instance
 * @param {Object|String} node - dom node o dome node ID
 * @param {boolean} [isReturnObject] - return object or instance
 * @returns {boolean}
 */
InstancesController.prototype.getInstance = function (typeName, node, isReturnObject) {
    var typeArr = this._storage.instances[typeName],
        ret = false;
    if (!typeArr) {
        return false;
    }
    node = (node instanceof HTMLElement) ? node : document.getElementById(node);
    if (!node) {
        return false;
    }
    for (var key = 0, l = typeArr.length; key < l; key++) {//iterate storage and try to find instance
        if (typeArr[key].node === node) {
            ret = (isReturnObject) ? typeArr[key] : typeArr[key].instance;
            break;
        }
    }
    return ret;
};

/**
 * Get all registered classes
 * @returns {Array}
 */
InstancesController.prototype.getClasses = function (){
    return Object.keys(this._storage.settings);
};

/**
 * Get constructor by name or class name
 * @returns
 */
InstancesController.prototype.getInstanceConstructors = function (name){

   //TODO
};
InstancesController.prototype.addAddon = function(instanceName, addonName, constructorFunction){
 //TODO
};

InstancesController.prototype.addPlugin = function(instanceName, pluginName, constructorFunction){
    //TODO
};



module.exports = InstancesController;


