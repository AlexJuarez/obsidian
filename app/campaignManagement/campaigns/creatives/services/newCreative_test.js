define(function (require) {
    'use strict';

    require('./newCreative');
    require('angularMocks');

    describe('newCreativeService', function () {
        var newCreative, scope;

        beforeEach(function () {
            module('app.campaign-management');
            inject(function (newCreativeService, $rootScope) {
                newCreative = newCreativeService;
                scope = $rootScope;
            });
        });

        it('should be an instance of sdAdapter', function () {
            expect(newCreative).not.toEqual(null);
        });


        it ('should test receive the fulfilled promise', function() {
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
            var calledUrl = '//studio.mixpo.com/studio?ad=IMG&env=multiscreen&idh=600&idw=160&sdf=new&title=El+Title&url=lego.com';
            var handler = jasmine.createSpy('success');
            newCreative(creative).then(handler);
            scope.$digest();
            expect(handler).toHaveBeenCalledWith(calledUrl);
        });

    });
});

