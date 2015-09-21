define(function (require) {
    'use strict';

    require('./recordPool');
    require('angularMocks');

    var ng = require('angular');

    describe('recordPool', function () {
        var recordPool, httpBackend, apiGenerator, scope;

        var apiConfig = {
            update: {
                version: 'test',
                endpoint: 'endpoint/{{id}}'
            },
            create: {
                version: 'test',
                endpoint: 'endpoint'
            }
        };

        beforeEach(function () {
            module('app.core');
            inject(function (recordPoolFactory, $httpBackend, apiUriGenerator, $rootScope) {
                recordPool = recordPoolFactory;
                httpBackend = $httpBackend;
                apiGenerator = apiUriGenerator;
                scope = $rootScope.$new();
            });
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
            scope.$destroy();
        });

        // function setupTests(apiConfig) {

        // }

        it('should be an instance of recordPool', function () {
            expect(recordPool).not.toEqual(null);
        });

        it('should be able to get a record by id and notify observers on load', function() {
            var record = { success: true };
            var records = recordPool(apiConfig);

            var idConfig = ng.copy(apiConfig);
            idConfig.update.endpoint = idConfig.update.endpoint.replace('{{id}}', 'id');

            httpBackend.when('GET', apiGenerator(idConfig.update)).respond(record);

            records.get('id').observe(function() {
                var r = records.get('id');
                expect(r.get()).toEqual(jasmine.objectContaining(record));
            }, scope, true);

            records.fetch('id');

            records.observe(function(newUpdatedRecord) {
                expect(newUpdatedRecord).toEqual(jasmine.objectContaining(record));
            }, undefined, true);

            httpBackend.flush();
        });

        it('should update a record', function() {
            var record = { success: true };
            var records = recordPool(apiConfig);

            var idConfig = ng.copy(apiConfig);
            idConfig.update.endpoint = idConfig.update.endpoint.replace('{id}', 'id');

            httpBackend.when('GET', apiGenerator(idConfig.update)).respond(record);
            httpBackend.when('PUT', apiGenerator(idConfig)).respond({ updated: 1 });

            records.update('id', { success: false }).then(function(updatedRecord) {
                expect(updatedRecord.data).toEqual({ updated: 1 });
            });

            var putObserve = false;
            records.observe(function(updatedRecord) {
                if (putObserve) {
                    expect(updatedRecord).toEqual({ success: false });
                }
                putObserve = true;
            }, undefined, true);

            httpBackend.flush();
        });

        it('should create a new record', function() {
            var record = { success: true };
            var records = recordPool(apiConfig);

            var postConfig = ng.copy(apiConfig);
            httpBackend.when('POST', apiGenerator(postConfig.create)).respond(record);

            records.create({ success: false }).then(function(createdRecord) {
                expect(createdRecord.data).toEqual(record);
            });

            records.observe(function(updatedRecord) {
                expect(updatedRecord).toEqual(record);
            }, undefined, true);

            httpBackend.flush();
        });

        it('should delete an existing record', function() {
            var record = { deleted: false };
            var records = recordPool(apiConfig);

            var idConfig = ng.copy(apiConfig);
            idConfig.update.endpoint = idConfig.update.endpoint.replace('{id}', 'id');

            httpBackend.when('GET', apiGenerator(idConfig.update)).respond(record);
            httpBackend.when('PUT', apiGenerator(idConfig.update)).respond({ updated: 1 });

            records.delete('id').then(function(updatedRecord) {
                expect(updatedRecord.data).toEqual({ updated: 1 });
            });

            var putObserve = false;
            records.observe(function(updatedRecord) {
                if (putObserve) {
                    expect(updatedRecord).toEqual({ deleted: true });
                }
                putObserve = true;
            }, undefined, true);

            httpBackend.flush();
        });

    });
});
