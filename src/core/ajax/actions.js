"use strict";

/**
 * This plugin adds ability to perform actions from the server.
 * "action":"reload"
 * "action":{"redirect":"/account"}
 * "action":{"redirect":"/account","delay":3000}
 * "action":{"name":"redirect","url":"/account","delay":3000}
 */
(function (sfAjax) {

    sfAjax.events.on('load', function (options) {
        var response = options.response;
        if (response.hasOwnProperty('action')) {
            if (typeof response.action === 'string') {//"action":"reload"
                sfAjax.actions.trigger(response.action);
            } else if (typeof response.action === 'object') {
                var keys = Object.keys(response.action);
                if (keys.length === 1) {//"action":{"redirect":"/account"}
                    sfAjax.actions.trigger(keys[0], response.action[keys[0]], options);
                } else if (keys.length === 2 && response.action.delay) {//"action":{"redirect":"/account","delay":3000}
                    setTimeout(function () {
                        var action = keys.filter(function (value) {
                            return value !== 'delay';
                        })[0];
                        sfAjax.actions.trigger(action, response.action[action], options);
                    }, +response.action.delay);
                } else if (keys.length > 1) {//"action":{"name":"redirect","url":"/account","delay":3000}
                    setTimeout(function () {
                        sfAjax.actions.trigger(response.action.name, response.action, options);
                    }, +response.action.delay || 0);
                } else {
                    console.error("Action from server. Object doesn't have keys. ", response.action);
                }
            } else {
                console.error("Action from server. Something wrong. ", response.action);
            }
        }
    });

    sfAjax.actions = new sf.modules.core.Events();

    sfAjax.actions.on("redirect", function (action) {
        var url = Object.prototype.toString.call(action) === "[object String]" ? action : action.url;
        //http://stackoverflow.com/questions/10687099/how-to-test-if-a-url-string-is-absolute-or-relative
        window.location[/^(?:[a-z]+:)?\/\//i.test(url) ? 'href' : 'pathname'] = url;
    });

    sfAjax.actions.on('reload', function () {
        location.reload();
    });

    sfAjax.actions.on('refresh', function () {
        sfAjax.actions.trigger('reload');
    });

    sfAjax.actions.on('close', function () {
        window.close();
    });

})(sf.ajax);