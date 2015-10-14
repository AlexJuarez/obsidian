define(function (require) {
    'use strict';

    describe('mediaselect spec', function () {
        var _$httpParamSerializer;
        var instance;

        beforeEach(function () {
            module('app.campaign-management');
            inject(function ($httpParamSerializer) {
                _$httpParamSerializer = $httpParamSerializer;
                instance = require('./mediaselect');
            });
        });

        it('should be an instance of mediaselect', function () {
            expect(instance(_$httpParamSerializer)).toBeDefined();
        });

        it('should have setHostname method', function () {
            expect(instance(_$httpParamSerializer).setHostname).toBeDefined();
        });

        it('should have setPath method', function () {
            expect(instance(_$httpParamSerializer).setPath).toBeDefined();
        });

        it('should have setFilter method', function () {
            expect(instance(_$httpParamSerializer).setFilter).toBeDefined();
        });

        it('should have build method', function () {
            expect(instance(_$httpParamSerializer).build).toBeDefined();
        });

        it('should have expected mediaselect studio direct flag', function () {
            var result = instance(_$httpParamSerializer)
                .build();

            expect(result).toMatch('sdf=mediaselect');
        });

        it('should default to expected url', function () {
            var result = instance(_$httpParamSerializer)
                .build();

            expect('/studio?sdf=mediaselect').toEqual(result);
        });

        it('should allow path to be set', function () {
            var result = instance(_$httpParamSerializer)
                .setPath('/mypath')
                .build();

            expect(result).toMatch('/mypath');
            expect(result).toEqual('/mypath?sdf=mediaselect');
        });

        it('should allow hostname to be set', function () {
            var result = instance(_$httpParamSerializer)
                .setHostname('subdomain.mixpo.com')
                .build();

            expect(result).toEqual('subdomain.mixpo.com/studio?sdf=mediaselect');
        });

        it('should allow optional filter Object which is output as json', function () {
            var filter = {
                arg1:'val1',
                arg2:'val2'
            };

            var result = instance(_$httpParamSerializer)
                .setFilter(filter)
                .build();

            expect(result).toMatch('filter=');
            expect(result).toEqual('/studio?filter=%7B%22arg1%22:%22val1%22,%22arg2%22:%22val2%22%7D&sdf=mediaselect');
        });
    });
});

