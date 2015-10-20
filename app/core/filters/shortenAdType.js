define(function (require) {
    'use strict';

    var app = require('./../module');

    app.filter('shortenAdType', [function () {
        return function (input) {
            console.log( 'shortenAdType',input );
            switch (input) {
                case 'In-Banner':
                    return 'IBV';
                case 'In-Stream':
                    return 'ISV';
                case 'Display':
                    return 'IMG/SWF';
                case 'Rich Media':
                    return 'RM';
                default:
                    return 'Unknown';
            }
        };
    }]);
});
