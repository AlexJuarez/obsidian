/**
 * Created by alex on 4/27/15.
 */
define(function (require) {
    'use strict';

    require('./safe');
    require('angularMocks');

    describe('safeFilter', function () {
        var filter;

        beforeEach(function () {
            module('app.core');
            inject(function ($filter) {
                filter = $filter('safe');
            });
        });

        it('should not be null', function () {
            expect(filter).not.toEqual(null);
        });

        it('should be safe for the variable', function () {
            expect(filter('x').$$unwrapTrustedValue()).toEqual('x');
        });
    });
});
