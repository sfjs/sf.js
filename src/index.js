"use strict";
//https://github.com/spiral/sf.js

//Add console shim for old IE
require("./shim/console");
require("./shim/Object.assign");

var _sf;

if (typeof sf !== 'undefined' && Object.prototype.toString.call(sf) === "[object Object]") {
    _sf = Object.assign(sf, require("./sf"));
} else {
    _sf = require("./sf");
}

if (!_sf.hasOwnProperty('options')) _sf.options = {instances:{}};
if (!_sf.options.hasOwnProperty('instances')) _sf.options.instances = {};

//todo delete this in future
if (!window.hasOwnProperty("sf")) {//bind only if  window.sf is empty to avoid conflicts with other libs
    window.sf = _sf;
}

_sf.instancesController = new _sf.core.InstancesController(sf);
_sf.domMutation = new _sf.core.DomMutations(_sf.instancesController);

//Events system
_sf.events = new _sf.core.Events();
require("./core/events/baseEvents.js")(_sf.events);

//AJAX
_sf.ajax = new _sf.core.Ajax(window.csrfToken ? {//TODO move to spiral bindings
    headers: {
        "X-CSRF-Token": window.csrfToken
    }
} : null);
require("./core/ajax/baseActions.js")(_sf);

require("./instances/lock/Lock.js");

//API
_sf.modulePrototype = Object.create(sf.modules.core.BaseDOMConstructor.prototype);
_sf.registerInstanceType = _sf.instancesController.registerInstanceType.bind(_sf.instancesController);
_sf.addInstance = _sf.instancesController.addInstance.bind(_sf.instancesController);
_sf.removeInstance = _sf.instancesController.removeInstance.bind(_sf.instancesController);
_sf.getInstance = _sf.instancesController.getInstance.bind(_sf.instancesController);
_sf.getInstances = _sf.instancesController.getInstances.bind(_sf.instancesController);

_sf.closest = sf.helpers.domTools.closest;

if (typeof exports === "object" && exports) {
    module.exports = _sf;
}