/**
 * Task to generate jsdoc documentation
 */
var gulp = require('gulp');
var jsdoc = require("gulp-jsdoc");
var through = require('through2');
var path = require('path');


gulp.task('jsdoc', function () {
    console.log(__dirname);
    return gulp.src(["./lib/**/*.js", "README.md"])
        .pipe(through.obj(function (file, enc, cb) {
            console.log("Processing file - ", file.path);
            this.push(file);
            cb();
        }))
        .pipe(jsdoc.parser({
            plugins: [
                "plugins/markdown",
                path.join(__dirname, '..', 'plugins', 'jsdoc', 'escapeHtmlExamples.js')

            ]
        })).pipe(jsdoc.generator(
            './jsdoc',
            {
                path: path.join(__dirname, '..', '..', 'node_modules', 'jaguarjs-jsdoc'),
                applicationName: 'Spiral js ',
                "meta": {
                    "title": "Spiral js documentation",
                    "description": "",
                    "keyword": ""
                },
                "linenums": true

            }
        ));


});


/**
 * @TODO remove second version? But it allow us to use newest jsdoc
 */
var shell = require('gulp-shell');
gulp.task('jsdoc2', shell.task([
    'node_modules/jsdoc/jsdoc.js ' +
//    '-c node_modules/angular-jsdoc/conf.json '+   // config file
    '-t node_modules/jaguarjs-jsdoc ' +    // template file
    '-d jsdoc ' +                             // output directory
    '-r lib'                              // source code directory
    // '--verbose '                             // verbose
]));

