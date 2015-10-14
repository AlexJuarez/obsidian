/* globals spyOn */
define(function (require) {
    'use strict';

    require('./newCreative');
    require('angularMocks');

    describe('newCreative spec', function () {
        var newCreative, scope, window, httpBackend;

        beforeEach(function () {
            module('app.campaign-management');
            // Set up the mock http service responses
            inject(function (newCreativeService, $rootScope, $window, $httpBackend) {
                newCreative = newCreativeService;
                scope = $rootScope;
                window = $window;
                httpBackend = $httpBackend;
            });
        });

        afterEach(function() {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of sdAdapter', function () {
            expect(newCreative).not.toEqual(null);
        });

        it('should return fullfiled promise for valid creative', function() {
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
                campaignId: '_campaignId_'
            };
            var mediaItem = {
                id: '_uuid_'
            };
            var handler = jasmine.createSpy('success');

            newCreative(creative, mediaItem).then(handler);

            httpBackend.expectPOST('//alpha-studio.mixpo.com/manager/dafrommedia',
                '{"mediaguid":"_uuid_","title":"_title_","clickThrough":"_clickthrough_","deviceTargets":"multiscreen","adServer":""}')
                .respond(200, '');
            httpBackend.flush();
            expect(handler).toHaveBeenCalled();
        });

        it('should return fullfiled promise for Image creative', function() {
            var creative = {
                type: 'Display',
                subtype: 'IMG',
                environment: 'multidevice',
                clickthroughUrl: 'lego.com',
                name: 'El Title',
                embedWidth: 160,
                embedHeight: 600,
                expandedWidth: NaN,
                expandedHeight: NaN,
                campaignId: '_campaignId_'
            };
            var mediaItem = {
                id: '_uuid_'
            };
            var handler = jasmine.createSpy('success');

            newCreative(creative, mediaItem).then(handler);

            httpBackend.expectPOST('//alpha-studio.mixpo.com/manager/dafrommedia',
                '{"mediaguid":"_uuid_","title":"El Title","clickThrough":"lego.com","deviceTargets":"multiscreen","adServer":""}')
                .respond(200, '');
            httpBackend.flush();
            expect(handler).toHaveBeenCalled();
        });

        it('should return fullfiled promise for SWF creative', function() {
            var creative = {
                type: 'Display',
                subtype: 'SWF',
                environment: 'multidevice',
                clickthroughUrl: 'lego.com',
                name: 'El Title',
                embedWidth: 160,
                embedHeight: 600,
                expandedWidth: NaN,
                expandedHeight: NaN,
                campaignId: '_campaignId_'
            };
            var mediaItem = {
                id: '_swf_uuid_'
            };
            var handler = jasmine.createSpy('success');

            newCreative(creative, mediaItem).then(handler);

            httpBackend.expectPOST('//alpha-studio.mixpo.com/manager/dafrommedia',
                '{"mediaguid":"_swf_uuid_","title":"El Title","clickThrough":"lego.com","deviceTargets":"multiscreen","adServer":""}')
                .respond(200, '');
            httpBackend.flush();
            expect(handler).toHaveBeenCalled();
        });

        it('should return fullfiled promise for In-Stream Video creative', function() {
            var fakeWindow = {};
            spyOn(window, 'open').and.returnValue(fakeWindow);

            var creative = {
                type: 'In-Stream',
                environment: 'multidevice',
                clickthroughUrl: 'lego.com',
                name: 'El Title',
                embedWidth: 160,
                embedHeight: 600,
                expandedWidth: NaN,
                expandedHeight: NaN,
                campaignId: '_campaignId_'
            };
            var mediaItem = null;
            var calledUrl = '//alpha-studio.mixpo.com/studio?ad=IS&env=multiscreen&filter=%7B%22campaignId%22:%22_campaignId_%22%7D&sdf=new&tch=600&tcw=160&title=El+Title&url=lego.com';
            var handler = jasmine.createSpy('success');

            newCreative(creative, mediaItem).then(handler);

            scope.$digest();
            expect(fakeWindow.StudioDirectHandler).toBeDefined();
            expect(window.open).toHaveBeenCalledWith(calledUrl, 'mixpo_studio');
            expect(handler).toHaveBeenCalled();
        });


        it('should return fullfiled promise for Interactive Display creative', function() {
            var fakeWindow = {};
            spyOn(window, 'open').and.returnValue(fakeWindow);

            var creative = {
                type: 'Rich Media',
                environment: 'desktop',
                clickthroughUrl: 'lego.com',
                name: 'El Title',
                embedWidth: 160,
                embedHeight: 600,
                expandedWidth: NaN,
                expandedHeight: NaN,
                campaignId: '_campaignId_'
            };

            var calledUrl = '//alpha-studio.mixpo.com/studio?ad=ID&env=desktop&filter=%7B%22campaignId%22:%22_campaignId_%22%7D&idh=600&idw=160&sdf=new&title=El+Title&url=lego.com';
            var handler = jasmine.createSpy('success');

            newCreative(creative).then(handler);

            scope.$digest();
            expect(fakeWindow.StudioDirectHandler).toBeDefined();
            expect(window.open).toHaveBeenCalledWith(calledUrl, 'mixpo_studio');
            expect(handler).toHaveBeenCalled();
        });

        it('should return fullfiled promise for Interactive Display Rich Media creative', function() {
            var fakeWindow = {};
            spyOn(window, 'open').and.returnValue(fakeWindow);

            var creative = {
                type: 'Rich Media',
                environment: 'mobile',
                clickthroughUrl: 'lego.com',
                name: 'El Title',
                embedWidth: 160,
                embedHeight: 600,
                expandedWidth: 360,
                expandedHeight: 600,
                campaignId: '_campaignId_'
            };

            var calledUrl = '//alpha-studio.mixpo.com/studio?ad=IDRM&env=inappmraid&filter=%7B%22campaignId%22:%22_campaignId_%22%7D&idh=600&idw=160&sdf=new&tch=600&tcw=360&title=El+Title&url=lego.com';
            var handler = jasmine.createSpy('success');

            newCreative(creative).then(handler);

            scope.$digest();
            expect(fakeWindow.StudioDirectHandler).toBeDefined();
            expect(window.open).toHaveBeenCalledWith(calledUrl, 'mixpo_studio');
            expect(handler).toHaveBeenCalled();
        });

        it('should return fullfiled promise for Interactive Display MLQ creative', function() {
            var fakeWindow = {};
            spyOn(window, 'open').and.returnValue(fakeWindow);

            var creative = {
                type: 'In-Banner',
                environment: 'tablet',
                clickthroughUrl: 'lego.com',
                name: 'El Title',
                embedWidth: 160,
                embedHeight: 600,
                expandedWidth: 360,
                expandedHeight: 600,
                campaignId: '_campaignId_'
            };

            var calledUrl = '//alpha-studio.mixpo.com/studio?ad=IDMLQ&env=tabletphone&filter=%7B%22campaignId%22:%22_campaignId_%22%7D&idh=600&idw=160&sdf=new&tch=600&tcw=360&title=El+Title&url=lego.com';
            var handler = jasmine.createSpy('success');

            newCreative(creative).then(handler);

            scope.$digest();
            expect(fakeWindow.StudioDirectHandler).toBeDefined();
            expect(window.open).toHaveBeenCalledWith(calledUrl, 'mixpo_studio');
            expect(handler).toHaveBeenCalled();
        });

        it('should return fullfiled promise for MLQ creative', function() {
            var fakeWindow = {};
            spyOn(window, 'open').and.returnValue(fakeWindow);

            var creative = {
                type: 'In-Banner',
                environment: 'multidevice',
                clickthroughUrl: 'lego.com',
                name: 'El Title',
                embedWidth: 160,
                embedHeight: 600,
                expandedWidth: NaN,
                expandedHeight: NaN,
                campaignId: '_campaignId_'
            };

            var calledUrl = '//alpha-studio.mixpo.com/studio?ad=MLQ&env=multiscreen&filter=%7B%22campaignId%22:%22_campaignId_%22%7D&sdf=new&tch=600&tcw=160&title=El+Title&url=lego.com';
            var handler = jasmine.createSpy('success');

            newCreative(creative).then(handler);

            scope.$digest();
            expect(fakeWindow.StudioDirectHandler).toBeDefined();
            expect(window.open).toHaveBeenCalledWith(calledUrl, 'mixpo_studio');
            expect(handler).toHaveBeenCalled();
        });

        it('should return rejected promise for valid creative', function() {
            var invalidCreative = {};
            var handler = jasmine.createSpy('error');

            newCreative(invalidCreative).then(null, handler);

            scope.$digest();
            expect(handler).toHaveBeenCalled();
        });

        it ('should return \'creative is required\' error if null creative', function() {
            var invalidCreative = null;

            var message = 'creative is required';
            var handler = jasmine.createSpy('error');

            newCreative(invalidCreative).then(null, handler);

            scope.$digest();
            expect(handler).toHaveBeenCalledWith(message);
        });

        it ('should return \'invalid adType\' error if unknown \'type\'', function() {
            var invalidCreative = {
                type: 'foo',
                environment: 'multidevice',
                clickthroughUrl: 'lego.com',
                name: 'El Title',
                embedWidth: 160,
                embedHeight: 600,
                expandedWidth: NaN,
                expandedHeight: NaN,
                campaignId: '_campaignId_'
            };

            var message = 'invalid adType';
            var handler = jasmine.createSpy('error');

            newCreative(invalidCreative).then(null, handler);

            scope.$digest();
            expect(handler).toHaveBeenCalledWith(message);
        });

        it ('should return \'invalid environment\' error if unknown \'environment\'', function() {
            var invalidCreative = {
                type: 'In-Banner',
                environment: 'foo',
                clickthroughUrl: 'lego.com',
                name: 'El Title',
                embedWidth: 160,
                embedHeight: 600,
                expandedWidth: NaN,
                expandedHeight: NaN,
                campaignId: '_campaignId_'
            };

            var message = 'invalid environment';
            var handler = jasmine.createSpy('error');

            newCreative(invalidCreative).then(null, handler);

            scope.$digest();
            expect(handler).toHaveBeenCalledWith(message);
        });

        it ('should return \'clickthough url is required\' error if unknown \'clickthroughUrl\'', function() {
            var invalidCreative = {
                type: 'In-Banner',
                environment: 'multidevice',
                name: 'El Title',
                embedWidth: 160,
                embedHeight: 600,
                expandedWidth: NaN,
                expandedHeight: NaN,
                campaignId: '_campaignId_'
            };

            var message = 'clickthough url is required';
            var handler = jasmine.createSpy('error');

            newCreative(invalidCreative).then(null, handler);

            scope.$digest();
            expect(handler).toHaveBeenCalledWith(message);
        });

        it ('should return \'name is required\' error if unknown \'name\'', function() {
            var invalidCreative = {
                type: 'In-Banner',
                environment: 'multidevice',
                clickthroughUrl: 'lego.com',
                embedWidth: 160,
                embedHeight: 600,
                expandedWidth: NaN,
                expandedHeight: NaN,
                campaignId: '_campaignId_'
            };

            var message = 'name is required';
            var handler = jasmine.createSpy('error');

            newCreative(invalidCreative).then(null, handler);

            scope.$digest();
            expect(handler).toHaveBeenCalledWith(message);
        });
    });
});

