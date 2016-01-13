"use strict";
//https://github.com/spiral/sf.js

//Add console shim for old IE
require("./shim/console");
require("./shim/Object.assign");

var sf = require("./sf");

//todo delete this in future
if (!window.hasOwnProperty("sf")) {//bind only if  window.sf is empty to avoid conflicts with other libs
    window.sf = sf;
}

sf.instancesController = new sf.core.InstancesController(sf);
sf.domMutation = new sf.core.DomMutations(sf.instancesController);

//Events system
sf.events = new sf.core.Events();
require("./core/events/baseEvents.js")(sf.events);

//AJAX
sf.ajax = new sf.core.Ajax(window.csrfToken ? {//TODO move to spiral bindings
    headers: {
        "X-CSRF-Token": window.csrfToken
    }
} : null);
require("./core/ajax/baseActions.js")(sf);

//Form
sf.tools.iterateInputs = require("./helpers/tools/iterateInputs.js");
sf.modules.helpers.tools.iterateInputs = sf.tools.iterateInputs;//todo remove
require("./vendor/formToObject");
require("./instances/form/Form.js");
require("./instances/lock/Lock.js");

if (typeof exports === "object" && exports) {
    module.exports = sf;
}