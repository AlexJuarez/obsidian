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

        it ('should return fullfiled promise for valid creative', function() {
            var creative = {
                type: 'Display',
                subtype: 'IMG',
                environment: 'multidevice',
                clickthroughUrl: '_clickthrough_',
                name: '_title_',
                embedWidth: 160,
                embedHeight: 600,
                expandedWidth: NaN,
                expandedHeight: NaN,
                campaignId: "_campaignId_"
            };
            var calledUrl = '//alpha-studio.mixpo.com/studio?ad=IMG&env=multiscreen&filter=%7B%22campaignId%22:%22_campaignId_%22%7D&idh=600&idw=160&sdf=new&title=_title_&url=_clickthrough_';
            var handler = jasmine.createSpy('success');

            newCreative(creative).then(handler);

            scope.$digest();
            expect(handler).toHaveBeenCalledWith(calledUrl);
        });

        it ('should return rejected promise for valid creative', function() {
            var invalidCreative = {};
            var handler = jasmine.createSpy('error');

            newCreative(invalidCreative).then(null, handler);

            scope.$digest();
            expect(handler).toHaveBeenCalled();
        });
    });
});

