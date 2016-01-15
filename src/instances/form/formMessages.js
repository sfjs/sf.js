"use strict";
var iterateInputs = require("../../helpers/tools/iterateInputs");
var domTools = require("../../helpers/domTools");

var spiralOptions = {
    groupSelector: '.item-form',
    groupTemplate: '<span class="msg" data->${message}<button class="btn-close">×</button></span>',
    groupCloseSelector: '.btn-close',
    messagesPosition: 'bottom',

    formMessageTemplate: '<div class="alert form-msg ${type}"><button class="btn-close">×</button><div class="msg">${message}</div></div>',
    formMessageCloseSelector: '.btn-close',
    messagePosition: 'bottom'
};

function mixOptions (form) {
    var globalOptions = form.sf.options.instances.form;
    return Object.assign(
        spiralOptions,
        globalOptions && globalOptions.messages && globalOptions.messages[form.options.messagesType],
        form.options.messages
    );
}

/**
 * Closes form's main message.
 */
function closeMessage() {
    this.removeEventListener("click", closeMessage);
    var alert = this.parentNode;
    alert.parentNode.removeChild(alert);
}

/**
 * Selector for group-messages
 */
var _selector = '';
var _options = {};

/**
 * Shows individual message for the form.
 * @param {Form} form
 * @param {HTMLElement} form.node
 * @param {String} type
 * @param {String} message
 */
function showMessage(form, message, type) {
    var msg, parent,
        variables = {message: message, type: type},
        tpl = _options.formMessageTemplate,
        parser = new DOMParser();

    for (var item in variables) {
        if (variables.hasOwnProperty(item)) {
            tpl = tpl.replace('${' + item + '}', variables[item]);
        }
    }

    msg = parser.parseFromString(tpl, "text/html").firstChild.lastChild.firstChild;

    if (_options.messagePosition === "bottom") {
        form.node.appendChild(msg);
    } else if (_options.messagePosition === "top") {
        form.node.insertBefore(msg, form.node.firstChild);
    } else {
        parent = document.querySelector(_options.messagePosition);
        parent.appendChild(msg)
    }
    var closeBtn = msg.querySelector(_options.formMessageCloseSelector);
    if (closeBtn) closeBtn.addEventListener("click", closeMessage);
}

/**
 * Shows messages for inputs.
 * @param {Form} form
 * @param {HTMLElement} form.node
 * @param {Object} messages
 * @param {String} [type]
 */
function showMessages(form, messages, type) {
    var parser = new DOMParser(),
        notFound = iterateInputs(form.node, messages, function (el, message) {
            var group = domTools.closest(el, _options.groupSelector),
                variables = {message: message}, msgEl, tpl = _options.groupTemplate;
            if (!group) return;
            group.classList.add(type);

            for (var item in variables) {
                if (variables.hasOwnProperty(item)) {
                    tpl = tpl.replace('${' + item + '}', variables[item]);
                }
            }

            msgEl = parser.parseFromString(tpl, "text/html").firstChild.lastChild.firstChild;

            if (!_selector) {
                msgEl.className ? _selector = msgEl.className : _selector = 'sf-group-message';
            }
            msgEl.classList.add(_selector);

            if (_options.messagesPosition === "bottom") {
                group.appendChild(msgEl);
            } else if (_options.messagesPosition === "top") {
                group.insertBefore(msgEl, group.firstChild);
            } else {
                var parent = group.querySelector(_options.messagesPosition);
                parent.appendChild(msgEl)
            }
            var closeBtn = msgEl.querySelector(_options.groupCloseSelector);
            if (closeBtn) closeBtn.addEventListener("click", closeMessage);
        });

    //todo data-sf-message for notFound
}


module.exports = {
    /**
     * Adds form's main message, input's messages, bootstrap-like classes has-... to form-groups.
     * @constructor spiralMessages
     * @param {Form} form
     * @param {Object} answer
     * @param {Object|String} [answer.message]
     * @param {String} [answer.status]
     * @param {String} [answer.statusText]
     * @param {Object} [answer.data]
     * @param {String} [answer.message.type]
     * @param {String} [answer.message.text]
     * @param {String} [answer.error]
     * @param {String} [answer.warning]
     * @param {Object} [answer.messages]
     * @param {Object} [answer.errors]
     * @param {Object} [answer.warnings]
     */
    show: function (form, answer) {
        if (!answer) return;
        var isMsg = false;

        var globalOptions = form.sf.options.instances.form;
        _options = mixOptions(form);
        console.log(_options);

        //if (form.node.getElementsByClassName("alert").length > 0) {
        //    this.clear(form);//todo we really need to clear here? form clears onSubmit
        //}

        if (answer.message) {
            showMessage(form, answer.message.text || answer.message, answer.message.type || "success");
            isMsg = true;
        }
        if (answer.error) {
            showMessage(form, answer.error, "error");
            isMsg = true;
        }
        if (answer.warning) {
            showMessage(form, answer.warning, "warning");
            isMsg = true;
        }
        if (answer.messages) {
            showMessages(form, answer.messages, "success");
            isMsg = true;
        }
        if (answer.errors) {
            showMessages(form, answer.errors, "error");
            isMsg = true;
        }
        if (answer.warnings) {
            showMessages(form, answer.warnings, "warning");
            isMsg = true;
        }
        if (!isMsg) {
            var error = answer.status ? answer.status + " " : "";
            error += answer.statusText ? answer.statusText : "";
            error += answer.data && !answer.statusText ? answer.data : "";
            error += error.length === 0 ? answer : "";
            showMessage(form, error, "error");
        }
    },
    /**
     * Removes form's main message, input's messages, bootstrap classes has-... from form-groups.
     * @param {Form} form
     * @param {HTMLElement} form.node
     */
    clear: function (form) {
        var msg, i, l, item;
        _options = mixOptions(form);
        if (_options.messagePosition === "bottom" || _options.messagePosition === "top") {
            msg = form.node.getElementsByClassName("form-msg")[0];
        } else {
            msg = document.querySelector(_options.messagePosition + ">.form-msg");
        }
        if (msg) {
            msg.getElementsByClassName("btn-close")[0].removeEventListener("click", closeMessage);
            msg.parentNode.removeChild(msg);
        }
        if (_selector) { //if form wasn't sent at least 1 time => still doesn't have messages' selectors
            var alerts = form.node.querySelectorAll(_options.groupSelector + ' .' + _selector);//Remove all messages
            for (i = 0, l = alerts.length; i < l; i++) {
                item = alerts[i].parentNode;
                item.removeChild(alerts[i]);
                item.classList.remove("error", "success", "warning", "info");
            }
        }
    }
};

