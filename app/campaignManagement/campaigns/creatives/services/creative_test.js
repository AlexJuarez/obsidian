define(function (require) {
    'use strict';

    require('./creative');
    require('angularMocks');

    describe('creativeService', function () {
        var httpBackend, apiGenerator, state, service, scope;

        beforeEach(function () {
            module('app.campaign-management');
        });

        beforeEach(inject(function ($httpBackend, apiUriGenerator, $state, creativeService, $rootScope) {
            httpBackend = $httpBackend;
            apiGenerator = apiUriGenerator;
            state = $state;
            scope = $rootScope.$new();

            service = creativeService;
        }));

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        describe('find', function(){
            it('should find nothing when the data set is empty', function() {
                var id = 1;
                var data = [];

                expect(service._find(id, data)).toEqual(undefined);
            });

            it('should find the object when the data set contains said object', function() {
                var id = 1;
                var data = [{id: 1, test: 'test'}, {id: 2, test: 'not test'}];

                expect(service._find(id, data)).toEqual(data[0]);
            });
        });

        describe('get', function() {
            it('should get a creative by id', function() {
                var data = {
                    creatives: [
                        {id: 1, value: 'test'},
                        {id: 2, value: 'test1'}
                    ]
                };
                var id = 2;
                httpBackend.when('GET', apiGenerator(service._getApiConfig(id))).respond(data);

                service.observe(function() {
                    expect(service.get(id)).toEqual(data.creatives[1]);
                }, scope, true);

                service.get(id);

                httpBackend.flush();
            });
        });
    });
});
