"use strict";

/**
 * This plugin adds ability to perform actions from the server.
 * "action":"reload"
 * "action":{"redirect":"/account"}
 * "action":{"redirect":"/account","delay":3000}
 * "action":{"name":"redirect","url":"/account","delay":3000}
 */
module.exports = function (sf) {
    sf.ajax.events.on('load', function (options) {
        var response = options.response;
        if (response.hasOwnProperty('action')) {
            if (typeof response.action === 'string') {//"action":"reload"
                sf.events.trigger(response.action);
            } else if (typeof response.action === 'object') {
                var keys = Object.keys(response.action);
                if (keys.length === 1) {//"action":{"redirect":"/account"}
                    sf.events.trigger(keys[0], response.action[keys[0]], options);
                } else if (keys.length === 2 && response.action.delay) {//"action":{"redirect":"/account","delay":3000}
                    setTimeout(function () {
                        var action = keys.filter(function (value) {
                            return value !== 'delay';
                        })[0];
                        sf.events.trigger(action, response.action[action], options);
                    }, +response.action.delay);
                } else if (keys.length > 1) {//"action":{"name":"redirect","url":"/account","delay":3000}
                    setTimeout(function () {
                        sf.events.trigger(response.action.name, response.action, options);
                    }, +response.action.delay || 0);
                } else {
                    console.error("Action from server. Object doesn't have keys. ", response.action);
                }
            } else {
                console.error("Action from server. Something wrong. ", response.action);
            }
        }
    });
};