var allTestFiles = [];
var TEST_REGEXP = /_test\.js$/;

var pathToModule = function(path) {
    return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
    if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        allTestFiles.push(pathToModule(file));
    }
});

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/',

    paths: {
        'angular': '/base/app/components/angular/angular',
        'angularMocks': '/base/app/components/angular-mocks/angular-mocks',
        'ui-router': '/base/app/components/angular-ui-router/release/angular-ui-router',
        'domReady': '/base/app/components/domReady/domReady',
        'tpl': '/base/app/components/requirejs-tpl-angular/tpl',
        'text': '/base/app/components/requirejs-text/text',
        'd3': '/base/app/components/d3/d3',
        'hljs': '/base/app/components/highlightjs/highlight.pack',
        'jquery': '/base/app/components/jquery/dist/jquery',
        'chosen': '/base/app/components/chosen/chosen.jquery',
        'angular-chosen': '/base/app/components/angular-chosen-localytics/chosen',
        'ng-perfect-scrollbar': '/base/app/components/angular-perfect-scrollbar/src/angular-perfect-scrollbar',
        'perfect-scrollbar': '/base/app/components/perfect-scrollbar/src/perfect-scrollbar',
        'simpleUpload': '/base/app/components/Simple-Ajax-Uploader/SimpleAjaxUploader'
    },
    shim: {
        'hljs': {
            exports: 'hljs'
        },
        'angularMocks': {
            deps: ['angular']
        },
        'd3': {
            exports: 'd3'
        },
        'angular': {
            exports: 'angular',
            deps: ['jquery']
        },
        'ui-router': {
            deps: ['angular']
        },
        'simpleUpload': {
            deps: ['jquery'],
            exports: 'ss'
        },
        'ng-perfect-scrollbar': {
            deps: ['angular', 'perfect-scrollbar']
        },
        'perfect-scrollbar': {
            deps: ['jquery']
        },
        'angular-chosen': {
            deps: ['angular', 'chosen']
        },
        'chosen': {
            deps: ['jquery']
        },
        'jquery': {
            exports: 'jquery'
        }
    },

    // ask Require.js to load these files (all our tests)
    deps: allTestFiles,

    // start test run, once Require.js is done
    callback: function() {
        require(['domReady!'], function() {
            window.__karma__.start();
        }
    )}
});
