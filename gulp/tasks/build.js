'use strict';

var Browserify = require('browserify');
var gulp = require('gulp');
var path = require('path');
var less = require('gulp-less');
var rename = require('gulp-rename');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');

var browserify = function(){
    return Browserify({
        entries: './index.js',
        debug: true
    });
};

//todo check if we can compile first max version then min. Not need if we will write build options.
// For now I(@Alex) couldn't get right sourcemaps if build both versions in one stream.

//Recommended by gulp:
//https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-uglify-sourcemap.md
//https://medium.com/@sogko/gulp-browserify-the-gulp-y-way-bb359b3f9623
gulp.task('build-js-max', function () {
    return browserify().bundle()
        .pipe(source('sf.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.join(process.cwd(), 'build')));
});

gulp.task('build-js-min', function () {
    return browserify().bundle()
        .pipe(source('sf.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.join(process.cwd(), 'build')));
});

gulp.task('build-js', ['build-js-max', 'build-js-min']);
gulp.task('build', ['build-js', 'build-less']);


//gulp.task('build-js', function(){
//    var b = Browserify({
//        entries: './index.js',
//        debug: true
//    });
//    return b.bundle()
//        .pipe(uglify())
//        .pipe(exorcist(path.join(process.cwd(), 'build', 'sf.js.map')))
//        .pipe(
//        fs.createWriteStream(path.join(process.cwd(), 'build', 'sf.js'), 'utf8').on("finish", function () {
//                console.log("File and source map saved to ", path.join(process.cwd(), 'build'));
//            }
//        )
//    );
//});


gulp.task('build-less', function(){
    return gulp.src('index.less')
        .pipe(less())
        .pipe(rename('sf.css'))
        .pipe(gulp.dest('./build'));
});

