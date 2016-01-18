"use strict";
var iterateInputs = require("../../helpers/tools/iterateInputs");
var domTools = require("../../helpers/domTools");

var essagesOptionsSpiral = {
    groupSelector: '.item-form',
    //field: '.item-form',
    groupTemplate: '<span class="msg" data->${text}<button class="btn-close">×</button></span>',
    //fieldTemplate: '<span class="msg" data->${text}<button class="btn-close">×</button></span>',
    groupCloseSelector: '.btn-close',
    messagesPosition: 'bottom',

    formMessageTemplate: '<div class="alert form-msg ${type}"><button class="btn-close">×</button><div class="msg">${text}</div></div>',
    formMessageCloseSelector: '.btn-close',
    messagePosition: 'bottom'
};

function mixOptions(form) {
    var globalOptions = form.sf.options.instances.form;
    return Object.assign(
        essagesOptionsSpiral,
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

var levels = {
    success: "success", info: "info", warning: "warning", danger: "danger"
};

//often used alias
levels.message = levels.success;

//PSR-3 severity levels mapping (debug, info, notice, warning, error, critical, alert, emergency)
//https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-3-logger-interface.md
levels.debug = levels.success;
levels.info = levels.notice = levels.info;
levels.error = levels.critical = levels.alert = levels.emergency = levels.danger;

function prepareMessageObject(message, type) {
    if (Object.prototype.toString.call(message) !== "[object Object]") {
        message = {text: message, type: type};
    }
    message.text = message.text || message.message || message;
    message.type = message.type || type;
    return message;
}

/**
 * Shows individual message for the form.
 * @param {Form} form
 * @param {HTMLElement} form.node
 * @param {Object|String} message
 * @param {String} [type]
 */
function showMessage(form, message, type) {
    message = prepareMessageObject(message, type);

    var msgEl, parent,
        tpl = _options.formMessageTemplate,
        parser = new DOMParser();

    for (var item in message) {
        if (!message.hasOwnProperty(item)) return;
        tpl = tpl.replace('${' + item + '}', message[item]);
    }

    msgEl = parser.parseFromString(tpl, "text/html").firstChild.lastChild.firstChild;

    if (_options.messagePosition === "bottom") {
        form.node.appendChild(msgEl);
    } else if (_options.messagePosition === "top") {
        form.node.insertBefore(msgEl, form.node.firstChild);
    } else {
        parent = document.querySelector(_options.messagePosition);
        parent.appendChild(msgEl)
    }
    var closeBtn = msgEl.querySelector(_options.formMessageCloseSelector);
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
            var group = domTools.closest(el, _options.groupSelector), msgEl, tpl = _options.groupTemplate;
            if (!group) return;
            message = prepareMessageObject(message, type);

            group.classList.add(type);

            for (var item in message) {
                if (!message.hasOwnProperty(item)) return;
                tpl = tpl.replace('${' + item + '}', message[item]);
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

    //todo data-name for notFound
}


module.exports = {
    /**
     * @param {Form} form
     * @param {Object} answer
     */
    show: function (form, answer) {
        if (!answer) return;
        var isMsg = false;
        _options = mixOptions(form);

        for (var type in levels) {
            if (answer[type]) {
                showMessage(form, answer[type], levels[type]);
                isMsg = true;
            }
        }

        if (answer.messages) {
            showMessages(form, answer.messages, "success");
            isMsg = true;
        }
        if (answer.errors) {
            showMessages(form, answer.errors, "danger");
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
                item.classList.remove("error", "danger", "success", "warning", "info");
            }
        }
    }
};

