define(function(require) {
    'use strict';

    require('./creatives');
    require('angularMocks');

    describe('creatives', function() {
        var creativesService, httpBackend, state, apiGenerator, scope, records, timeout;

        beforeEach(function() {
            module('app.campaign-management');

            inject(function(creatives, $httpBackend, $state, apiUriGenerator, $rootScope, creativeRecordService, $timeout) {
                creativesService = creatives;
                httpBackend = $httpBackend;
                state = $state;
                apiGenerator = apiUriGenerator;
                scope = $rootScope.$new();
                records = creativeRecordService;
                timeout = $timeout;
            });
        });

        afterEach(function() {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of creatives', function() {
            expect(creativesService).not.toEqual(null);
        });

        it('should return the interface we expect', function() {
            expect(typeof creativesService.all).toEqual('function');
            expect(typeof creativesService.data).toEqual('function');
            expect(typeof creativesService.observe).toEqual('function');
        });

        it('should observe the cache', function() {
            var callback = function() {
                expect(creativesService.data().all()).toEqual([]);
            };

            httpBackend.when('GET', apiGenerator(creativesService._apiConfig())).respond({
                creatives: []
            });

            creativesService.observe(callback, scope, true);
            creativesService.data(true);

            httpBackend.flush();
        });

        it('should transform creatives properly', function() {
            var data = [{
                id: 3,
                name: 'Hallow\'s Eve Pumpkin Supply',
                live: true,
                type: 'RM',
                device: 'Desktop',
                embedWidth: '300',
                embedHeight: '250',
                expandedWidth: '600',
                expandedHeight: '250',
                numPlacements: 5,
                lastModified: '2015-12-05',
                thumbnail: 'http://www.placecage.com/600/225',
                campaign: { id: 'test' }
            }];

            var callback = function() {
                var output = creativesService.all();
                expect(output.rules).toExist();
                expect(output.headers).toExist();
                expect(output.data.length).toEqual(1);
            };

            httpBackend.when('GET', apiGenerator(creativesService._apiConfig())).respond({
                creatives: data
            });

            creativesService.observe(callback, scope, true);
            creativesService.data(true);

            httpBackend.flush();
        });

        it('should handle state parameters correctly', function () {
            state.params.campaignId = 1;

            expect(creativesService._apiConfig().queryParams.filters).toEqual(['campaign.id:eq:1']);
        });

        it('should addData', function () {
            var data = [{ id: 1 }];

            var callback = function() {
                expect(creativesService.data().all()).toEqual(data);
            };

            creativesService.observe(callback, scope, true, true);
            creativesService.addData(data);
        });

        it('should observe creativeRecordService', function () {
            var data = [];
            var record = records.create();
            record.set({ name: 'test' });

            httpBackend.when('GET', apiGenerator(creativesService._apiConfig())).respond({
                creatives: data
            });
            creativesService.all();
            httpBackend.flush();
            httpBackend.when('POST', '/api/crud/creatives').respond({ id: 1, name: 'test' });
            record.save();
            httpBackend.flush();

            expect(record.isNew()).toEqual(false);
            expect(creativesService._getCreative(1)).toEqual(jasmine.objectContaining({ id: 1 }));
        });
    });
});
