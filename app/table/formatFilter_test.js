/**
 * Created by alex on 4/27/15.
 */
define(function (require) {
    'use strict';

    require('./formatFilter');
    require('angularMocks');

    describe('formatFilter', function () {
        var filter;

        beforeEach(function () {
            module('app.tables');
            inject(function ($filter) {
                filter = $filter('format');
            });
        });

        it('should not be null', function () {
            expect(filter).not.toEqual(null);
        });

        it('should be formatted as a number', function () {
            expect(filter(2000, 'test', {'test': 'number'})).toEqual('2,000');
            expect(filter(0, 'test', {'test': 'number'})).toEqual('0');
        });

        it('should be formatted as a percent', function () {
            expect(filter(24, 'test', {'test': 'percent'})).toEqual('24.00%');
        });

        it('should be formatted not formatted', function () {
            expect(filter('default', '', {'test': 'percent'})).toEqual('default');
        });

        it('should be formatted as a multiple percents', function () {
            expect(filter([2, 5], 'test', {'test': 'quartile'})).toEqual('2.00% 5.00%');
        });
    });
});
