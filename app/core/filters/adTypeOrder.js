define(function (require) {
    'use strict';

    var app = require('./../module');
    //var ng = require('angular');

    app.filter('adTypeOrder', function () {
        console.log( '-------- custom filter' );

        function customOrder(item) {
            //console.log( '-------- customOrder', item );
            switch(item) {
                case 'In-Banner':
                    //console.log( 'In-Banner' );
                    return 1;
                case 'In-Stream':
                    //console.log( 'In-Stream' );
                    return 2;
                case 'Rich Media':
                    //console.log( 'RM' );
                    return 3;
                case 'Display':
                    //console.log( 'Display' );
                    return 4;
            }
        }



        return function(items) {
            //console.log( '------ return sort fn' );
            
            return items.sort(function(a, b) {
                return ( customOrder(a.type) > customOrder(b.type) ? 1 : -1 );
            });

        };
    });
});
