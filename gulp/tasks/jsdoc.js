/**
 * Task to generate jsdoc documentation
 */
var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('jsdoc', shell.task([
    'node_modules/jsdoc/jsdoc.js -c jsdoc.json'  // run jsdoc with config file
]));

