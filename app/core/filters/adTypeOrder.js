define(function (require) {
    'use strict';

    var app = require('./../module');

    app.filter('adTypeOrder', function () {

        function customOrder(item) {
            switch(item) {
                case 'inBanner':
                    return 1;
                case 'inStream':
                    return 2;
                case 'richMedia':
                    return 3;
                case 'display':
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
