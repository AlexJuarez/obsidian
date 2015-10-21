define(function (require) {
    'use strict';

    var app = require('./../module');

    app.filter('shortenAdType', [function () {
        
        return function (data, containerType) {
            switch (data) {
                case 'In-Banner':
                    return 'IBV';
                case 'In-Stream':
                    return 'ISV';
                case 'Display':
                    return containerType;
                case 'Rich Media':
                    return 'RM';
                default:
                    return 'Unknown';
            }
        };
    }]);
});
