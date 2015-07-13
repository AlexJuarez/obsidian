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
            expect(filter('test', {'test': -0}, {'test': 'number'})).toEqual('0');
            expect(filter('test', {'test': -9.6000}, {'test': 'number'})).toEqual('-10');
            expect(filter('test', {'test': -9600}, {'test': 'number'})).toEqual('-9,600');
            expect(filter('test', {'test': ''}, {'test': 'number'})).toEqual('0');
        });

        it('should be formatted as a percent', function () {
            expect(filter('test', {'test': 24}, {'test': 'percent'})).toEqual('24.00%');
            expect(filter('test', {'test': 245.678}, {'test': 'percent'})).toEqual('245.68%');
            expect(filter('test', {'test': -245}, {'test': 'percent'})).toEqual('-245.00%');
            expect(filter('test', {'test': 0}, {'test': 'percent'})).toEqual('0.00%');
            expect(filter('test', {'test': -0}, {'test': 'percent'})).toEqual('0.00%');
            expect(filter('test', {'test': ''}, {'test': 'percent'})).toEqual('0.00%');
        });

        it('should be formatted not formatted', function () {
            expect(filter('test', {'test': 'default'}, {'test': ''})).toEqual('default');
            expect(filter('test', {'test': ''}, {'test': ''})).toEqual('');
        });

        it('should be formatted as a multiple percents', function () {
            expect(filter('test', {'test': [2, 5]}, {'test': 'quartile'})).toEqual('2.00% 5.00%');
            expect(filter('test', {'test': [0]}, {'test': 'quartile'})).toEqual('0.00%');
            expect(filter('test', {'test': []}, {'test': 'quartile'})).toEqual('');
        });

        // input: 2015-04-01T12:00:00Z -> Longdate: April 1, 2015
        it('should be formatted as a date', function () {
            expect(filter('test', {'test': '2015-04-01T12:00:00Z'}, {'test': 'date'})).toEqual('April 1, 2015');
        });

        it('should be formatted as a link', function () {
            var input = {name:'' , route: ''};
            expect(filter('test', {'test': input}, {'test': 'link'})).toEqual('<a ui-sref=""></a>');

            input = {name:'name' , route: 'route'};
            expect(filter('test', {'test': input}, {'test': 'link'})).toEqual('<a ui-sref="route">name</a>');
        });

    });
});
