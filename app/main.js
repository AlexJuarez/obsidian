/**
 * Created by Alex on 3/1/2015.
 */
require.config({
    paths: {
        'angular': 'components/angular/angular',
        'ui-router': 'components/angular-ui-router/release/angular-ui-router',
        'domReady': 'components/domReady/domReady',
        'tpl': 'components/requirejs-tpl-angular/tpl',
        'text': 'components/requirejs-text/text',
        'd3': 'components/d3/d3',
        'hljs': 'components/highlightjs/highlight.pack',
        'jquery': 'components/jquery/dist/jquery',
        'chosen': 'components/chosen/chosen.jquery',
        'angular-chosen': 'components/angular-chosen-localytics/chosen',
        'ng-perfect-scrollbar': 'components/angular-perfect-scrollbar/src/angular-perfect-scrollbar',
        'perfect-scrollbar': 'components/perfect-scrollbar/src/perfect-scrollbar',
        'ng-datepicker': 'vendor/ui-bootstrap-datepicker-0.13.0',
        'simpleUpload': 'components/Simple-Ajax-Uploader/SimpleAjaxUploader'
    },
    shim: {
        'hljs': {
            exports: 'hljs'
        },
        'd3': {
            exports: 'd3'
        },
        'jquery': {
            exports: 'jquery'
        },
        'ng-perfect-scrollbar': {
            deps: ['angular', 'perfect-scrollbar']
        },
        'simpleUpload': {
            deps: ['jquery'],
            exports: 'ss'
        },
        'ng-datepicker': {
            deps: ['jquery', 'angular']
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
        'angular': {
            deps: ['jquery'],
            exports: 'angular'
        },
        'ui-router': {
            deps: ['angular']
        }
    },

    deps: [
        './bootstrap'
    ]
});
