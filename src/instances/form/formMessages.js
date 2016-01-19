"use strict";
var iterateInputs = require("../../helpers/tools/iterateInputs");
var domTools = require("../../helpers/domTools");

var options = {
    template: '<div class="alert form-msg ${type}"><button class="btn-close">×</button><div class="msg">${text}</div></div>',
    close: '.btn-close',
    place: 'bottom',
    levels: {
        success: "success", info: "info", warning: "warning", danger: "danger"
    },
    field: '.item-form',
    fieldTemplate: '<span class="msg">${text}<button class="btn-close">×</button></span>',
    fieldClose: '.btn-close',
    fieldPlace: 'bottom',
    fieldPrefix: ''//for bootstrap: class="has-danger"
};

//often used alias
options.levels.message = options.levels.success;

//other aliases
//PSR-3 severity levels mapping (debug, info, notice, warning, error, critical, alert, emergency)
//https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-3-logger-interface.md
options.levels.debug = options.levels.success;
options.levels.info = options.levels.notice = options.levels.info;
options.levels.error = options.levels.critical = options.levels.alert = options.levels.emergency = options.levels.danger;

function mixOptions(form) {
    var globalOptions = form.sf.options.instances.form;
    return Object.assign(
        options,
        globalOptions && globalOptions.messages && globalOptions.messages[form.options.messagesType],
        form.options.messages
    );
}

var _options = {};

function prepareMessageObject(message, type) {
    if (Object.prototype.toString.call(message) !== "[object Object]") {
        message = {text: message, type: type};
    }
    message.text = message.text || message.message || message;
    message.type = message.type || type;
    return message;
}

module.exports = {
    showMessages: function (answer) {
        if (!answer) return;
        var isMsg = false, that = this;
        _options = mixOptions(this);

        for (var type in options.levels) {
            if (answer[type]) {
                this.showFormMessage(answer[type], _options.levels[type]);
                isMsg = true;
            }
        }

        if (answer.messages) {
            this.showFieldsMessages(answer.messages, "success");
            isMsg = true;
        }
        if (answer.errors) {
            this.showFieldsMessages(answer.errors, "danger");
            isMsg = true;
        }
        if (answer.warnings) {
            this.showFieldsMessages(answer.warnings, "warning");
            isMsg = true;
        }

        if (!isMsg) {
            var error = answer.status ? answer.status + " " : "";
            error += answer.statusText ? answer.statusText : "";
            error += answer.data && !answer.statusText ? answer.data : "";
            error += error.length === 0 ? answer : "";
            this.showFormMessage(error, "error");
        }

        this._messages.forEach(function (m) {
            if (m.close) {
                m.closeHandler = that.removeMessage.bind(that, m);
                m.close.addEventListener("click", m.closeHandler);
            }
        });
    },
    removeMessage: function (m, e) {
        m.close && m.close.removeEventListener("click", m.closeHandler);
        m.el.parentNode.removeChild(m.el);
        m.field && m.field.classList.remove(_options.fieldPrefix + m.type);
        if (e) {
            e.preventDefault && e.preventDefault();
            this._messages.splice(this._messages.indexOf(m), 1);
        }
    },
    removeMessages: function () {
        var that = this;
        if (this._messages) {
            this._messages.forEach(function (m) {
                that.removeMessage(m, false);
            });
        }
        that._messages = [];
    },
    showFormMessage: function (message, type) {
        message = prepareMessageObject(message, type);

        var msgEl, parent, tpl = _options.template, parser = new DOMParser();

        for (var item in message) {
            if (!message.hasOwnProperty(item)) return;
            tpl = tpl.replace('${' + item + '}', message[item]);
        }

        msgEl = parser.parseFromString(tpl, "text/html").firstChild.lastChild.firstChild;

        if (_options.place === "bottom") {
            this.node.appendChild(msgEl);
        } else if (_options.place === "top") {
            this.node.insertBefore(msgEl, this.node.firstChild);
        } else {
            parent = document.querySelector(_options.place);
            parent.appendChild(msgEl)
        }
        this._messages.push({el: msgEl, close: msgEl.querySelector(_options.close)});
    },
    showFieldMessage: function (el, message, type) {
        var field = domTools.closest(el, _options.field), msgEl, tpl = _options.fieldTemplate;
        if (!field) return;
        var parser = new DOMParser();
        message = prepareMessageObject(message, type);

        field.classList.add(_options.fieldPrefix + type);

        for (var item in message) {
            if (!message.hasOwnProperty(item)) return;
            tpl = tpl.replace('${' + item + '}', message[item]);
        }

        msgEl = parser.parseFromString(tpl, "text/html").firstChild.lastChild.firstChild;

        if (_options.fieldPlace === "bottom") {
            field.appendChild(msgEl);
        } else if (_options.fieldPlace === "top") {
            field.insertBefore(msgEl, field.firstChild);
        } else {
            field = field.querySelector(_options.fieldPlace);
            field.appendChild(msgEl)
        }

        this._messages.push({
            el: msgEl,
            close: msgEl.querySelector(_options.fieldClose),
            field: field,
            type: type
        });
    },
    showFieldsMessages: function (messages, type) {
        var that = this,
            notFound = iterateInputs(this.node, messages, function (el, message) {
                that.showFieldMessage(el, message, type)
            });
        //todo data-name for notFound
    }
};