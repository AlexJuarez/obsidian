define(function (require) {
    'use strict';

    require('./studioUrl');
    require('angularMocks');

    describe('studioUrl', function () {
        var service;

        var window = {
            location: {
                hostname: ''
            }
        };

        beforeEach(function () {
            module('app.core');
            module(function($provide) {
                $provide.value('$window', window);
            });
            inject(function (studioUrl) {
                service = studioUrl;
            });
        });

        it('should be an instance of studioUrl', function () {
            expect(service).not.toEqual(null);
        });

        it('should return the proper studio URL', function() {
            window.location.hostname = 'thorwhal-studio.mixpo.com';
            expect(service()).toEqual('//thorwhal-studio.mixpo.com');
            window.location.hostname = 'thorwhal.mixpo.com';
            expect(service()).toEqual('//thorwhal-studio.mixpo.com');
            window.location.hostname = 'studio.mixpo.com';
            expect(service()).toEqual('//studio.mixpo.com');
            window.location.hostname = 'other.com';
            expect(service()).toEqual('//studio.mixpo.com');
        });
    });
});
