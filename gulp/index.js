var fs = require('fs');
var onlyScripts = require('./utils/scriptFilter');
var tasks = fs.readdirSync('./gulp/tasks/').filter(onlyScripts);

console.log("Gulp loading tasks...");

tasks.forEach(function(task) {
    try {
        require('./tasks/' + task);
        console.log("Task ",task," loaded");
    } catch (e){
        console.log("\x1B[31m Error loading task ",task,". \x1B[39m",e);
    }

});