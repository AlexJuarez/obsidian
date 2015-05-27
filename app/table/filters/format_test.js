/**
 * Created by alex on 4/27/15.
 */
define(function (require) {
    'use strict';

    require('./format');
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
            expect(filter('test', {'test': 2000}, {'test': 'number'})).toEqual('2,000');
            expect(filter('test', {'test': 0}, {'test': 'number'})).toEqual('0');
        });

        it('should be formatted as a percent', function () {
            expect(filter('test', {'test': 24}, {'test': 'percent'})).toEqual('24.00%');
        });

        it('should be formatted not formatted', function () {
            expect(filter('test', {'test': 'default'}, {'test': ''})).toEqual('default');
        });

        it('should be formatted as a multiple percents', function () {
            expect(filter('test', {'test': [2, 5]}, {'test': 'quartile'})).toEqual('2.00% 5.00%');
        });
    });
});
