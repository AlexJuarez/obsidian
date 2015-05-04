/**
 * Created by Alex on 3/1/2015.
 */
require.config({
    paths: {
        'angular': 'components/angular/angular',
        'tpl': 'components/requirejs-tpl-angular/tpl',
        'text': 'components/requirejs-text/text',
        'domReady': 'components/domReady/domReady',
        'd3': 'components/d3/d3'
    },
    shim: {
        'd3': {
            exports: 'd3'
        },
        'angular': {
            exports: 'angular'
        }
    },

    deps: [
        './bootstrap-core'
    ]
});
