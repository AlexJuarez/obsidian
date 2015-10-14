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
        'jquery': 'components/jquery/dist/jquery',
        'select2': 'components/select2/dist/js/select2.full',
        'perfect-scrollbar': 'components/perfect-scrollbar/src/perfect-scrollbar',
        'ng-datepicker': 'vendor/ui-bootstrap-datepicker-0.13.0',
        'simpleUpload': 'components/Simple-Ajax-Uploader/SimpleAjaxUploader'
    },
    shim: {
        'd3': {
            exports: 'd3'
        },
        'jquery': {
            exports: 'jquery'
        },
        'select2': {
            deps: ['jquery']
        },
        'simpleUpload': {
            deps: ['jquery'],
            exports: 'ss'
        },
        'perfect-scrollbar': {
            deps: ['jquery']
        },
        'ng-datepicker': {
            deps: ['jquery', 'angular']
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
        './bootstrap-core'
    ]
});
