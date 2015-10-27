/* globals spyOn, fail */
define(function (require) {
    'use strict';

    require('./newCreative');
    require('angularMocks');

    describe('newCreativeService spec', function () {
        var newCreative, scope, window, httpBackend;

        beforeEach(function () {
            module('app.campaign-management');
            // Set up the mock http service responses
            inject(function (newCreativeService, $rootScope, studioWindow, $httpBackend) {
                newCreative = newCreativeService;
                scope = $rootScope;
                window = studioWindow;
                httpBackend = $httpBackend;
            });
        });

        afterEach(function() {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        // Ignore two methods used in parameterized tests
        /* jshint ignore:start */
        function getAdTypes() {
            return [
                'IMG',
                'SWF',
                'IS',
                'MLQ',
                'ID',
                'IDRM',
                'IDMLQ'
            ];
        }

        function getAdEnvironment() {
            return [
                'multiscreen',
                'tabletphone',
                'inappmraid',
                'desktop'
            ];
        }
        /* jshint ignore:end */

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
                expandedWidth: null,
                expandedHeight: null,
                campaignId: '_campaignId_'
            };
            var mediaItem = {
                id: '_uuid_'
            };
            var handler = jasmine.createSpy('success');

            newCreative(creative, mediaItem).then(handler, fail);

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
                expandedWidth: null,
                expandedHeight: null,
                campaignId: '_campaignId_'
            };
            var mediaItem = {
                id: '_uuid_'
            };
            var handler = jasmine.createSpy('success');

            newCreative(creative, mediaItem).then(handler, fail);

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
                expandedWidth: null,
                expandedHeight: null,
                campaignId: '_campaignId_'
            };
            var mediaItem = {
                id: '_swf_uuid_'
            };
            var handler = jasmine.createSpy('success');

            newCreative(creative, mediaItem).then(handler, fail);

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
                campaignId: '_campaignId_',
                clickthroughUrl: 'lego.com',
                embedHeight: 600,
                embedWidth: 160,
                environment: 'multidevice',
                expandedHeight: null,
                expandedWidth: null,
                name: 'El Title',
                subtype: undefined,
                type: 'In-Stream'
            };
            var mediaItem = null;
            var calledUrl = '//alpha-studio.mixpo.com/studio?ad=IS&env=multiscreen&filter=%7B%22campaignId%22:%22_campaignId_%22%7D&sdf=new&tch=600&tcw=160&title=El+Title&url=lego.com';
            var handler = jasmine.createSpy('success');

            newCreative(creative, mediaItem).then(handler, fail);

            scope.$digest();
            expect(window.open).toHaveBeenCalledWith(calledUrl, 'mixpo_studio');
            expect(handler).toHaveBeenCalled();
        });


        it('should return fullfiled promise for Interactive Display creative', function() {
            var fakeWindow = {};
            spyOn(window, 'open').and.returnValue(fakeWindow);

            var creative = {
                campaignId: '_campaignId_',
                clickthroughUrl: 'lego.com',
                embedHeight: 600,
                embedWidth: 160,
                environment: 'desktop',
                expandMode: null,
                expandedHeight: null,
                expandedWidth: null,
                name: 'El Title',
                subtype: undefined,
                type: 'Rich Media'
            };

            var calledUrl = '//alpha-studio.mixpo.com/studio?ad=ID&env=desktop&filter=%7B%22campaignId%22:%22_campaignId_%22%7D&idh=600&idw=160&sdf=new&title=El+Title&url=lego.com';
            var handler = jasmine.createSpy('success');

            newCreative(creative).then(handler, fail);

            scope.$digest();
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

            newCreative(creative).then(handler, fail);

            scope.$digest();
            expect(window.open).toHaveBeenCalledWith(calledUrl, 'mixpo_studio');
            expect(handler).toHaveBeenCalled();
        });

        it('should return fullfiled promise for IDMLQ (Interactive Display MLQ) creative', function() {
            var fakeWindow = {};
            spyOn(window, 'open').and.returnValue(fakeWindow);

            var creative = {
                campaignId: '_campaignId_',
                clickthroughUrl: 'lego.com',
                embedHeight: 600,
                embedWidth: 160,
                environment: 'tablet',
                expandMode: null,
                expandedHeight: 600,
                expandedWidth: 360,
                name: 'El Title',
                type: 'In-Banner'
            };

            var calledUrl = '//alpha-studio.mixpo.com/studio?ad=IDMLQ&env=tabletphone&filter=%7B%22campaignId%22:%22_campaignId_%22%7D&idh=600&idw=160&sdf=new&tch=600&tcw=360&title=El+Title&url=lego.com';
            var handler = jasmine.createSpy('success');

            newCreative(creative).then(handler, fail);

            scope.$digest();
            expect(window.open).toHaveBeenCalledWith(calledUrl, 'mixpo_studio');
            expect(handler).toHaveBeenCalled();
        });

        it('should return fullfiled promise for MLQ creative', function() {
            var fakeWindow = {};
            spyOn(window, 'open').and.returnValue(fakeWindow);

            var creative = {
                campaignId: '_campaignId_',
                clickthroughUrl: 'lego.com',
                embedHeight: 600,
                embedWidth: 160,
                environment: 'multidevice',
                expandMode: null,
                expandedHeight: null,
                expandedWidth: null,
                name: 'El Title',
                type: 'In-Banner'
            };

            var calledUrl = '//alpha-studio.mixpo.com/studio?ad=MLQ&env=multiscreen&filter=%7B%22campaignId%22:%22_campaignId_%22%7D&sdf=new&tch=600&tcw=160&title=El+Title&url=lego.com';
            var handler = jasmine.createSpy('success');

            newCreative(creative).then(handler, fail);

            scope.$digest();
            expect(window.open).toHaveBeenCalledWith(calledUrl, 'mixpo_studio');
            expect(handler).toHaveBeenCalled();
        });

        it ('should return fullfiled promise for a customStartFrame MLQ creative', function() {
            var fakeWindow = {};
            spyOn(window, 'open').and.returnValue(fakeWindow);

            var creative = {
                campaignId: '_campaignId_',
                clickthroughUrl: 'lego.com',
                customStartFrame: true,
                embedHeight: 600,
                embedWidth: 160,
                environment: 'multidevice',
                expandMode: null,
                expandedHeight: null,
                expandedWidth: null,
                name: 'El Title',
                subtype: undefined,
                type: 'In-Banner'
            };

            // add customStartFrame output
            var calledUrl = '//alpha-studio.mixpo.com/studio?ad=MLQ&env=multiscreen&filter=%7B%22campaignId%22:%22_campaignId_%22,%22customStartFrame%22:true%7D&idh=600&idw=160&sdf=new&tch=600&tcw=160&title=El+Title&url=lego.com';
            var handler = jasmine.createSpy('success');

            newCreative(creative).then(handler, fail);

            scope.$digest();
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
                expandedWidth: null,
                expandedHeight: null,
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
                expandedWidth: null,
                expandedHeight: null,
                campaignId: '_campaignId_'
            };

            var message = 'invalid environment';
            var handler = jasmine.createSpy('error');

            newCreative(invalidCreative).then(null, handler);

            scope.$digest();
            expect(handler).toHaveBeenCalledWith(message);
        });

        /* jshint ignore:start */
        it ('should return \'clickthough url is required\' error if unknown \'clickthroughUrl\'', function() {
            function getInvalidCreative() {
                return {
                    type: 'parameterized',
                    environment: 'multidevice',
                    name: 'El Title',
                    embedWidth: 160,
                    embedHeight: 600,
                    expandedWidth: null,
                    expandedHeight: null,
                    campaignId: '_campaignId_'
                };
            }

            // Iterates over all Ad Types
            for (var index in getAdTypes()) {
                (function(type) {
                    it('for type: \'' + type + '\'', function() {
                        var handler = jasmine.createSpy('error');
                        var invalidCreative = getInvalidCreative();
                        invalidCreative.type = type;

                        newCreative(invalidCreative).then(null, handler);

                        scope.$digest();
                        expect(handler).toHaveBeenCalledWith('clickthough url is required');
                    });
                })(getAdTypes()[index]);
            }
        });
        /* jshint ignore:end */

        /* jshint ignore:start */
        it ('should return \'name is required\' error if unknown \'name\'', function() {

            function getInvalidCreative() {
                return {
                    type: 'parameterized',
                    environment: 'multidevice',
                    clickthroughUrl: 'lego.com',
                    embedWidth: 160,
                    embedHeight: 600,
                    expandedWidth: null,
                    expandedHeight: null,
                    campaignId: '_campaignId_'
                };
            }

            // Iterates over all Ad Types
            for (var index in getAdTypes()) {
                (function(type) {
                    it('for type: \'' + type + '\'', function() {
                        var handler = jasmine.createSpy('error');
                        var invalidCreative = getInvalidCreative();
                        invalidCreative.type = type;

                        newCreative(invalidCreative).then(null, handler);

                        scope.$digest();
                        expect(handler).toHaveBeenCalledWith('name is required');
                    });
                })(getAdTypes()[index]);
            }
        });
        /* jshint ignore:end */
    });
});

