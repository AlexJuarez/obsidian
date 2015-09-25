define(function(require) {
    'use strict';

    require('./record');
    require('./observer');
    require('./../services/apiURIGenerator');
    require('angularMocks');

    var ng = require('angular');

    describe('recordFactory', function() {
        var factory, httpBackend, apiGenerator, scope, record;

        beforeEach(function () {
            module('app.core');

            inject(function (recordFactory, $httpBackend, apiUriGenerator, $rootScope) {
                factory = recordFactory;
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

        describe('fetch', function() {

            var options = {
                apiConfig: {
                    update: {
                        version: 'crud',
                        endpoint: 'tests/{{id}}'
                    }
                },
                attributes: {
                    id: 1
                }
            };

            it('should use the update config to make a request', function() {
                var opts = ng.copy(options);
                record = factory(opts);
                httpBackend.when('GET', record.createUrl(opts.apiConfig.update)).respond({ success: true });
                record.fetch();
                httpBackend.flush();

                expect(record.get()).toEqual(jasmine.objectContaining({ success: true }));
            });

            it('should use the read config if present', function() {
                var opts = ng.copy(options);

                opts.apiConfig.read = {
                    version: 'crud',
                    endpoint: 'test2/{{id}}'
                };

                record = factory(opts);
                httpBackend.when('GET', record.createUrl(opts.apiConfig.read)).respond({ success: true });
                record.fetch();
                httpBackend.flush();

                expect(record.get()).toEqual(jasmine.objectContaining({ success: true }));
            });

            it('should handle errors correctly', function() {
                var opts = ng.copy(options);

                opts.apiConfig.read = {
                    version: 'crud',
                    endpoint: 'test2/{{id}}'
                };

                record = factory(opts);
                httpBackend.when('GET', record.createUrl(opts.apiConfig.read)).respond(400, { errors: {test: 'test'} });
                record.fetch();
                httpBackend.flush();
                expect(record.errors()).toEqual({test: 'test'});
            });
        });

        describe('save', function() {
            var options = {
                apiConfig: {
                    create: {
                        version: 'crud',
                        endpoint: 'tests'
                    }
                }
            };

            it('should create an entity', function() {
                var opts = ng.copy(options);
                record = factory(opts);
                httpBackend.when('POST', record.createUrl(opts.apiConfig.create), {test: 'test'}).respond({ id: 1, success: true });
                record.get().test = 'test';
                record.save();
                httpBackend.flush();
                expect(record.id).toEqual(1);
            });

            it('should update a entity', function() {
                var opts = ng.copy(options);
                opts.apiConfig.update = {
                    version: 'crud',
                    endpoint: 'tests'
                };
                opts.attributes = { id: 1 };
                record = factory(opts);
                record.set({test: 'test'});
                httpBackend.when('PUT', record.createUrl(opts.apiConfig.update), { test: 'test'}).respond({ test: 'test', success: true });
                record.save();
                httpBackend.flush();

                expect(record.get()).toEqual(jasmine.objectContaining({ test: 'test' }));
            });
        });

        describe('destroy', function() {
            var options = {
                apiConfig: {
                    update: {
                        version: 'crud',
                        endpoint: 'tests/{{id}}'
                    }
                },
                attributes: {
                    id: 1
                }
            };

            it('should do a soft delete', function() {
                var opts = ng.copy(options);
                record = factory(opts);
                httpBackend.when('PUT', record.createUrl(opts.apiConfig.update), { deleted: true}).respond({ success: true });
                record.destroy();
                httpBackend.flush();
                expect(record.get()).toEqual(jasmine.objectContaining({ success: true }));
            });

            it('should do a hard delete', function() {
                var opts = ng.copy(options);
                opts.apiConfig.delete = {
                    version: 'crud',
                    endpoint: 'tests/{{id}}',
                    method: 'delete'
                };
                record = factory(opts);
                httpBackend.when('DELETE', record.createUrl(opts.apiConfig.delete)).respond({ success: true });
                record.destroy();
                httpBackend.flush();
                expect(record.get()).toEqual(jasmine.objectContaining({ success: true }));
            });
        });

        it('should validate a config', function() {
            record = factory();
            expect(record.validConfig({})).toEqual(false);
        });

        it('should return if it hasChanges', function() {
            record = factory();
            record.set({ changes: true });
            expect(record.hasChanges()).toEqual(true);
        });
    });
});
