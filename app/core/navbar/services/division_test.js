define(function (require) {
    'use strict';

    require('./division');
    require('angularMocks');

    describe('divisionService', function () {
        var division, httpBackend, state, apiGenerator, records, apiConfig;

        var divisions = [
            {
                'id': 'divisionId0',
                'name': 'Division 0',
                'pinned': true,
                'active': false,
                'lastViewed': '2015-01-01T12:00:00Z',
                'client': {'id': 'clientId0'}
            }
        ];

        beforeEach(function () {
            module('app.core');

            module(function ($provide) {
                $provide.value('$state', {
                    params: {
                        clientId: 'clientId0'
                    }
                });
            });

            inject(function (divisionService, $httpBackend, $state, apiUriGenerator, divisionRecordService) {
                division = divisionService;
                apiConfig = division._apiConfig;
                httpBackend = $httpBackend;
                state = $state;
                apiGenerator = apiUriGenerator;
                records = divisionRecordService;
            });
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of divisionService', function () {
            expect(division).not.toEqual(null);
        });

        it('should make a request on init', function () {
            httpBackend.when('GET', apiGenerator(apiConfig))
                .respond({
                    'divisions': divisions
                });

            division.init(apiConfig).then(function () {
                expect(division.all()).toEqual(divisions);
            });
            httpBackend.flush();
        });

        it('should pin an division', function () {
            division.setData(divisions);
            var a = division.all()[0];
            var record = records.get(a.id);

            spyOn(record, 'save').and.returnValue({
                then: function() {}
            });

            division.pin(a);

            expect(record.get().pinned).toEqual(true);
            expect(record.save).toHaveBeenCalled();
        });

        it('should unpin an division', function () {
            division.setData(divisions);
            var a = division.all()[0];
            var record = records.get(a.id);

            spyOn(record, 'save').and.returnValue({
                then: function() {}
            });

            division.unpin(a);

            expect(record.get().pinned).toEqual(false);
            expect(record.save).toHaveBeenCalled();
        });

        it('should return a map containing a key of the first letter by name', function () {
            division.setData(divisions);
            expect(division.alphabetMap()).toEqual([{key: 'd', value: divisions}]);
        });

        it('should get an division by id', function () {
            division.setData(divisions);
            expect(division.get('divisionId0')).toEqual(divisions[0]);
        });

        it('should find our result by name', function () {
            division.setData(divisions);

            expect(division.search('ion 0')[0].id).toEqual('divisionId0');
        });

        //The division filter is dependent on $state.params.clientId
        describe('filtered function', function () {
            it('should filter on the clientId', function () {
                division.setData(divisions);

                state.params = {clientId: 'clientId0'};

                expect(division.filtered()).toEqual(divisions);
            });

            it('should return empty on clientId not in set', function () {
                division.setData(divisions);

                state.params = {clientId: 'clientId1'};

                expect(division.filtered()).toEqual([]);
            });
        });
    });
});
