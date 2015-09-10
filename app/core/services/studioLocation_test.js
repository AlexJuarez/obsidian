define(function (require) {
    'use strict';

    require('./studioLocation');
    require('angularMocks');

    describe('studioLocation', function () {
        var _studioLocation, _$location_;

        beforeEach(function () {
            _$location_ = {
                path: function() {
                    return 'foo-studio.bar.com';
                }
            };
            module(function($provide) {
                $provide.value('$location', _$location_);
            });
            module('app.core');
            inject(function (studioLocation) {
                _studioLocation = studioLocation;
            });
        });

        it('should be injectable', function () {
            expect(_studioLocation).not.toEqual(null);
        });

        it('path should return non null value', function () {
            console.log(_studioLocation);

            var result = _studioLocation.path();

            expect(result).not.toEqual(null);
        });

        it('should return expected value from $location.path() when no argument used', function () {

            var result = _studioLocation.path();

            expect(result).toEqual('//foo-studio.bar.com');
        });

        it('path should return unaltered production studio url', function () {
            var hostname = 'studio.mixpo.com';

            var result = _studioLocation.path(hostname);

            expect(result).toEqual('//studio.mixpo.com');
        });

        it('should return expected value when path is provided', function () {
            var hostname = 'thorwhal-studio.mixpo.com';

            var result = _studioLocation.path(hostname);

            expect(result).toEqual('//thorwhal-studio.mixpo.com');
        });

        it('should return mixpo url with username with -studio appended in path', function () {
            var hostname = 'username.mixpo.com';

            var result = _studioLocation.path(hostname);

            expect(result).toEqual('//username-studio.mixpo.com');
        });

        it('should return //studio.mixpo.com path for unmatchable path', function () {
            var hostname = 'other.com';

            var result = _studioLocation.path(hostname);

            expect(result).toEqual('//studio.mixpo.com');
        });
    });
});

