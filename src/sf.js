var core = {
    Ajax: require("./core/Ajax"),
    BaseDOMConstructor: require("./core/BaseDOMConstructor"),
    DomMutations: require("./core/DomMutations"),
    Events: require("./core/Events"),
    InstancesController: require("./core/InstancesController")
};

var helpers = {
    DOMEvents: require("./helpers/DOMEvents"),
    domTools: require("./helpers/domTools"),
    LikeFormData: require("./helpers/LikeFormData"),
    tools: require("./helpers/tools")
};

var sf = {
    core: core,
    helpers: helpers,
    tools: helpers.tools,
    modules: {//todo remove this when removed in dependencies
        'WILL_BE_DEPRECATED': true,
        core: core,
        helpers: helpers
    }
};

module.exports = sf;