define(function (require) {
    'use strict';

    require('./truncateNumber');
    require('angularMocks');

    describe('truncateNumberFilter', function () {
        var filter;

        beforeEach(function () {
            module('app.core');
            inject(function ($filter) {
                filter = $filter('truncateNumber');
            });
        });

        it('should return zero if non-number.', function () {
            expect(filter(true)).toEqual(0);
            expect(filter({})).toEqual(0);
        });

        it('should not trunc.', function () {
            expect(filter(345)).toEqual(345);
            expect(filter(0)).toEqual(0);
            expect(filter(15)).toEqual(15);
            expect(filter(999)).toEqual(999);
        });

        it('should trunc to K', function () {
            expect(filter(1000)).toEqual('1K');
            expect(filter(345456)).toEqual('345.5K');
            expect(filter(7650)).toEqual('7.7K');
            expect(filter(15345)).toEqual('15.3K');
        });

        it('should trunc to M', function () {
            expect(filter(999999)).toEqual('1M');
            expect(filter(1000000)).toEqual('1M');
            expect(filter(345456098)).toEqual('345.5M');
            expect(filter(7650098)).toEqual('7.7M');
            expect(filter(15345098)).toEqual('15.3M');
        });

        it('should filter to B', function () {
            expect(filter(999999999)).toEqual('1B');
            expect(filter(1000000000)).toEqual('1B');
            expect(filter(15345098000)).toEqual('15.3B');
        });

        it('should return the input if trillions.', function () {
            expect(filter(999999999999)).toEqual(999999999999);
            expect(filter(1000000000000)).toEqual(1000000000000);
            expect(filter(15345098000000)).toEqual(15345098000000);
        });

    });
});
