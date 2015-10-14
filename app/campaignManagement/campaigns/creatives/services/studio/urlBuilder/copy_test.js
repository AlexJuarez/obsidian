define(function (require) {
    'use strict';

    describe('copy spec', function () {
        var _$httpParamSerializer;
        var instance;

        beforeEach(function () {
            module('app.campaign-management');
            inject(function ($httpParamSerializer) {
                _$httpParamSerializer = $httpParamSerializer;
                instance = require('./copy');
            });
        });

        it('should be an instance of copy', function () {
            expect(instance(_$httpParamSerializer, 'aTemplate', 'aTitle')).toBeDefined();
        });

        it('should have setHostname method', function () {
            expect(instance(_$httpParamSerializer, 'aTemplate', 'aTitle').setHostname).toBeDefined();
        });

        it('should have setPath method', function () {
            expect(instance(_$httpParamSerializer, 'aTemplate', 'aTitle').setPath).toBeDefined();
        });

        it('should have setFilter method', function () {
            expect(instance(_$httpParamSerializer, 'aTemplate', 'aTitle').setFilter).toBeDefined();
        });

        it('should have build method', function () {
            expect(instance(_$httpParamSerializer, 'aTemplate', 'aTitle').build).toBeDefined();
        });

        it('should have expected copy studio direct flag', function () {
            var result = instance(_$httpParamSerializer, 'aTemplate', 'aTitle')
                .build();

            expect(result).toMatch('sdf=copy');
        });

        it('should default to expected url', function () {
            var result = instance(_$httpParamSerializer, 'aTemplate', 'aTitle')
                .build();

            expect('/studio?sdf=copy&template=aTemplate&title=aTitle').toEqual(result);
        });

        it('should allow path to be set', function () {
            var result = instance(_$httpParamSerializer, 'aTemplate', 'aTitle')
                .setPath('/mypath')
                .build();

            expect(result).toMatch('/mypath');
            expect(result).toEqual('/mypath?sdf=copy&template=aTemplate&title=aTitle');
        });

        it('should allow hostname to be set', function () {
            var result = instance(_$httpParamSerializer, 'aTemplate', 'aTitle')
                .setHostname('subdomain.mixpo.com')
                .build();

            expect(result).toEqual('subdomain.mixpo.com/studio?sdf=copy&template=aTemplate&title=aTitle');
        });

        it('should allow optional filter Object which is output as json', function () {
            var filter = {
                arg1:'val1',
                arg2:'val2'
            };

            var result = instance(_$httpParamSerializer, 'aTemplate', 'aTitle')
                .setFilter(filter)
                .build();

            expect(result).toMatch('filter=');
            expect(result).toEqual('/studio?filter=%7B%22arg1%22:%22val1%22,%22arg2%22:%22val2%22%7D&sdf=copy&template=aTemplate&title=aTitle');
        });
    });
});
