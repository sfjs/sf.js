"use strict";


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

/**
 * Shows individual message for the form.
 * @param {Object} formOptions
 * @param {String} formOptions.messagePosition
 * @param {Node} formOptions.context
 * @param {String} type
 * @param {String} message
 */
function showMessage(formOptions, message, type) {
    var msg, parent,
        variables = {message: message, type: type},
        tpl = formOptions.messagesOptions.formMessageTemplate,
        parser = new DOMParser();

    for (var item in variables) {
        if (variables.hasOwnProperty(item)) {
            tpl = tpl.replace('${' + item + '}', variables[item]);
        }
    }

    msg = parser.parseFromString(tpl, "text/html").firstChild.lastChild.firstChild;

    if (formOptions.messagePosition === "bottom") {
        parent = formOptions.context;
        parent.appendChild(msg);
    } else if (formOptions.messagePosition === "top") {
        parent = formOptions.context;
        parent.insertBefore(msg, parent.firstChild);
    } else {
        parent = document.querySelector(formOptions.messagePosition);
        parent.appendChild(msg)
    }
    var closeBtn = msg.querySelector(formOptions.messagesOptions.formMessageCloseSelector);
    if (closeBtn) closeBtn.addEventListener("click", closeMessage);
}

/**
 * Shows messages for inputs.
 * @param {Object} formOptions
 * @param {String} formOptions.messagesPosition
 * @param {Node} formOptions.context
 * @param {Object} messages
 * @param {String} [type]
 */
function showMessages(formOptions, messages, type) {
    var parser = new DOMParser(),
        notFound = sf.modules.helpers.tools.iterateInputs(formOptions.context, messages, function (el, message) {
            var group = sf.modules.helpers.domTools.closest(el, formOptions.messagesOptions.groupSelector),
                variables = {message: message}, msgEl, tpl = formOptions.messagesOptions.groupTemplate;
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

            if (formOptions.messagesPosition === "bottom") {
                group.appendChild(msgEl);
            } else if (formOptions.messagesPosition === "top") {
                group.insertBefore(msgEl, group.firstChild);
            } else {
                var parent = group.querySelector(formOptions.messagesPosition);
                parent.appendChild(msgEl)
            }
            var closeBtn = msgEl.querySelector(formOptions.messagesOptions.groupCloseSelector);
            if (closeBtn) closeBtn.addEventListener("click", closeMessage);
        });

    //todo data-sf-message for notFound
}


module.exports = {
    /**
     * Adds form's main message, input's messages, bootstrap-like classes has-... to form-groups.
     * @constructor spiralMessages
     * @param {Object} formOptions
     * @param {Object} answer
     * @param {Object|String} [answer.message]
     * @param {String} [answer.message.type]
     * @param {String} [answer.message.text]
     * @param {String} [answer.error]
     * @param {String} [answer.warning]
     * @param {Object} [answer.messages]
     * @param {Object} [answer.errors]
     * @param {Object} [answer.warnings]
     */
    show: function (formOptions, answer) {
        if (!answer) return;
        var isMsg = false;
        //if (formOptions.context.getElementsByClassName("alert").length > 0) {
        //    this.clear(formOptions);//todo we really need to clear here? form clears onSubmit
        //}

        if (answer.message) {
            showMessage(formOptions, answer.message.text || answer.message, answer.message.type || "success");
            isMsg = true;
        }
        if (answer.error) {
            showMessage(formOptions, answer.error, "error");
            isMsg = true;
        }
        if (answer.warning) {
            showMessage(formOptions, answer.warning, "warning");
            isMsg = true;
        }
        if (answer.messages) {
            showMessages(formOptions, answer.messages, "success");
            isMsg = true;
        }
        if (answer.errors) {
            showMessages(formOptions, answer.errors, "error");
            isMsg = true;
        }
        if (answer.warnings) {
            showMessages(formOptions, answer.warnings, "warning");
            isMsg = true;
        }
        if (!isMsg) {
            var error = answer.status ? answer.status + " " : "";
            error += answer.statusText ? answer.statusText : "";
            error += answer.data && !answer.statusText ? answer.data : "";
            error += error.length === 0 ? answer : "";
            showMessage(formOptions, error, "error");
        }
    },
    /**
     * Removes form's main message, input's messages, bootstrap classes has-... from form-groups.
     * @param {Object} formOptions
     * @param {String} formOptions.messagePosition
     * @param {Node} formOptions.context
     */
    clear: function (formOptions) {
        var msg, i, l, item;
        if (formOptions.messagePosition === "bottom" || formOptions.messagePosition === "top") {
            msg = formOptions.context.getElementsByClassName("form-msg")[0];
        } else {
            msg = document.querySelector(formOptions.messagePosition + ">.form-msg");
        }
        if (msg) {
            msg.getElementsByClassName("btn-close")[0].removeEventListener("click", closeMessage);
            msg.parentNode.removeChild(msg);
        }
        if (_selector) { //if form wasn't sent at least 1 time => still doesn't have messages' selectors
            var alerts = formOptions.context.querySelectorAll(formOptions.messagesOptions.groupSelector + ' .' + _selector);//Remove all messages
            for (i = 0, l = alerts.length; i < l; i++) {
                item = alerts[i].parentNode;
                item.removeChild(alerts[i]);
                item.classList.remove("error", "success", "warning", "info");
            }
        }
    }
};

