/*jshint camelcase: false */

'use strict';

module.exports = function (grunt) {
    // show elapsed time at the end
    //require('time-grunt')(grunt);

    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // load all grunt configuration
    require('load-grunt-config')(grunt);

    // Register Tasks
    grunt.registerTask('default', 'Start working on this project.', [
        'jshint',
        'webfont',
        'less:dev',
        'express:dev',
        //'open:site',
        //'open:editor',
        'watch'
    ]);

    grunt.registerTask('workon', 'alias for default', ['default']);

    // Restart
    grunt.registerTask('serve', 'Restart the server.', [
        'express:prod',
        'watch'
    ]);

    grunt.registerTask('build:bower', 'Creates assets to export', [
        'clean:bower',
        'less:bower',
        'requirejs:core',
        'requirejs:coremin',
        'copy:bower'
    ]);


    // Build
    grunt.registerTask('build', 'Build production ready assets and views.', [
        'clean:dist',
        'less:dist',
        'concurrent:dist',
        'useminPrepare',
        'imagemin',
        'copy:dist',
        'rev',
        'usemin'
    ]);

};
