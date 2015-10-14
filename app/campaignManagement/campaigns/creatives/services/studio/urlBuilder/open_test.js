define(function (require) {
    'use strict';

    describe('open spec', function () {
        var _$httpParamSerializer;
        var instance;

        beforeEach(function () {
            module('app.campaign-management');
            inject(function ($httpParamSerializer) {
                _$httpParamSerializer = $httpParamSerializer;
                instance = require('./open');
            });
        });

        it('should be an instance of open', function () {
            expect(instance(_$httpParamSerializer, 'aGuid')).toBeDefined();
        });

        it('should have setHostname method', function () {
            expect(instance(_$httpParamSerializer, 'aGuid').setHostname).toBeDefined();
        });

        it('should have setPath method', function () {
            expect(instance(_$httpParamSerializer, 'aGuid').setPath).toBeDefined();
        });

        it('should have setFilter method', function () {
            expect(instance(_$httpParamSerializer, 'aGuid').setFilter).toBeDefined();
        });

        it('should have build method', function () {
            expect(instance(_$httpParamSerializer, 'aGuid').build).toBeDefined();
        });

        it('should have expected open studio direct flag', function () {
            var result = instance(_$httpParamSerializer, 'aGuid')
                .build();

            expect(result).toMatch('sdf=open');
        });

        it('should default to expected url', function () {
            var result = instance(_$httpParamSerializer, 'aGuid')
                .build();

            expect('/studio?guid=aGuid&sdf=open').toEqual(result);
        });

        it('should allow path to be set', function () {
            var result = instance(_$httpParamSerializer, 'aGuid')
                .setPath('/mypath')
                .build();

            expect(result).toMatch('/mypath');
            expect(result).toEqual('/mypath?guid=aGuid&sdf=open');
        });

        it('should allow hostname to be set', function () {
            var result = instance(_$httpParamSerializer, 'aGuid')
                .setHostname('subdomain.mixpo.com')
                .build();

            expect(result).toEqual('subdomain.mixpo.com/studio?guid=aGuid&sdf=open');
        });

        it('should allow optional filter Object which is output as json', function () {
            var filter = {
                arg1:'val1',
                arg2:'val2'
            };

            var result = instance(_$httpParamSerializer, 'aGuid')
                .setFilter(filter)
                .build();

            expect(result).toMatch('filter=');
            expect(result).toEqual('/studio?filter=%7B%22arg1%22:%22val1%22,%22arg2%22:%22val2%22%7D&guid=aGuid&sdf=open');
        });
    });
});
