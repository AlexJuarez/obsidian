define(function (require) {
    'use strict';

    describe('create spec', function () {
        var _$httpParamSerializer;
        var instance;

        beforeEach(function () {
            module('app.campaign-management');
            inject(function ($httpParamSerializer) {
                _$httpParamSerializer = $httpParamSerializer;
                instance = require('./create');
            });
        });

        it('should be an instance of create', function () {
            expect(instance(_$httpParamSerializer, 'aType', 'aEnv', 'aTitle', 'aClickthroughUrl')).toBeDefined();
        });

        it('should have setHostname method', function () {
            expect(instance(_$httpParamSerializer, 'aType', 'aEnv', 'aTitle', 'aClickthroughUrl').setHostname).toBeDefined();
        });

        it('should have setPath method', function () {
            expect(instance(_$httpParamSerializer, 'aType', 'aEnv', 'aTitle', 'aClickthroughUrl').setPath).toBeDefined();
        });

        it('should have setFilter method', function () {
            expect(instance(_$httpParamSerializer, 'aType', 'aEnv', 'aTitle', 'aClickthroughUrl').setFilter).toBeDefined();
        });

        it('should have build method', function () {
            expect(instance(_$httpParamSerializer, 'aType', 'aEnv', 'aTitle', 'aClickthroughUrl').build).toBeDefined();
        });

        it('should have expected copy studio direct flag', function () {
            var result = instance(_$httpParamSerializer, 'aType', 'aEnv', 'aTitle', 'aClickthroughUrl')
                .build();

            expect(result).toMatch('sdf=new');
        });

        it('should have expected interactive display width integer', function () {
            var result = instance(_$httpParamSerializer, 'aType', 'aEnv', 'aTitle', 'aClickthroughUrl')
                .setIdWidth(123)
                .build();

            expect(result).toMatch('idw=');
        });

        it('should have expected interactive display height integer', function () {
            var result = instance(_$httpParamSerializer, 'aType', 'aEnv', 'aTitle', 'aClickthroughUrl')
                .setIdHeight(123)
                .build();

            expect(result).toMatch('idh=');
        });

        it('should have expected timeline canvas width integer', function () {
            var result = instance(_$httpParamSerializer, 'aType', 'aEnv', 'aTitle', 'aClickthroughUrl')
                .setTcWidth(123)
                .build();

            expect(result).toMatch('tcw=');
        });

        it('should have expected timeline canvas height integer', function () {
            var result = instance(_$httpParamSerializer, 'aType', 'aEnv', 'aTitle', 'aClickthroughUrl')
                .setTcHeight(123)
                .build();

            expect(result).toMatch('tch=');
        });

        it('should default to expected url', function () {
            var result = instance(_$httpParamSerializer, 'aType', 'aEnv', 'aTitle', 'aClickthroughUrl')
                .build();

            expect(result).toEqual('/studio?ad=aType&env=aEnv&sdf=new&title=aTitle&url=aClickthroughUrl');
        });

        it('should allow path to be set', function () {
            var result = instance(_$httpParamSerializer, 'aType', 'aEnv', 'aTitle', 'aClickthroughUrl')
                .setPath('/mypath')
                .build();

            expect(result).toMatch('/mypath');
            expect(result).toEqual('/mypath?ad=aType&env=aEnv&sdf=new&title=aTitle&url=aClickthroughUrl');
        });

        it('should allow hostname to be set', function () {
            var result = instance(_$httpParamSerializer, 'aType', 'aEnv', 'aTitle', 'aClickthroughUrl')
                .setHostname('subdomain.mixpo.com')
                .build();

            expect(result).toEqual('subdomain.mixpo.com/studio?ad=aType&env=aEnv&sdf=new&title=aTitle&url=aClickthroughUrl');
        });

        it('should allow optional filter Object which is output as json', function () {
            var filter = {
                arg1:'val1',
                arg2:'val2'
            };

            var result = instance(_$httpParamSerializer, 'aType', 'aEnv', 'aTitle', 'aClickthroughUrl')
                .setFilter(filter)
                .build();

            expect(result).toMatch('filter=');
            expect(result).toEqual('/studio?ad=aType&env=aEnv&filter=%7B%22arg1%22:%22val1%22,%22arg2%22:%22val2%22%7D&sdf=new&title=aTitle&url=aClickthroughUrl');
        });
    });
});
