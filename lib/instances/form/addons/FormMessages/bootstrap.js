"use strict";


(function (sf) {
    /**
     * Closes form's main message.
     */
    function closeMessage() {
        this.removeEventListener("click", closeMessage);
        var message = this.parentNode.parentNode;
        message.parentNode.removeChild(message);
    }

    /**
     * Shows individual message for the form.
     * @param {Object} formOptions
     * @param {String} formOptions.messagePosition
     * @param {Node} formOptions.context
     * @param {String} type
     * @param {String} message
     */
    function showMessage(formOptions, message, type) {
        var placeholder, alert, close, parent;

        placeholder = document.createElement("div");
        placeholder.className = "form-group form-message";

        alert = document.createElement("div");
        alert.className = "alert alert-" + type;
        alert.innerHTML = message;

        close = document.createElement("button");
        close.className = "close";
        close.setAttribute("type", "button");
        close.textContent = "×";

        alert.appendChild(close);
        placeholder.appendChild(alert);

        if (formOptions.messagePosition === "bottom") {
            parent = formOptions.context;
            parent.appendChild(placeholder);
        } else if (formOptions.messagePosition === "top") {
            parent = formOptions.context;
            parent.insertBefore(placeholder, parent.firstChild);
        } else {
            parent = document.querySelector(formOptions.messagePosition);
            parent.appendChild(placeholder)
        }

        close.addEventListener("click", closeMessage);
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
        var selector, msgType, msgText, nodes, i, l;
        type = type || "success";
        for (var name in messages) {
            if (!messages.hasOwnProperty(name)) continue;

            if (typeof messages[name] === "string") {
                msgType = type;
                msgText = messages[name];
            } else {
                msgType = messages[name].type;
                msgText = messages[name].text;
            }

            selector = "[name='" + name + "']";
            nodes = formOptions.context.querySelectorAll(selector);
            l = nodes.length;

            if (l === 0) {
                nodes = formOptions.context.querySelectorAll("[data-message='" + name + "']");
            }

            for (i = 0, l = nodes.length; i < l; i++) {
                var group = sf.module.helpers.domTools.closest(nodes[i], ".form-group");
                if (group) {
                    group.classList.add("has-" + (msgType === "danger" ? "error" : msgType));
                }

                var msg = document.createElement("div");
                msg.className = "alert alert-" + msgType;
                msg.innerHTML = msgText;

                if (formOptions.messagesPosition === "bottom") {
                    group.appendChild(msg);
                } else if (formOptions.messagesPosition === "top") {
                    group.insertBefore(msg, group.firstChild);
                } else {
                    var parent = group.querySelector(formOptions.messagesPosition);
                    parent.appendChild(msg)
                }
            }
        }
    }

    var messageBootstrap = {
        /**
         * Adds form's main message, input's messages, bootstrap classes has-... to form-groups.
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
            //if (formOptions.context.getElementsByClassName("alert").length > 0) {
            //    this.clear(formOptions);//todo we really need to clear here? form clears onSubmit
            //}

            if (answer.message) {
                showMessage(formOptions, answer.message.text || answer.message, answer.message.type || "success");
            }
            if (answer.error) {
                showMessage(formOptions, answer.error, "danger");
            }
            if (answer.warning) {
                showMessage(formOptions, answer.warning, "warning");
            }
            if (answer.messages) {
                showMessages(formOptions, answer.messages, "success");
            }
            if (answer.errors) {
                showMessages(formOptions, answer.errors, "danger");
            }
            if (answer.warnings) {
                showMessages(formOptions, answer.warnings, "warning");
            }
        },
        /**
         * Removes form's main message, input's messages, bootstrap classes has-... from form-groups.
         * @param {Object} formOptions
         * @param {String} formOptions.messagePosition
         * @param {Node} formOptions.context
         */
        clear: function (formOptions) {
            var message;
            if (formOptions.messagePosition === "bottom" || formOptions.messagePosition === "top") {
                message = formOptions.context.getElementsByClassName("form-message")[0];
            } else {
                message = document.querySelector(formOptions.messagePosition + ">.form-group .form-message");
            }
            if (message) {
                message.getElementsByClassName("close")[0].removeEventListener("click", closeMessage);
                message.parentNode.removeChild(message);
            }

            var alerts = formOptions.context.querySelectorAll(".form-group .alert");//Remove all messages
            for (var i = 0, l = alerts.length; i < l; i++) {
                alerts[i].parentNode.removeChild(alerts[i]);
            }

            var groups = formOptions.context.getElementsByClassName("form-group");//Cleaning classes
            for (i = 0, l = groups.length; i < l; i++) {
                groups[i].classList.remove("has-error", "has-warning", "has-success");
            }
        }
    };
    /**
     * Register addon
     */
    sf.instancesController.registerAddon(messageBootstrap, "form", "formMessages", "bootstrap");

})(spiralFrontend);