module.exports = function(events){
    events.on("redirect", function (event) {
        var url = Object.prototype.toString.call(event) === "[object String]" ? event : event.url;
        //http://stackoverflow.com/questions/10687099/how-to-test-if-a-url-string-is-absolute-or-relative
        self.location[/^(?:[a-z]+:)?\/\//i.test(url) ? 'href' : 'pathname'] = url;
    });

    events.on('reload', function () {
        location.reload();
    });

    events.on('refresh', function () {
        events.trigger('reload');
    });

    events.on('close', function () {
        self.close();
    });
};