'use strict';

var Browserify = require('browserify');
var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var exorcist = require('exorcist');

gulp.task('build', function () {
    var browserify = Browserify({
        entries: './index.js',
        debug: true
    });
    return browserify.bundle()
        .pipe(exorcist(path.join(process.cwd(), 'build', 'sf.js.map')))
        .pipe(
        fs.createWriteStream(path.join(process.cwd(), 'build', 'sf.js'), 'utf8').on("finish", function () {
                console.log("File and source map saved to ", path.join(process.cwd(), 'build'));
            }
        )
    );

});

