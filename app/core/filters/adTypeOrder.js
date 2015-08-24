define(function (require) {
    'use strict';

    var app = require('./../module');

    app.filter('adTypeOrder', function () {

        function customOrder(item) {
            switch(item) {
                case 'In-Banner':
                    return 1;
                case 'In-Stream':
                    return 2;
                case 'Rich Media':
                    return 3;
                case 'Display':
                    return 4;
            }
        }

        return function(items) {
            
            return items.sort(function(a, b) {
                return ( customOrder(a.type) > customOrder(b.type) ? 1 : -1 );
            });

        };
    });
});
