define(function (require) {
    'use strict';

    require('./shortenAdType');
    require('angularMocks');

    describe('shortenAdTypeFilter', function () {
        var filter;

        beforeEach(function () {
            module('app.core');
            inject(function ($filter) {
                filter = $filter('shortenAdType');
            });
        });

        it('should convert "In-Banner" to "IBV"', function () {
            expect(filter('In-Banner')).toEqual('IBV');
        });

        it('should convert "In-Stream" to "ISV"', function () {
            expect(filter('In-Stream')).toEqual('ISV');
        });

        it('should convert "Display" to "IMG/SWF"', function () {
            expect(filter('Display')).toEqual('IMG/SWF');
        });

        it('should convert "Rich Media" to "RM"', function () {
            expect(filter('Rich Media')).toEqual('RM');
        });

    });
});
