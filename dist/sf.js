!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("sf-core",[],e):"object"==typeof exports?exports["sf-core"]=e():t["sf-core"]=e()}(this,function(){return function(t){function e(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var n={};return e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="/",e(e.s=19)}([function(t,e,n){"use strict";var r=function(t){this._storage={},this._allowedEvents=t};r.prototype.on=function(t,e){t.replace(/\s{2,}/g," ").split(" ").forEach(function(n){if(this._allowedEvents&&this._allowedEvents.indexOf(n)===-1)return void console.warn("Events. Try to register event %s, but event is not allowed",n);this._storage.hasOwnProperty(t)||(this._storage[n]=[]),this._storage[n].push(e)},this)},r.prototype.registerAction=r.prototype.on,r.prototype.off=function(t,e){alert("You try to remove action. This part is incomplete")},r.prototype.trigger=function(t,e){if(this._allowedEvents&&this._allowedEvents.indexOf(t)===-1)return void console.warn("Events. Try to trigger event %s, but event is not allowed",t);if(this._storage.hasOwnProperty(t))for(var n=0,r=this._storage[t].length;n<r;n++)this._storage[t][n](e)},r.prototype.performAction=r.prototype.trigger,t.exports=r},function(t,e,n){"use strict";var r=function(t,e){this.data={},t&&("[object Object]"!==Object.prototype.toString.call(t)?console.warn("LikeFormData can't accept non Object. Please reefer to documentation. Problem parameter is:",t):this.data=t),this.boundary=e?e:"SpiralFormData-"+Math.random().toString().substr(2)};r.prototype.append=function(t,e){this.data[t]=e},r.prototype.toString=function(){var t="",e=this.boundary,n=function(r,o){for(var s in r)r.hasOwnProperty(s)&&void 0!==r[s]&&("object"==typeof r[s]?n(r[s],0===o.length?s:o+"["+s+"]"):t+="--"+e+"\r\nContent-Disposition: form-data; name="+(0===o.length?s:o+"["+s+"]")+"\r\n\r\n"+r[s]+"\r\n")};return"object"!=typeof this.data&&(this.data={data:this.data}),n(this.data,""),t+="--"+this.boundary+"--\r\n"},r.prototype.delete=function(t){return delete this.data[t]},r.prototype.get=function(t){return this.data[t]},r.prototype.getAll=function(){return this.data},r.prototype.has=function(t){return this.data.hasOwnProperty(t)},r.prototype.set=function(t,e){this.data[t]=e},r.prototype.getContentTypeHeader=function(){return"multipart/form-data; charset=utf-8; boundary="+this.boundary},t.exports=r},function(t,e,n){"use strict";var r=n(12),o={core:r.core,helpers:r.helpers,tools:r.tools};if(n(14),n(13),"function"!=typeof s)var s=n(15).Promise;o.hasOwnProperty("options")||(o.options={instances:{}}),o.options.hasOwnProperty("instances")||(o.options.instances={}),window&&!window.hasOwnProperty("sf")&&(window.sf=o),o.instancesController=new o.core.InstancesController(o),o.domMutation=new o.core.DomMutations(o.instancesController),o.events=new o.core.Events,n(8)(o.events),o.ajax=new o.core.Ajax(window&&window.csrfToken?{headers:{"X-CSRF-Token":window.csrfToken}}:null),n(7)(o),o.createModulePrototype=function(){return Object.create(o.core.BaseDOMConstructor.prototype)},o.registerInstanceType=o.instancesController.registerInstanceType.bind(o.instancesController),o.addInstance=o.instancesController.addInstance.bind(o.instancesController),o.removeInstance=o.instancesController.removeInstance.bind(o.instancesController),o.getInstance=o.instancesController.getInstance.bind(o.instancesController),o.getInstances=o.instancesController.getInstances.bind(o.instancesController),o.closest=r.helpers.domTools.closest,o.resolveKeyPath=r.tools.resolveKeyPath,t.exports=o},function(t,e,n){"use strict";var r=n(0),o=n(1),s=function(t){this.currentRequests=0,this.events=new r(["beforeSend","load"]),t&&t.headers&&(this.headers=Object.assign(this.headers,t.headers))};s.prototype.headers={"X-Requested-With":"XMLHttpRequest"},s.prototype.send=function(t){var e=this;null!==t.data&&void 0!==t.data&&"undefined"!==t.data||(t.data=null),t.method||(t.method="POST"),t.headers=t.headers?Object.assign(t.headers,this.headers,t.headers):Object.assign({},this.headers);var n,r=new Promise(function(r,s){t.url||(console.error("You should provide url"),s("You should provide url")),e.currentRequests++;var i=!1;"undefined"!=typeof window&&window.XDomainRequest&&window.XMLHttpRequest&&void 0===(new XMLHttpRequest).responseType&&0===url.indexOf("http")?(n=new XDomainRequest,i=!0,n.onprogress=function(e){t.onProgress&&t.onProgress(e)}):(n=new XMLHttpRequest,t.onProgress&&n.upload.addEventListener("progress",function(e){e.lengthComputable&&t.onProgress(e.loaded,e.total)},!1)),n.open(t.method,t.url),n.onload=function(){e.currentRequests--;var o=e._parseJSON(n);o.status?o.status>199&&o.status<300?r(o):o.status>399&&o.status<600?s(o):(console.error("unknown status %d. Rejecting",o.status),s(o)):i?r(o):s(o),t.response=o,e.events.trigger("load",t)},n.onerror=function(){e.currentRequests--,s(Error("Network Error"),n)},e.events.trigger("beforeSend",t);var a;null!==t.data?i?a="IEJSON"+JSON.stringify(t.data):(t.data.toString().indexOf("FormData")!==-1?a=t.data:(a=new o(t.data),t.headers["content-type"]=a.getContentTypeHeader()),e._setHeaders(n,t.headers)):a=null;try{n.send(a)}catch(t){n.send(a.toString())}return n});return t.isReturnXHRToo?[r,n]:r},s.prototype._setHeaders=function(t,e){for(var n in e)e.hasOwnProperty(n)&&t.setRequestHeader(n,e[n])},s.prototype._parseJSON=function(t){t.response||(t.response=t.responseText);var e={},n=!1;if(t.getResponseHeader&&(n=t.getResponseHeader("Content-Type")),n&&"application/json"!==n.toLowerCase()&&"text/json"!==n.toLowerCase()&&"inode/symlink"!==n.toLowerCase())e={data:t.response};else try{e=JSON.parse(t.response)}catch(n){console.error("Not a JSON!",t.response),e={data:t.response}}return e.status||(e.status=t.status),"string"==typeof e.status&&0===e.status.indexOf("HTTP/")&&e.status.match(/ (\d\d\d)/)&&(e.status=parseInt(e.status.match(/ (\d\d\d)/)[1])),e.statusText||(e.statusText=t.statusText),t.status&&t.status!=e.status&&console.warn("Status from request %d, but response contains status %d",t.status,e.status),e},t.exports=s},function(t,e,n){"use strict";var r=function(){};r.prototype.init=function(t,e,n){this.sf=t,this.node=e,this.options=Object.assign(this.grabOptions(e),n)},r.prototype.optionsToGrab={},r.prototype.grabOptions=function(t){var e,n,r={};for(var o in this.optionsToGrab)this.optionsToGrab.hasOwnProperty(o)&&(e=null,this.optionsToGrab.hasOwnProperty(o)&&(n=this.optionsToGrab[o],n.hasOwnProperty("value")&&(e=n.value),this.sf.options.instances[this.name]&&this.sf.options.instances[this.name].hasOwnProperty(o)&&(e=this.sf.options.instances[this.name][o]),n.hasOwnProperty("domAttr")&&t.attributes.hasOwnProperty(n.domAttr)&&(e=t.attributes[n.domAttr].value),n.hasOwnProperty("processor")&&(e=n.processor.call(this,t,e,n)),null!==e&&(r[o]=e)));return r},t.exports=r},function(t,e,n){"use strict";var r=function(t){if(!t)return void console.error("You should provide instancesController  for DOM Mutation. Because DOM Mutation  should known all classes and");if(!this.constructor)return void console.error("Please call DomMutations with new  - 'new DomMutations()' ");this.instancesController=t;var e={attributes:!0,childList:!0,characterData:!0,characterDataOldValue:!0,subtree:!0,attributeOldValue:!0,attributeFilter:["class"]},n=this;this.observer=new MutationObserver(function(){n.onDomMutate.apply(n,arguments)}),this.observer.observe(document,e)};r.prototype.onDomMutate=function(t){var e=this.instancesController.getClasses(),n="."+e.join(",.");return 1!==n.length&&(t.forEach(function(t){switch(t.type){case"attributes":this.processMutationAttributes(t,e);break;case"characterData":break;case"childList":this.processMutationChildList(t.addedNodes,"addInstance",n,e),this.processMutationChildList(t.removedNodes,"removeInstance",n,e);break;case"default":console.error("Something wrong. Contact tech support")}},this),!0)},r.prototype.processMutationAttributes=function(t,e){var n=this,r=t.target.className.split(" "),o=t.oldValue?t.oldValue.split(" "):[],s=r.filter(function(t){return o.indexOf(t)===-1}),i=o.filter(function(t){return r.indexOf(t)===-1}),a=s.filter(function(t){return e.indexOf(t)!==-1});i.filter(function(t){return e.indexOf(t)!==-1}).forEach(function(e){n.instancesController.removeInstance(n.instancesController.getInstanceNameByCssClass(e),t.target)}),a.forEach(function(e){n.instancesController.addInstance(n.instancesController.getInstanceNameByCssClass(e),t.target)})},r.prototype.processMutationChildList=function(t,e,n,r){function o(t){r.forEach(function(n){t.classList.contains(n)&&s.instancesController[e](s.instancesController.getInstanceNameByCssClass(n),t)})}var s=this;[].forEach.call(t,function(t){return 1===t.nodeType&&"SCRIPT"!==t.nodeName&&"LINK"!==t.nodeName&&(o(t),[].forEach.call(t.querySelectorAll(n),o),!0)})},r.prototype.stopObserve=function(){this.observer.disconnect()},t.exports=r},function(t,e,n){"use strict";var r=function(t){if(this.spiral=t,!this.constructor)return void console.error("Please call InstancesController with new  - 'new InstancesController()' ");this._storage={instancesConstructors:{cssClasses:{},jsConstructors:{}},addons:{},instances:{}}};r.prototype.registerInstanceType=function(t,e,n){var r=t.prototype.name;if(r||console.error("Instance constructor should have name inside it"),this._storage.instancesConstructors.jsConstructors.hasOwnProperty(r))return void console.error("Instance Constructor for type '%s' already added. Skipping",r);if(e&&(this._storage.instancesConstructors.cssClasses[e]=r),this._storage.instancesConstructors.jsConstructors[r]=t,this._storage.instances[r]=[],!n)for(var o=document.getElementsByClassName(e),s=0,i=o.length;s<i;s++)this.addInstance(r,o[s])},r.prototype.addInstanceType=function(t,e,n){return console.warn("addInstanceType is deprecated. Please use registerInstanceType instead"),this.registerInstanceType(e,n)},r.prototype.addInstance=function(t,e,n){var r=this._storage.instancesConstructors.jsConstructors[t],o=this.getInstance(t,e);if(!r||o)return!1;var s=new r(this.spiral,e,n);return this._storage.instances[t].push({node:e,instance:s}),s},r.prototype.removeInstance=function(t,e){var n,r=this.getInstance(t,e,!0);return!!r&&(r.instance.die(),n=this._storage.instances[t].indexOf(r),n!==-1&&this._storage.instances[t].splice(n,1),!0)},r.prototype.getInstance=function(t,e,n){var r=this._storage.instances[t],o=!1;if(!r)return!1;if(!(e=e instanceof HTMLElement?e:document.getElementById(e)))return!1;for(var s=0,i=r.length;s<i;s++)if(r[s].node===e){o=n?r[s]:r[s].instance;break}return o},r.prototype.getInstances=function(t){return this._storage.instances[t]||!1},r.prototype.registerAddon=function(t,e,n,r){if(this._storage.addons.hasOwnProperty(e)||(this._storage.addons[e]={}),this._storage.addons[e].hasOwnProperty(n)||(this._storage.addons[e][n]={}),this._storage.addons[e][n].hasOwnProperty(r))return void console.error("The %s addon type %s already registered for instance %s! Skipping registration.",r,n,e);this._storage.addons[e][n][r]=t},r.prototype.getInstanceAddon=function(t,e,n){return!!(this._storage.addons.hasOwnProperty(t)&&this._storage.addons[t].hasOwnProperty(e)&&this._storage.addons[t][e].hasOwnProperty(n))&&this._storage.addons[t][e][n]},r.prototype.getClasses=function(){return Object.keys(this._storage.instancesConstructors.cssClasses)},r.prototype.getInstanceNameByCssClass=function(t){return this._storage.instancesConstructors.cssClasses[t]},r.prototype.getInstanceConstructors=function(t){},t.exports=r},function(t,e,n){"use strict";t.exports=function(t){t.ajax.events.on("load",function(e){var n=e.response;if(n.hasOwnProperty("action"))if("string"==typeof n.action)t.events.trigger(n.action);else if("object"==typeof n.action){var r=Object.keys(n.action);if(r.indexOf("flash")!==-1){var o=n.action.flash,s=Date.now(),i={};"object"==typeof n.action.flash?(i=o,i.timestamp=s):i={message:o,timestamp:s},sessionStorage.setItem("sfFlashMessage",JSON.stringify(i))}r.indexOf("redirect")!==-1?setTimeout(function(){t.events.trigger("redirect",n.action.redirect,e)},0|+n.action.delay):r.indexOf("name")!==-1&&setTimeout(function(){t.events.trigger(n.action.name,n.action.url)},+n.action.delay||0)}else console.error("Action from server. Something wrong. ",n.action)}),function(t){if(t){var e,n,r,o=JSON.parse(t);Date.now()-o.timestamp>1e4||(r="debug"===o.type||"success"===o.type?"debug":"info"!==o.type&&o.type&&"notice"!==o.type?"danger":"info",e=document.createElement("div"),n=document.createElement("div"),n.classList.add("flash-wrapper"),e.classList.add("flash",r),e.innerHTML=o.message,document.body.appendChild(n),n.appendChild(e),setTimeout(function(){n.classList.add("show")},1),setTimeout(function(){n.classList.remove("show")},o.timeout||5e3),sessionStorage.removeItem("sfFlashMessage"))}}(sessionStorage.getItem("sfFlashMessage"))}},function(t,e){t.exports=function(t){t.on("redirect",function(t){var e="[object String]"===Object.prototype.toString.call(t)?t:t.url;self.location[/^(?:[a-z]+:)?\/\//i.test(e)?"href":"pathname"]=e}),t.on("reload",function(){location.reload()}),t.on("refresh",function(){t.trigger("reload")}),t.on("close",function(){self.close()})}},function(t,e,n){"use strict";var r=function(){this._DOMEventsStorage=[]};r.prototype.add=function(t){"[object Array]"!==Object.prototype.toString.call([])&&(t=[t]),t.forEach(function(t){t.useCapture=!!t.useCapture,t.DOMNode.addEventListener(t.eventType,t.eventFunction,t.useCapture),this._DOMEventsStorage.push(t)},this)},r.prototype.remove=function(t){console.warn("TODO IMPLEMENT")},r.prototype.removeAll=function(){this._DOMEventsStorage.forEach(function(t){t.DOMNode.removeEventListener(t.eventType,t.eventFunction,t.useCapture)}),this._DOMEventsStorage=[]},t.exports=r},function(t,e){t.exports={closest:function(t,e){e="string"==typeof e?[e]:e;for(var n,r=e.length,o=t.matches||t.webkitMatchesSelector||t.mozMatchesSelector||t.msMatchesSelector;t&&t.parentNode;){for(n=0;n<r;n++)if(o.call(t,e[n]))return t;t=t.parentNode}return!1},closestByClassName:function(t,e){e="string"==typeof e?[e]:e;for(var n,r=e.length;t&&t.parentNode;){for(n=0;n<r;n++){var o=new RegExp("(\\s|^)"+e[n]+"(\\s|$)");if(t.className.match(o))return t}t=t.parentNode}return!1}}},function(t,e,n){"use strict";var r={resolveKeyPath:function(t,e,n){return t.split(".").reduce(function(t,e){return n?t?t[e]:void 0:t[e]},e||self)}};t.exports=r},function(t,e,n){var r={Ajax:n(3),BaseDOMConstructor:n(4),DomMutations:n(5),Events:n(0),InstancesController:n(6)},o={DOMEvents:n(9),domTools:n(10),LikeFormData:n(1),tools:n(11)},s={core:r,helpers:o,tools:o.tools};t.exports=s},function(t,e){"function"!=typeof Object.assign&&function(){Object.assign=function(t){"use strict";if(void 0===t||null===t)throw new TypeError("Cannot convert undefined or null to object");for(var e=Object(t),n=1;n<arguments.length;n++){var r=arguments[n];if(void 0!==r&&null!==r)for(var o in r)r.hasOwnProperty(o)&&(e[o]=r[o])}return e}}()},function(t,e){!function(){for(var t,e=function(){},n=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeStamp","trace","warn"],r=n.length,o=window.console=window.console||{};r--;)t=n[r],o[t]||(o[t]=e)}()},function(t,e,n){(function(e,n){/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   3.3.1
 */
!function(e,r){t.exports=function(){"use strict";function t(t){return"function"==typeof t||"object"==typeof t&&null!==t}function o(t){return"function"==typeof t}function s(t){G=t}function i(t){K=t}function a(){return function(){Y(u)}}function c(){var t=setTimeout;return function(){return t(u,1)}}function u(){for(var t=0;t<J;t+=2)(0,Q[t])(Q[t+1]),Q[t]=void 0,Q[t+1]=void 0;J=0}function l(t,e){var n=arguments,r=this,o=new this.constructor(p);void 0===o[tt]&&I(o);var s=r._state;return s?function(){var t=n[s-1];K(function(){return P(s,o,t,r._result)})}():T(r,o,t,e),o}function f(t){var e=this;if(t&&"object"==typeof t&&t.constructor===e)return t;var n=new e(p);return b(n,t),n}function p(){}function d(){return new TypeError("You cannot resolve a promise with itself")}function h(){return new TypeError("A promises callback cannot return that same promise.")}function v(t){try{return t.then}catch(t){return ot.error=t,ot}}function y(t,e,n,r){try{t.call(e,n,r)}catch(t){return t}}function g(t,e,n){K(function(t){var r=!1,o=y(n,e,function(n){r||(r=!0,e!==n?b(t,n):O(t,n))},function(e){r||(r=!0,C(t,e))},"Settle: "+(t._label||" unknown promise"));!r&&o&&(r=!0,C(t,o))},t)}function m(t,e){e._state===nt?O(t,e._result):e._state===rt?C(t,e._result):T(e,void 0,function(e){return b(t,e)},function(e){return C(t,e)})}function w(t,e,n){e.constructor===t.constructor&&n===l&&e.constructor.resolve===f?m(t,e):n===ot?C(t,ot.error):void 0===n?O(t,e):o(n)?g(t,e,n):O(t,e)}function b(e,n){e===n?C(e,d()):t(n)?w(e,n,v(n)):O(e,n)}function _(t){t._onerror&&t._onerror(t._result),x(t)}function O(t,e){t._state===et&&(t._result=e,t._state=nt,0!==t._subscribers.length&&K(x,t))}function C(t,e){t._state===et&&(t._state=rt,t._result=e,K(_,t))}function T(t,e,n,r){var o=t._subscribers,s=o.length;t._onerror=null,o[s]=e,o[s+nt]=n,o[s+rt]=r,0===s&&t._state&&K(x,t)}function x(t){var e=t._subscribers,n=t._state;if(0!==e.length){for(var r=void 0,o=void 0,s=t._result,i=0;i<e.length;i+=3)r=e[i],o=e[i+n],r?P(n,r,o,s):o(s);t._subscribers.length=0}}function E(){this.error=null}function j(t,e){try{return t(e)}catch(t){return st.error=t,st}}function P(t,e,n,r){var s=o(n),i=void 0,a=void 0,c=void 0,u=void 0;if(s){if(i=j(n,r),i===st?(u=!0,a=i.error,i=null):c=!0,e===i)return void C(e,h())}else i=r,c=!0;e._state!==et||(s&&c?b(e,i):u?C(e,a):t===nt?O(e,i):t===rt&&C(e,i))}function M(t,e){try{e(function(e){b(t,e)},function(e){C(t,e)})}catch(e){C(t,e)}}function S(){return it++}function I(t){t[tt]=it++,t._state=void 0,t._result=void 0,t._subscribers=[]}function A(t,e){this._instanceConstructor=t,this.promise=new t(p),this.promise[tt]||I(this.promise),X(e)?(this._input=e,this.length=e.length,this._remaining=e.length,this._result=new Array(this.length),0===this.length?O(this.promise,this._result):(this.length=this.length||0,this._enumerate(),0===this._remaining&&O(this.promise,this._result))):C(this.promise,D())}function D(){return new Error("Array Methods must be provided an Array")}function N(t){return new A(this,t).promise}function L(t){var e=this;return new e(X(t)?function(n,r){for(var o=t.length,s=0;s<o;s++)e.resolve(t[s]).then(n,r)}:function(t,e){return e(new TypeError("You must pass an array to race."))})}function k(t){var e=this,n=new e(p);return C(n,t),n}function R(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}function H(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}function q(t){this[tt]=S(),this._result=this._state=void 0,this._subscribers=[],p!==t&&("function"!=typeof t&&R(),this instanceof q?M(this,t):H())}function F(){var t=void 0;if(void 0!==n)t=n;else if("undefined"!=typeof self)t=self;else try{t=Function("return this")()}catch(t){throw new Error("polyfill failed because global object is unavailable in this environment")}var e=t.Promise;if(e){var r=null;try{r=Object.prototype.toString.call(e.resolve())}catch(t){}if("[object Promise]"===r&&!e.cast)return}t.Promise=q}var B=void 0;B=Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)};var X=B,J=0,Y=void 0,G=void 0,K=function(t,e){Q[J]=t,Q[J+1]=e,2==(J+=2)&&(G?G(u):Z())},V="undefined"!=typeof window?window:void 0,z=V||{},W=z.MutationObserver||z.WebKitMutationObserver,U="undefined"==typeof self&&void 0!==e&&"[object process]"==={}.toString.call(e),$="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,Q=new Array(1e3),Z=void 0;Z=U?function(){return function(){return e.nextTick(u)}}():W?function(){var t=0,e=new W(u),n=document.createTextNode("");return e.observe(n,{characterData:!0}),function(){n.data=t=++t%2}}():$?function(){var t=new MessageChannel;return t.port1.onmessage=u,function(){return t.port2.postMessage(0)}}():void 0===V?function(){try{var t=r(18);return Y=t.runOnLoop||t.runOnContext,a()}catch(t){return c()}}():c();var tt=Math.random().toString(36).substring(16),et=void 0,nt=1,rt=2,ot=new E,st=new E,it=0;return A.prototype._enumerate=function(){for(var t=this.length,e=this._input,n=0;this._state===et&&n<t;n++)this._eachEntry(e[n],n)},A.prototype._eachEntry=function(t,e){var n=this._instanceConstructor,r=n.resolve;if(r===f){var o=v(t);if(o===l&&t._state!==et)this._settledAt(t._state,e,t._result);else if("function"!=typeof o)this._remaining--,this._result[e]=t;else if(n===q){var s=new n(p);w(s,t,o),this._willSettleAt(s,e)}else this._willSettleAt(new n(function(e){return e(t)}),e)}else this._willSettleAt(r(t),e)},A.prototype._settledAt=function(t,e,n){var r=this.promise;r._state===et&&(this._remaining--,t===rt?C(r,n):this._result[e]=n),0===this._remaining&&O(r,this._result)},A.prototype._willSettleAt=function(t,e){var n=this;T(t,void 0,function(t){return n._settledAt(nt,e,t)},function(t){return n._settledAt(rt,e,t)})},q.all=N,q.race=L,q.resolve=f,q.reject=k,q._setScheduler=s,q._setAsap=i,q._asap=K,q.prototype={constructor:q,then:l,catch:function(t){return this.then(null,t)}},F(),q.polyfill=F,q.Promise=q,q}()}()}).call(e,n(16),n(17))},function(t,e){function n(){throw new Error("setTimeout has not been defined")}function r(){throw new Error("clearTimeout has not been defined")}function o(t){if(l===setTimeout)return setTimeout(t,0);if((l===n||!l)&&setTimeout)return l=setTimeout,setTimeout(t,0);try{return l(t,0)}catch(e){try{return l.call(null,t,0)}catch(e){return l.call(this,t,0)}}}function s(t){if(f===clearTimeout)return clearTimeout(t);if((f===r||!f)&&clearTimeout)return f=clearTimeout,clearTimeout(t);try{return f(t)}catch(e){try{return f.call(null,t)}catch(e){return f.call(this,t)}}}function i(){v&&d&&(v=!1,d.length?h=d.concat(h):y=-1,h.length&&a())}function a(){if(!v){var t=o(i);v=!0;for(var e=h.length;e;){for(d=h,h=[];++y<e;)d&&d[y].run();y=-1,e=h.length}d=null,v=!1,s(t)}}function c(t,e){this.fun=t,this.array=e}function u(){}var l,f,p=t.exports={};!function(){try{l="function"==typeof setTimeout?setTimeout:n}catch(t){l=n}try{f="function"==typeof clearTimeout?clearTimeout:r}catch(t){f=r}}();var d,h=[],v=!1,y=-1;p.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];h.push(new c(t,e)),1!==h.length||v||o(a)},c.prototype.run=function(){this.fun.apply(null,this.array)},p.title="browser",p.browser=!0,p.env={},p.argv=[],p.version="",p.versions={},p.on=u,p.addListener=u,p.once=u,p.off=u,p.removeListener=u,p.removeAllListeners=u,p.emit=u,p.binding=function(t){throw new Error("process.binding is not supported")},p.cwd=function(){return"/"},p.chdir=function(t){throw new Error("process.chdir is not supported")},p.umask=function(){return 0}},function(t,e){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(t){"object"==typeof window&&(n=window)}t.exports=n},function(t,e){},function(t,e,n){t.exports=n(2)}])});
//# sourceMappingURL=sf.js.map