define(function (require) {
    'use strict';

    require('./percentage');
    require('angularMocks');

    describe('percentageFilter', function () {
        var filter;

        beforeEach(function () {
            module('app.core');
            inject(function ($filter) {
                filter = $filter('percentage');
            });
        });

        it('should not trunc.', function () {
            expect(filter(345)).toEqual(345);
            expect(filter(0)).toEqual(0);
            expect(filter(15)).toEqual(15);
        });

        // it('should trunc to K', function () {
        //     expect(filter(345456)).toEqual('345.5K');
        //     expect(filter(7650)).toEqual('7.7K');
        //     expect(filter(15345)).toEqual('15.3K');
        // });

        // it('should trunc to M', function () {
        //     expect(filter(345456098)).toEqual('345.5M');
        //     expect(filter(7650098)).toEqual('7.7M');
        //     expect(filter(15345098)).toEqual('15.3M');
        // });

        // it('should filter to B', function () {
        //     expect(filter(15345098000)).toEqual('15.3B');
        // });

        // it('should return the input if trillions.', function () {
        //     expect(filter(15345098000000)).toEqual(15345098000000);
        // });

    });
});
