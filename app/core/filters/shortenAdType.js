define(function (require) {
    'use strict';

    var app = require('./../module');

    app.filter('shortenAdType', [function () {
        return function (input) {
            switch (input) {
                case 'In-Banner':
                    return 'IBV';
                case 'In-Stream':
                    return 'ISV';
                case 'Display':
<<<<<<< HEAD
                    return 'IMG/SWF';
=======
                    return 'D';
>>>>>>> 089d5f2... added filter and rule to table to abbreviate ad type
                case 'Rich Media':
                    return 'RM';
                default:
                    return 'Unknown';
            }
        };
    }]);
});
