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

        it('case number', function () {
            expect(filter(2000, 'test', {'test': 'number'})).toEqual('2,000');
        });

        it('case percent', function () {
            expect(filter(24, 'test', {'test': 'percent'})).toEqual('24.00%');
        });

        it('case default', function () {
            expect(filter('default', '', {'test': 'percent'})).toEqual('default');
        });

        it('case quartile', function () {
            expect(filter([2, 5], 'test', {'test': 'quartile'})).toEqual('2.00% 5.00%');
        });

        it('case no input', function () {
            expect(filter(0, 'test', {'test': 'number'})).toEqual('0');
        });
    });
});
