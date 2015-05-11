/**
 * Created by Alex on 3/1/2015.
 */
require.config({
    paths: {
        'angular': 'components/angular/angular',
        'tpl': 'components/requirejs-tpl-angular/tpl',
        'text': 'components/requirejs-text/text',
        'domReady': 'components/domReady/domReady',
        'd3': 'components/d3/d3',
        'jquery': 'components/jquery/dist/jquery',
        'chosen': 'components/chosen/chosen.jquery',
        'angular-chosen': 'components/angular-chosen-localytics/chosen'
    },
    shim: {
        'jquery': {
            exports: 'jquery'
        },
        'angular-chosen': {
            deps: ['angular', 'chosen']
        },
        'chosen': {
            deps: ['jquery']
        },
        'd3': {
            exports: 'd3'
        },
        'angular': {
            deps: ['jquery'],
            exports: 'angular'
        },
    },

    deps: [
        './bootstrap-core'
    ]
});
