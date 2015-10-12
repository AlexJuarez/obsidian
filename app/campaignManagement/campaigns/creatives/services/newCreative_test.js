define(function (require) {
    'use strict';

    require('./newCreative');
    require('angularMocks');

    describe('newCreative spec', function () {
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

            //var calledUrl = '//alpha-studio.mixpo.com/studio?ad=IMG&env=multiscreen&filter=%7B%22campaignId%22:%22_campaignId_%22%7D&idh=600&idw=160&sdf=new&title=_title_&url=_clickthrough_';
            var handler = jasmine.createSpy('success');

            newCreative(creative).then(handler);

            scope.$digest();
            //expect(handler).toHaveBeenCalledWith(calledUrl);
            expect(handler).toHaveBeenCalled();
        });

        it('should return rejected promise for valid creative', function() {
            var invalidCreative = {};
            var handler = jasmine.createSpy('error');

            newCreative(invalidCreative).then(null, handler);

            scope.$digest();
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

            /**
             expect(result.sdf).toEqual('new');
             expect(result.ad).toEqual('IMG');
             expect(result.env).toEqual('multiscreen');
             expect(result.url).toEqual('lego.com');
             expect(result.title).toEqual('El Title');
             expect(result.idw).toEqual(160);
             expect(result.idh).toEqual(600);
             expect(result.tcw).toBeUndefined();
             expect(result.tch).toBeUndefined();
             */
            //var calledUrl = '//alpha-studio.mixpo.com/studio?ad=IMG&env=multiscreen&filter=%7B%22campaignId%22:%22_campaignId_%22%7D&idh=600&idw=160&sdf=new&title=El+Title&url=lego.com';
            var handler = jasmine.createSpy('success');

            newCreative(creative).then(handler);

            scope.$digest();
            //expect(handler).toHaveBeenCalledWith(calledUrl);
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

            /**
             expect(result.sdf).toEqual('new');
             expect(result.ad).toEqual('SWF');
             expect(result.env).toEqual('multiscreen');
             expect(result.url).toEqual('lego.com');
             expect(result.title).toEqual('El Title');
             expect(result.idw).toEqual(160);
             expect(result.idh).toEqual(600);
             expect(result.tcw).toBeUndefined();
             expect(result.tch).toBeUndefined();
             */
            //var calledUrl = '//alpha-studio.mixpo.com/studio?ad=SWF&env=multiscreen&filter=%7B%22campaignId%22:%22_campaignId_%22%7D&idh=600&idw=160&sdf=new&title=El+Title&url=lego.com';
            var handler = jasmine.createSpy('success');

            newCreative(creative).then(handler);

            scope.$digest();
            //expect(handler).toHaveBeenCalledWith(calledUrl);
            expect(handler).toHaveBeenCalled();
        });

        it('should return fullfiled promise for In-Stream Video creative', function() {
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

            /**
             expect(result.sdf).toEqual('new');
             expect(result.ad).toEqual('IS');
             expect(result.env).toEqual('multiscreen');
             expect(result.url).toEqual('lego.com');
             expect(result.title).toEqual('El Title');
             expect(result.idw).toBeUndefined();
             expect(result.idh).toBeUndefined();
             expect(result.tcw).toEqual(160);
             expect(result.tch).toEqual(600);
             */
            var calledUrl = '//alpha-studio.mixpo.com/studio?ad=IS&env=multiscreen&filter=%7B%22campaignId%22:%22_campaignId_%22%7D&sdf=new&tch=600&tcw=160&title=El+Title&url=lego.com';
            var handler = jasmine.createSpy('success');

            newCreative(creative).then(handler);

            scope.$digest();
            expect(handler).toHaveBeenCalledWith(calledUrl);
        });

        it('should return fullfiled promise for Interactive Display creative', function() {
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

            /**
             expect(result.sdf).toEqual('new');
             expect(result.ad).toEqual('ID');
             expect(result.env).toEqual('desktop');
             expect(result.url).toEqual('lego.com');
             expect(result.title).toEqual('El Title');
             expect(result.idw).toEqual(160);
             expect(result.idh).toEqual(600);
             expect(result.tcw).toBeUndefined();
             expect(result.tch).toBeUndefined();
             */
            var calledUrl = '//alpha-studio.mixpo.com/studio?ad=ID&env=desktop&filter=%7B%22campaignId%22:%22_campaignId_%22%7D&idh=600&idw=160&sdf=new&title=El+Title&url=lego.com';
            var handler = jasmine.createSpy('success');

            newCreative(creative).then(handler);

            scope.$digest();
            expect(handler).toHaveBeenCalledWith(calledUrl);
        });

        it('should return fullfiled promise for Interactive Display Rich Media creative', function() {
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

            /**
             expect(result.sdf).toEqual('new');
             expect(result.ad).toEqual('IDRM');
             expect(result.env).toEqual('inappmraid');
             expect(result.url).toEqual('lego.com');
             expect(result.title).toEqual('El Title');
             expect(result.idw).toEqual(160);
             expect(result.idh).toEqual(600);
             expect(result.tcw).toEqual(360);
             expect(result.tch).toEqual(600);
             */
            var calledUrl = '//alpha-studio.mixpo.com/studio?ad=IDRM&env=inappmraid&filter=%7B%22campaignId%22:%22_campaignId_%22%7D&idh=600&idw=160&sdf=new&tch=600&tcw=360&title=El+Title&url=lego.com';
            var handler = jasmine.createSpy('success');

            newCreative(creative).then(handler);

            scope.$digest();
            expect(handler).toHaveBeenCalledWith(calledUrl);
        });

        it('should return fullfiled promise for Interactive Display MLQ creative', function() {
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

            /**
             expect(result.sdf).toEqual('new');
             expect(result.ad).toEqual('IDMLQ');
             expect(result.env).toEqual('tabletphone');
             expect(result.url).toEqual('lego.com');
             expect(result.title).toEqual('El Title');
             expect(result.idw).toEqual(160);
             expect(result.idh).toEqual(600);
             expect(result.tcw).toEqual(360);
             expect(result.tch).toEqual(600);
             */
            var calledUrl = '//alpha-studio.mixpo.com/studio?ad=IDMLQ&env=tabletphone&filter=%7B%22campaignId%22:%22_campaignId_%22%7D&idh=600&idw=160&sdf=new&tch=600&tcw=360&title=El+Title&url=lego.com';
            var handler = jasmine.createSpy('success');

            newCreative(creative).then(handler);

            scope.$digest();
            expect(handler).toHaveBeenCalledWith(calledUrl);
        });

        it('should return fullfiled promise for MLQ creative', function() {
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

            /**
             expect(result.sdf).toEqual('new');
             expect(result.ad).toEqual('MLQ');
             expect(result.env).toEqual('multiscreen');
             expect(result.url).toEqual('lego.com');
             expect(result.title).toEqual('El Title');
             expect(result.idw).toBeUndefined();
             expect(result.idh).toBeUndefined();
             expect(result.tcw).toEqual(160);
             expect(result.tch).toEqual(600);
             */
            var calledUrl = '//alpha-studio.mixpo.com/studio?ad=MLQ&env=multiscreen&filter=%7B%22campaignId%22:%22_campaignId_%22%7D&sdf=new&tch=600&tcw=160&title=El+Title&url=lego.com';
            var handler = jasmine.createSpy('success');

            newCreative(creative).then(handler);

            scope.$digest();
            expect(handler).toHaveBeenCalledWith(calledUrl);
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

