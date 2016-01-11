"use strict";
//https://github.com/spiral/sf.js

//Add console shim for old IE
require("./shim/console");
require("./shim/Object.assign");

var sf = {//Describe all modules to use it in plugins too.
    modules: {
        core: {
            Ajax: require("./core/Ajax"),
            BaseDOMConstructor: require("./core/BaseDOMConstructor"),
            DomMutations:require("./core/DomMutations"),
            Events: require("./core/Events"),
            InstancesController: require("./core/InstancesController")
        },
        helpers: {
            DOMEvents:require("./helpers/DOMEvents"),
            domTools:require("./helpers/domTools"),
            LikeFormData: require("./helpers/LikeFormData"),
            tools: require("./helpers/tools")
        }
    }
};

sf.instancesController = new sf.modules.core.InstancesController(sf);
sf.domMutation = new sf.modules.core.DomMutations(sf.instancesController);

//create global ajax
sf.ajax = new sf.modules.core.Ajax(window.csrfToken ? {//TODO move to spiral bindings
    headers: {
        "X-CSRF-Token": window.csrfToken
    }
} : null);
debugger
window.spiral = sf; //TODO remove?


window.spiralFrontend = sf;

if (!window.hasOwnProperty("sf")){//bind only if  window.sf is empty to avoid conflicts with other libs
    window.sf = sf;
}

require("./helpers/tools/iterateInputs.js"); //plugin is used in formMessages module to iterate form inputs
require("./core/ajax/actions.js"); //plugin to perform actions from the server
require("./vendor/formToObject"); //formToObject  for form
require("./instances/form/Form.js"); //add form
require("./instances/form/formMessages"); //add form Messages handler

require("./instances/lock/Lock.js"); //add lock

if(typeof exports === "object" && exports) {
    module.exports = sf;
}