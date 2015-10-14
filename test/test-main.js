var allTestFiles = [];
var TEST_REGEXP = /_test\.js$/;
var filter;

if (window.__karma__.config.filter) {
    filter = window.__karma__.config.filter;
    filter = new RegExp(filter);
}

var pathToModule = function(path) {
    return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

function testPath(path) {
    if (typeof filter !== 'undefined') {
        return filter.test(path);
    }
    return true;
}

Object.keys(window.__karma__.files).forEach(function(file) {
    if (TEST_REGEXP.test(file) && testPath(file)) {
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
        'select2': '/base/app/components/select2/dist/js/select2.full',
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
            deps: ['jquery', 'perfect-scrollbar']
        },
        'ui-router': {
            deps: ['angular']
        },
        'simpleUpload': {
            deps: ['jquery'],
            exports: 'ss'
        },
        'perfect-scrollbar': {
            deps: ['jquery']
        },
        'select2': {
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
