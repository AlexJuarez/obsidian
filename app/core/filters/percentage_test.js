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

        it('should not convert to percentage', function () {
            expect(filter(3)).toEqual(3);
            expect(filter(1.45)).toEqual(1.45);
            expect(filter(3.002364)).toEqual(3.002364);
        });

        it('should convert to percentage', function () {
            expect(filter(0.23458)).toEqual('23.46');
            expect(filter(0)).toEqual('0.00');
            expect(filter(0.15)).toEqual('15.00');
        });

    });
});
