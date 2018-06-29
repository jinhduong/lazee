module.exports = function (grunt) {
    "use strict"
    grunt.initConfig({
        qunit: {
            files: ["test/index.html"]
        }
    });
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.registerTask("test", "qunit");
};