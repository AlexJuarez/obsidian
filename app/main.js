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
        'hljs': 'components/highlightjs/highlight.pack'
    },
    shim: {
        'd3': {
            exports: 'd3'
        },
        'angular': {
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
