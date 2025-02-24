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
            expect(filter('In-Banner','MLQ')).toEqual('IBV');
        });

        it('should convert "In-Stream" to "ISV"', function () {
            expect(filter('In-Stream','MLQ')).toEqual('ISV');
        });

        it('should convert "Display" to either "IMG" or "SWF"', function () {
            expect(filter('Display','IMG')).toEqual('IMG');
            expect(filter('Display','SWF')).toEqual('SWF');
        });

        it('should convert "Rich Media" to "RM"', function () {
            expect(filter('Rich Media','MLQ')).toEqual('RM');
        });

    });
});
