/**
 * Default task
 */
var gulp = require('gulp');

gulp.task('default', function() {
    var tasks = Object.keys(gulp.tasks);
    var def = tasks.indexOf("default");
    tasks.splice(def, 1);
    console.log("Available tasks:",tasks.toString());
    console.log("Use as 'gulp {TaskName}'");
});

