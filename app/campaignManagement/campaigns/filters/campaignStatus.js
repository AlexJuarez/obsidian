define(function (require) {
    'use strict';

    var app = require('./../../module');
    //var ng = require('angular');

    app.filter('campaignStatus', [function () {
        return function (input) {
            switch (input) {
                case 'preFlight':
                    return 'Pre-Flight';
                case 'inFlight':
                    return 'In-Flight';
                case 'live':
                    return 'Live';
                case 'completed':
                    return 'Completed';
                case 'archived':
                    return 'Archived';
                default:
                    return 'Unknown';
            }
        };
    }]);
});
