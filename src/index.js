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

//Form
_sf.tools.iterateInputs = require("./helpers/tools/iterateInputs.js");
_sf.modules.helpers.tools.iterateInputs = _sf.tools.iterateInputs;//todo remove
require("./vendor/formToObject");
require("./instances/form/Form.js");
require("./instances/lock/Lock.js");

if (typeof exports === "object" && exports) {
    module.exports = _sf;
}