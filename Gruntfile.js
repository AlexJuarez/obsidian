/*jshint camelcase: false */

'use strict';

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        // Watch Config
        watch: {
            files: ['views/**/*'],
            options: {
                livereload: true
            },
            scripts: {
                files: [
                    'app/**/*.js',
                ]
            },
            html: {
                files: [
                    'app/**/*.html'
                ]
            },
            css: {
                files: [
                    'assets/styles/**/*.css',
                ]
            },
            less: {
                files: ['assets/styles/**/*.less'],
                tasks: ['less:dev']
            },
            fonts: {
                files: ['assets/icons/*.svg'],
                tasks: ['webfont']
            },
            images: {
                files: [
                    'assets/images/**/*.{png,jpg,jpeg,webp}'
                ]
            },
            express: {
                files: ['app.js', '!**/node_modules/**', '!Gruntfile.js'],
                tasks: ['express:dev'],
                options: {
                    nospawn: true // Without this option specified express won't be reloaded
                }
            }
        },

        // Clean Config
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        'dist/*',
                        '!dist/.git*'
                    ]
                }]
            },
            server: ['.tmp']
        },

        // Hint Config
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'app/**/*.js',
                'assets/scripts/**/*.js',
                '!app/components/**/*',
                '!assets/scripts/vendor/*'
            ]
        },

        webfont: {
            icons: {
                src: 'assets/icons/*.svg',
                dest: 'assets/font',
                destCss: 'assets/styles',
                options: {
                    htmlDemo: true,
                    destHtml: 'app/home',
                    htmlDemoTemplate: 'assets/icons/template.html',
                    syntax: 'bootstrap',
                    relativeFontPath: '/font/',
                    templateOptions: {
                        baseClass: 'glyph-icon',
                        classPrefix: 'glyph-',
                        mixinPrefix: 'glyph-'
                    },
                    font: 'mixpo-icons'
                }
            }
        },

        less: {
            dev: {
                options: {
                    paths: ['assets/styles/less']
                },
                files: {
                    'assets/styles/screen.css': 'assets/styles/less/screen.less',
                    'assets/styles/core.css': 'assets/styles/core/core.less'
                }
            },
            dist: {
                options: {
                    paths: ['assets/styles/less'],
                    plugins: [
                        new (require('less-plugin-autoprefix'))({browsers: ['last 2 versions']}),
                        new (require('less-plugin-clean-css'))()
                    ]
                },
                files: {
                    'assets/styles/screen.css': 'assets/styles/less/screen.less',
                    'assets/styles/core.css': 'assets/styles/core/core.less'
                }
            }
        },

        requirejs: {
            compile: {
                options: {
                    baseUrl: 'app',
                    mainConfigFile: 'app/main.js',
                    generateSourceMaps: true,
                    preserveLicenseComments: false,

                    optimize: 'uglify2', //none uglify2
                    out: 'dist/assets/scripts/app.js',

                    findNestedDependencies: true,
                    include: ['main'],
                    name: 'components/almond/almond'
                }
            }
        },

        // Express Config
        express: {
            options: {
                // Override defaults here
            },
            dev: {
                options: {
                    script: 'app.js'
                }
            },
            prod: {
                options: {
                    script: 'app.js',
                    node_env: 'production'
                }
            }
        },

        // Open Config
        open: {
            site: {
                path: 'http://localhost:3000',
                app: 'chrome'
            },
            editor: {
                path: './',
                app: 'webstorm'
            }
        },

        // Rev Config
        rev: {
            dist: {
                files: {
                    src: [
                        'dist/assets/scripts/**/*.js',
                        'dist/assets/styles/**/*.css',
                        'dist/assets/images/**/*.{png,jpg,jpeg,webp}',
                        'dist/assets/font/**/*.*'
                    ]
                }
            }
        },

        // Usemin Config
        useminPrepare: {
            options: {
                dest: 'dist/assets'
            },
            html: ['assets/{,*/}*.html', 'views/**/*.html']
        },
        usemin: {
            options: {
                dirs: ['dist/assets'],
                basedir: 'dist/assets'
            },
            html: ['dist/assets/{,*/}*.html', 'dist/views/**/*.html'],
            css: ['dist/assets/styles/{,*/}*.css']
        },

        // Imagemin Config
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'assets/images',
                    src: '**/*.{png,jpg,jpeg}',
                    dest: 'dist/assets/images'
                }]
            }
        },

        // SVGmin Config
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'assets/images',
                    src: '{,*/}*.svg',
                    dest: 'dist/assets/images'
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                     // https://github.com/yeoman/grunt-usemin/issues/44
                     //collapseWhitespace: true,
                     collapseBooleanAttributes: true,
                     removeAttributeQuotes: true,
                     removeRedundantAttributes: true,
                     useShortDoctype: true,
                     removeEmptyAttributes: true,
                     removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: 'assets',
                    src: '*.html',
                    dest: 'dist/assets'
                }]
            }
        },

        // Copy Config
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'assets',
                    dest: 'dist/assets',
                    src: [
                        'fixtures/**/*.json',
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/**/*.{webp,gif}',
                        'font/{,*/}*.*'
                    ]
                }, {
                    expand: true,
                    dot: true,
                    cwd: 'views',
                    dest: 'dist/views/',
                    src: '**/*.html'
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: 'assets/styles',
                dest: 'dist/assets/styles/',
                src: '{,*/}*.css'
            }
        },

        // Concurrent Config
        concurrent: {
            dist: [
                'requirejs',
                'copy:styles',
                'svgmin',
                'htmlmin'
            ]
        }
    });

    // Register Tasks
    // Workon
    grunt.registerTask('workon', 'Start working on this project.', [
        'jshint',
        'less:dev',
        'webfont',
        'express:dev',
        //'open:site',
        //'open:editor',
        'watch'
    ]);

    // Restart
    grunt.registerTask('serve', 'Restart the server.', [
        'express:prod',
        'watch'
    ]);


    // Build
    grunt.registerTask('build', 'Build production ready assets and views.', [
        'clean:dist',
        'less:dist',
        'webfont',
        'concurrent:dist',
        'useminPrepare',
        'imagemin',
        'copy:dist',
        'rev',
        'usemin'
    ]);

};
