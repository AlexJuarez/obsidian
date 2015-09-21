define(function (require) {
    'use strict';

    require('./recordPool');
    require('angularMocks');

    var ng = require('angular');

    describe('recordPool', function () {
        var recordPool, httpBackend, scope;

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

            inject(function (recordPoolFactory, $httpBackend, $rootScope) {
                recordPool = recordPoolFactory;
                httpBackend = $httpBackend;
                scope = $rootScope.$new();
            });
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
            scope.$destroy();
        });

        it('should be an instance of recordPool', function () {
            expect(recordPool).not.toEqual(null);
        });

        it('should be able to get a record by id and notify observers on load', function() {
            var opts = ng.copy(apiConfig);
            var records = recordPool(opts);
            var record = records.get('id');

            httpBackend.when('GET', record.createUrl(opts.update)).respond({ success: true });

            record.observe(function() {
                var r = records.get('id');
                expect(r.get()).toEqual(jasmine.objectContaining({ success: true }));
            }, scope, true);

            records.fetch('id');

            records.observe(function(newUpdatedRecord) {
                expect(newUpdatedRecord).toEqual(jasmine.objectContaining({ success: true }));
            }, undefined, true);

            httpBackend.flush();
        });

        it('should update a record', function() {
            var opts = ng.copy(apiConfig);
            var records = recordPool(opts);
            var record = records.get('id');

            httpBackend.when('GET', record.createUrl(opts.update)).respond({ success: true });
            httpBackend.when('PUT', record.createUrl(opts.update)).respond({ updated: 1 });

            records.update('id', { success: false });

            var putObserve = false;
            records.observe(function(updatedRecord) {
                if (putObserve) {
                    expect(updatedRecord).toEqual({ success: false });
                }
                putObserve = true;
            }, undefined, true);

            httpBackend.flush();

            expect(record.get()).toEqual(jasmine.objectContaining({ updated: 1 }));
        });

        it('should create a new record', function() {
            var opts = ng.copy(apiConfig);
            var records = recordPool(opts);

            var record = records.create({ success: false });
            httpBackend.when('POST', record.createUrl(opts.create)).respond({ success: true });

            record.save();

            records.observe(function(updatedRecord) {
                expect(updatedRecord).toEqual(jasmine.objectContaining({ success: true }));
            }, undefined, true);

            httpBackend.flush();

            expect(record.get()).toEqual(jasmine.objectContaining({ success: true }));
        });

        it('should delete an existing record', function() {
            var opts = ng.copy(apiConfig);
            var records = recordPool(opts);
            var record = records.get('id');

            httpBackend.when('PUT', record.createUrl(opts.update), { deleted: true }).respond({ updated: 1 });

            records.delete('id');

            var putObserve = false;
            records.observe(function(updatedRecord) {
                if (putObserve) {
                    expect(updatedRecord).toEqual({ deleted: true });
                }
                putObserve = true;
            }, undefined, true);

            httpBackend.flush();

            expect(record.get()).toEqual(jasmine.objectContaining({ updated: 1 }));
        });

    });
});
