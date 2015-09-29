define(function (require) {
    'use strict';

    require('./studioDirectAdapter');
    require('angularMocks');

    describe('studioDirectAdapter', function () {
        var sdAdapter;

        beforeEach(function () {
            module('app.campaign-management');
            inject(function (studioDirectAdapter) {
                sdAdapter = studioDirectAdapter;
            });
        });

        it('should be an instance of sdAdapter', function () {
            expect(sdAdapter).not.toEqual(null);
        });

        it('should return expected Image adapted object', function () {
            var creative = {
                type: 'Display',
                subtype: 'IMG',
                environment: 'multidevice',
                clickthroughUrl: 'lego.com',
                name: 'El Title',
                embedWidth: 160,
                embedHeight: 600,
                expandedWidth: NaN,
                expandedHeight: NaN
            };

            var result = sdAdapter(creative);

            expect(result.sdf).toEqual('new');
            expect(result.ad).toEqual('IMG');
            expect(result.env).toEqual('multiscreen');
            expect(result.url).toEqual('lego.com');
            expect(result.title).toEqual('El Title');
            expect(result.idw).toEqual(160);
            expect(result.idh).toEqual(600);
            expect(result.tcw).toBeUndefined();
            expect(result.tch).toBeUndefined();
        });

        it('should return expected SWF adapted object', function () {
            var creative = {
                type: 'Display',
                subtype: 'SWF',
                environment: 'multidevice',
                clickthroughUrl: 'lego.com',
                name: 'El Title',
                embedWidth: 160,
                embedHeight: 600,
                expandedWidth: NaN,
                expandedHeight: NaN
            };

            var result = sdAdapter(creative);

            expect(result.sdf).toEqual('new');
            expect(result.ad).toEqual('SWF');
            expect(result.env).toEqual('multiscreen');
            expect(result.url).toEqual('lego.com');
            expect(result.title).toEqual('El Title');
            expect(result.idw).toEqual(160);
            expect(result.idh).toEqual(600);
            expect(result.tcw).toBeUndefined();
            expect(result.tch).toBeUndefined();
        });

        it('should return expected In-Stream Video adapted object', function () {
            var creative = {
                type: 'In-Stream',
                environment: 'multidevice',
                clickthroughUrl: 'lego.com',
                name: 'El Title',
                embedWidth: 160,
                embedHeight: 600,
                expandedWidth: NaN,
                expandedHeight: NaN
            };

            var result = sdAdapter(creative);

            expect(result.sdf).toEqual('new');
            expect(result.ad).toEqual('IS');
            expect(result.env).toEqual('multiscreen');
            expect(result.url).toEqual('lego.com');
            expect(result.title).toEqual('El Title');
            expect(result.idw).toBeUndefined();
            expect(result.idh).toBeUndefined();
            expect(result.tcw).toEqual(160);
            expect(result.tch).toEqual(600);
        });

        it('should return expected Interactive Display adapted object', function () {
            var creative = {
                type: 'Rich Media',
                environment: 'desktop',
                clickthroughUrl: 'lego.com',
                name: 'El Title',
                embedWidth: 160,
                embedHeight: 600,
                expandedWidth: NaN,
                expandedHeight: NaN
            };

            var result = sdAdapter(creative);

            expect(result.sdf).toEqual('new');
            expect(result.ad).toEqual('ID');
            expect(result.env).toEqual('desktop');
            expect(result.url).toEqual('lego.com');
            expect(result.title).toEqual('El Title');
            expect(result.idw).toEqual(160);
            expect(result.idh).toEqual(600);
            expect(result.tcw).toBeUndefined();
            expect(result.tch).toBeUndefined();
        });

        it('should return expected Interactive Display Rich Media adapted object', function () {
            var creative = {
                type: 'Rich Media',
                environment: 'tablet',
                clickthroughUrl: 'lego.com',
                name: 'El Title',
                embedWidth: 160,
                embedHeight: 600,
                expandedWidth: 360,
                expandedHeight: 600
            };

            var result = sdAdapter(creative);

            expect(result.sdf).toEqual('new');
            expect(result.ad).toEqual('IDRM');
            expect(result.env).toEqual('inappmraid');
            expect(result.url).toEqual('lego.com');
            expect(result.title).toEqual('El Title');
            expect(result.idw).toEqual(160);
            expect(result.idh).toEqual(600);
            expect(result.tcw).toEqual(360);
            expect(result.tch).toEqual(600);
        });

        it('should return expected Interactive Display MLQ adapted object', function () {
            var creative = {
                type: 'In-Banner',
                environment: 'mobile',
                clickthroughUrl: 'lego.com',
                name: 'El Title',
                embedWidth: 160,
                embedHeight: 600,
                expandedWidth: 360,
                expandedHeight: 600
            };

            var result = sdAdapter(creative);

            expect(result.sdf).toEqual('new');
            expect(result.ad).toEqual('IDMLQ');
            expect(result.env).toEqual('tabletphone');
            expect(result.url).toEqual('lego.com');
            expect(result.title).toEqual('El Title');
            expect(result.idw).toEqual(160);
            expect(result.idh).toEqual(600);
            expect(result.tcw).toEqual(360);
            expect(result.tch).toEqual(600);
        });

        it('should return expected MLQ adapted object', function () {
            var creative = {
                type: 'In-Banner',
                environment: 'multidevice',
                clickthroughUrl: 'lego.com',
                name: 'El Title',
                embedWidth: 160,
                embedHeight: 600,
                expandedWidth: NaN,
                expandedHeight: NaN
            };

            var result = sdAdapter(creative);

            expect(result.sdf).toEqual('new');
            expect(result.ad).toEqual('MLQ');
            expect(result.env).toEqual('multiscreen');
            expect(result.url).toEqual('lego.com');
            expect(result.title).toEqual('El Title');
            expect(result.idw).toBeUndefined();
            expect(result.idh).toBeUndefined();
            expect(result.tcw).toEqual(160);
            expect(result.tch).toEqual(600);
        });

        it('should return null when called with null', function () {
            var result = sdAdapter();

            expect(result).toEqual(null);
        });

        it('should return null if unknown \'type\'', function () {
            var creative = {
                type: 'foo',
                environment: 'multidevice',
                clickthroughUrl: 'lego.com',
                name: 'El Title',
                embedWidth: 160,
                embedHeight: 600,
                expandedWidth: NaN,
                expandedHeight: NaN
            };

            var result = sdAdapter(creative);

            expect(result).toEqual(null);
        });

        it('should return null if unknown \'environment\'', function () {
            var creative = {
                type: 'IBV',
                environment: 'foo',
                clickthroughUrl: 'lego.com',
                name: 'El Title',
                embedWidth: 160,
                embedHeight: 600,
                expandedWidth: NaN,
                expandedHeight: NaN
            };

            var result = sdAdapter(creative);

            expect(result).toEqual(null);
        });

        it('should return null if unknown \'clickthroughUrl\'', function () {
            var creative = {
                type: 'IBV',
                environment: 'foo',
                name: 'El Title',
                embedWidth: 160,
                embedHeight: 600,
                expandedWidth: NaN,
                expandedHeight: NaN
            };

            var result = sdAdapter(creative);

            expect(result).toEqual(null);
        });

        it('should return null if unknown \'name\'', function () {
            var creative = {
                type: 'IBV',
                environment: 'foo',
                clickthroughUrl: 'lego.com',
                embedWidth: 160,
                embedHeight: 600,
                expandedWidth: NaN,
                expandedHeight: NaN
            };

            var result = sdAdapter(creative);

            expect(result).toEqual(null);
        });
    });
});

