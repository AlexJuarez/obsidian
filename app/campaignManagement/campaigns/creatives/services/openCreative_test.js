/* globals spyOn */
define(function (require) {
    'use strict';

    require('./openCreative');
    require('angularMocks');

    describe('openCreativeService spec', function () {
        var openCreative, scope, window;

        beforeEach(function () {
            module('app.campaign-management');
            // Set up the mock http service responses
            inject(function (openCreativeService, $rootScope, $window) {
                openCreative = openCreativeService;
                scope = $rootScope;
                window = $window;
            });
        });

        it('should be an instance of sdAdapter', function () {
            expect(openCreative).toBeDefined();
        });

        it('should return promise', function() {
            var fakeWindow = {};
            spyOn(window, 'open').and.returnValue(fakeWindow);

            var creative = {
                id: '_guid_',
                campaignId: '_campaignId_'
            };

            var promise = openCreative(creative);
            expect(promise).toBeDefined();
        });

        it('should decorate window with expected handler object', function() {
            var fakeWindow = {};
            spyOn(window, 'open').and.returnValue(fakeWindow);

            var creative = {
                id: '_guid_',
                campaignId: '_campaignId_'
            };

            openCreative(creative);

            expect(fakeWindow.StudioDirectHandler).toBeDefined();
        });

        it('should call expected studio url', function() {
            var fakeWindow = {};
            spyOn(window, 'open').and.returnValue(fakeWindow);

            var creative = {
                id: '_guid_',
                campaignId: '_campaignId_'
            };

            openCreative(creative);

            expect(window.open).toHaveBeenCalledWith('/studio?filter=%7B%22campaignId%22:%22_campaignId_%22%7D&guid=_guid_&sdf=open', 'mixpo_studio');
        });

        it('should call use hostname in studio url', function() {
            var fakeWindow = {};
            spyOn(window, 'open').and.returnValue(fakeWindow);

            var creative = {
                id: '_guid_',
                campaignId: '_campaignId_'
            };
            var hostname = '//alpha-studio.mixpo.com';
            openCreative(creative, hostname);

            expect(window.open).toHaveBeenCalledWith('//alpha-studio.mixpo.com/studio?filter=%7B%22campaignId%22:%22_campaignId_%22%7D&guid=_guid_&sdf=open', 'mixpo_studio');
        });
    });
});

