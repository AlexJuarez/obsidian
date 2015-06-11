/**
 * Created by alex on 4/27/15.
 */
define(function (require) {
    'use strict';

    require('./errorCount');
    require('angularMocks');

    describe('errorCountFilter', function () {
        var filter;

        beforeEach(function () {
            module('app.core');
            inject(function ($filter) {
                filter = $filter('errorCount');
            });
        });

        it('should not be null', function () {
            expect(filter).not.toEqual(null);
        });

        it('should be one for the variable', function () {
            expect(filter({password: 'test'})).toEqual(1);
        });

        it('should be two for the variable', function () {
            expect(filter({password: 'test', email: 'test'})).toEqual(2);
        });

        it('should be three for the variable', function () {
            expect(filter({password: 'test', email: 'test', name: 'error'})).toEqual(3);
        });

        it('should be 4 for the variable', function () {
            expect(filter({password: 'test', email: 'test', name: 'error', wow: 'another error'})).toEqual(4);
        });
    });
});
