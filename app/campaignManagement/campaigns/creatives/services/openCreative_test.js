/* globals spyOn */
define(function (require) {
    'use strict';

    require('./openCreative');
    require('angularMocks');

    describe('openCreativeService spec', function () {
        var openCreative, aStudioUrlBuilder, aStudioWindow, fakeWindow, fakeOpenBuilder, fakeOpenUrl;

        beforeEach(function () {
            module('app.campaign-management');

            inject(function (openCreativeService, studioUrlBuilder, studioWindow) {
                openCreative = openCreativeService;

                aStudioUrlBuilder = studioUrlBuilder;

                fakeOpenUrl = '';
                fakeOpenBuilder = {
                    setHostname: function(){},
                    build: function(){}
                };
                spyOn(fakeOpenBuilder, 'setHostname').and.returnValue(fakeOpenBuilder);
                spyOn(fakeOpenBuilder, 'build').and.returnValue(fakeOpenUrl);
                spyOn(aStudioUrlBuilder, 'open').and.returnValue(fakeOpenBuilder);

                aStudioWindow = studioWindow;
                fakeWindow = {};
                spyOn(aStudioWindow, 'open').and.returnValue(fakeWindow);

            });
        });

        it('should be injectable via openCreativeService', function () {
            expect(openCreative).toBeDefined();
        });


        it('should return promise', function() {
            var creative = {
                id: '_guid_',
                campaignId: '_campaignId_'
            };

            var promise = openCreative(creative);
            expect(promise).toBeDefined();
        });

        it('should build a url using provided creative\'s id', function() {
            var creative = {
                id: '_guid_',
                campaignId: '_campaignId_'
            };

            openCreative(creative);

            expect(aStudioUrlBuilder.open.calls.mostRecent().args[0]).toEqual('_guid_');
        });

        it('should build a url using provided creative\'s campaignId', function() {
            var creative = {
                id: '_guid_',
                campaignId: '_campaignId_'
            };

            openCreative(creative);

            expect(aStudioUrlBuilder.open.calls.mostRecent().args[1]).toEqual('_campaignId_');
        });

        it('should build a url providing the set hostname', function() {
            var creative = {
                id: '_guid_',
                campaignId: '_campaignId_'
            };
            var hostname = '//alpha-studio.mixpo.com';

            openCreative(creative, hostname);

            expect(fakeOpenBuilder.setHostname).toHaveBeenCalledWith(hostname);
        });

        it('should build a url that open studio', function() {
            var creative = {
                id: '_guid_',
                campaignId: '_campaignId_'
            };

            openCreative(creative);

            expect(fakeOpenBuilder.build).toHaveBeenCalled();
        });

        it('should open a studioWindow', function() {
            var creative = {
                id: '_guid_',
                campaignId: '_campaignId_'
            };

            openCreative(creative);

            expect(aStudioWindow.open).toHaveBeenCalled();
        });
    });
});

