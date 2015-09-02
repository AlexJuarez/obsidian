define(function(require) {
    'use strict';

    var module = require('./../../../module');

    module.service('newCreativeService', ['$q', function($q) {
            return function(creative) {
                console.log($q);
                console.log(creative);
                // debugger;
                // TODO: Send creative to studio, return promise...
            };
        }
    ]);
});
