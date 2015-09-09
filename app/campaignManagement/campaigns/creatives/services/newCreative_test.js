define(function (require) {
    'use strict';

    require('./newCreative');
    require('angularMocks');

    describe('newCreativeService', function () {
        var newCreative;

        beforeEach(function () {
            module('app.campaign-management');
            inject(function (newCreativeService) {
                newCreative = newCreativeService;
            });
        });

        it('should be an instance of sdAdapter', function () {
            expect(newCreative).not.toEqual(null);
        });

        /**
        it ('should test receive the fulfilled promise', function(done) {
            var creative = {
                type: 'IMG',
                environment: 'multi-screen',
                clickthroughUrl: 'lego.com',
                name: 'El Title',
                embedWidth: 160,
                embedHeight: 600,
                expandedWidth: NaN,
                expandedHeight: NaN
            };

            newCreative(creative).then(function(returnFromPromise) {
                expect(returnFromPromise).toBe('somevalue');
                done();
            });
        });
         */
    });
});

