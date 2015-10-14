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

        describe('create spec', function () {
            it('should return expected uri', function () {
                var result = instance.create('aType', 'aEnv', 'aTitle', 'aClickthroughUrl', 'aCampaignId')
                    .build();

                expect(result).toEqual('/studio?ad=aType&env=aEnv&filter=%7B%22campaignId%22:%22aCampaignId%22%7D&sdf=new&title=aTitle&url=aClickthroughUrl');
            });
        });

        describe('open spec', function () {
            it('should return expected uri', function () {
                var result = instance.open('aGuid', 'aCampaignId')
                    .build();

                expect(result).toEqual('/studio?filter=%7B%22campaignId%22:%22aCampaignId%22%7D&guid=aGuid&sdf=open');
            });
        });

        describe('copy spec', function () {
            it('should return expected uri', function () {
                var result = instance.copy('aTemplate', 'aTitle', 'aCampaignId')
                    .build();

                expect(result).toEqual('/studio?filter=%7B%22campaignId%22:%22aCampaignId%22%7D&sdf=copy&template=aTemplate&title=aTitle');
            });
        });

        describe('mediaselect spec', function () {
            it('should return expected uri', function () {
                var result = instance.mediaselect('aCampaignId')
                    .build();

                expect(result).toEqual('/studio?filter=%7B%22campaignId%22:%22aCampaignId%22%7D&sdf=mediaselect');
            });
        });
    });
});

