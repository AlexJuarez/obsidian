define(function (require) {
    'use strict';

    require('./index');

    describe('urlBuilder spec', function () {
        var instance;

        beforeEach(function () {
            module('app.campaign-management');
            inject(function (studioUrlBuilder) {
                instance = studioUrlBuilder;
            });
        });

        it('should be an instance of studioDirectUrl', function () {
            expect(instance).toBeDefined();
        });

        it('should have create method', function () {
            expect(instance.create).toBeDefined();
        });

        it('should have open method', function () {
            expect(instance.open).toBeDefined();
        });

        it('should have copy method', function () {
            expect(instance.copy).toBeDefined();
        });

        it('should have mediaselect method', function () {
            expect(instance.mediaselect).toBeDefined();
        });
    });
});

