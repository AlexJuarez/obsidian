/**
 * Created by alex on 4/27/15.
 */
define(function (require) {
    'use strict';

    require('./interpolate');
    require('angularMocks');

    describe('interpolateFilter', function () {
        var filter, scope;

        beforeEach(function () {
            module('app.core');
            inject(function ($filter, $rootScope) {
                filter = $filter('interpolate');
                scope = $rootScope.$new();
            });
        });

        it('should not be null', function () {
            expect(filter).not.toEqual(null);
        });

        it('should be interpolated for the variable', function () {
            scope.x = 1;
            expect(filter('{{x}}', scope)).toEqual('1');
        });
    });
});
