#sf.js Spiral Frontend micro-framework for RAD (beta)

sf.js is made because we wanted to auto init javascript modules/components/plugins.

-What if your module (ajax form for example) will be show later?  
-Why should you manually init/teardown it?  
-Why at all you should go to script and init it?  

This sf.js will do for you:  
-Init module when it's DOM node is there.  
-Teardown module when it's DOM node is removed.  

Based on [DOM Mutations](https://developer.mozilla.org/en/docs/Web/API/MutationObserver)

#Examples:
##sf.js includes ajax-form module by default
```html
    <script src="sf.min.js"></script>
    <form class="js-sf-form" action="/someAPI">
        <label class="item-form">
            <span class="item-label">Email</span>
            <input type="text" name="email" class="item-input"/>
        </label>
        <label class="item-form">
            <span class="item-label">Password</span>
            <input type="text" name="password" class="item-input"/>
        </label>
        <button>Send</button>
    </form>
```

##example for custorm module (image cropper library)
```html
    <script src="sf.min.js"></script>
    <script src="crop.sf.js"></script>
    <form class="js-sf-form" action="/someAPI">
        <input type="file" class="js-sf-crop"> 
        <button>Send</button>
    </form>
```

#How it works (in short)
Each module is a constructor function and should be registered in sf.js
```javascript
var Crop = function (sf, node, options) {
    this._construct(sf, node, options);
};
Crop.prototype = Object.create(sf.modules.core.BaseDOMConstructor.prototype);
...
sf.instancesController.registerInstanceType(Crop,"js-sf-crop");
```

Then, instancesController looks at DOM, and initialize new instance of module for each matched DOM node.  
Also it will init new instances if DOM node will be added later.

#todo documentation #14

## License

Copyright (c) 2015-2016 Andrew Logunov and contributors. Released under an MIT license.