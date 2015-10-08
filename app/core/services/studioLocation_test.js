define(function (require) {
    'use strict';

    require('./studioLocation');
    require('angularMocks');

    describe('studioLocation', function () {
        var service, location, hostname;

        beforeEach(function () {
            hostname = '';
            location = {
                host: function() {
                    return hostname;
                }
            };
            module(function($provide) {
                $provide.value('$location', location);
            });
            module('app.core');
            inject(function (studioLocation) {
                service = studioLocation;
            });
        });

        it('should be injectable', function () {
            expect(service).not.toEqual(null);
        });

        it('host path should return non null value', function () {
            var result = service.host();

            expect(result).not.toEqual(null);
        });

        it('host path should return unaltered production studio url', function () {
            hostname = 'studio.mixpo.com';

            var result = service.host();

            expect(result).toEqual('//studio.mixpo.com');
        });

        it('host path should return unaltered environment studio url', function () {
            hostname = 'thorwhal-studio.mixpo.com';

            var result = service.host();

            expect(result).toEqual('//thorwhal-studio.mixpo.com');
        });

        it('host should return mixpo url with username with -studio appended in path', function () {
            hostname = 'username.mixpo.com';

            var result = service.host();

            expect(result).toEqual('//username-studio.mixpo.com');
        });

        it('host should return //studio.mixpo.com path for unmatchable path', function () {
            hostname = 'other.com';

            var result = service.host();

            expect(result).toEqual('//alpha-studio.mixpo.com');
        });
    });
});

