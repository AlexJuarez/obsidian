define(function (require) {
    'use strict';

    require('./record');
    require('angularMocks');

    var ng = require('angular');

    describe('recordFactory', function () {
        var record, httpBackend, apiGenerator;

        var apiConfig = {
            update: {
                version: 'test',
                endpoint: 'endpoint'
            },
            create: {
                version: 'test',
                endpoint: 'endpoint'
            }
        };

        beforeEach(function () {
            module('app.core');
            inject(function (recordFactory, $httpBackend, apiUriGenerator) {
                record = recordFactory;
                httpBackend = $httpBackend;
                apiGenerator = apiUriGenerator;
            });
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of recordFactory', function () {
            expect(record).not.toEqual(null);
        });

        it('should init', function() {
            var object = { success: true };
            var myRecord = record(apiConfig);
            httpBackend.when('GET', apiGenerator(apiConfig)).respond(object);
            myRecord.init();
            httpBackend.flush();

            myRecord.observe(function() {
                expect(myRecord.all()).toEqual(object);
            }, undefined, true);
        });

        it('should create a new record', function() {
            var object = { success: true };
            var myRecord = record(apiConfig);

            httpBackend.when('POST', apiGenerator(apiConfig)).respond({ success: true });
            myRecord.create({ success: true });
            httpBackend.flush();
            myRecord.observe(function() {
                expect(myRecord.all()).toEqual(object);
            });
        });

        it('should update an existing record', function() {
            var idConfig = ng.copy(apiConfig);
            idConfig.update.endpoint = idConfig.update.endpoint.replace('{id}', 'id');
            var myRecord = record(idConfig);

            httpBackend.when('PUT', apiGenerator(idConfig.update)).respond({ success: false });
            myRecord._record.setData({ id: 'id', success: true });
            myRecord.update({ success: false });

            httpBackend.flush();
            myRecord.observe(function() {
                expect(myRecord.all()).toEqual({ id: 'id', success: false });
            });

        });

        it('should delete an existing record', function() {
            var idConfig = ng.copy(apiConfig);
            idConfig.update.endpoint = idConfig.update.endpoint.replace('{id}', 'id');
            var myRecord = record(idConfig);

            httpBackend.when('PUT', apiGenerator(idConfig.update)).respond({ deleted: true });
            myRecord._record.setData({ id: 'id', deleted: false });
            myRecord.delete();

            httpBackend.flush();
            myRecord.observe(function() {
                expect(myRecord.all()).toEqual({ id: 'id', deleted: true });
            });

        });
    });
});
