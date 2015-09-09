define(function (require) {
    'use strict';

    require('./getStudioPath');
    require('angularMocks');

    describe('getStudioPath', function () {
        var studioPath, _$location_;

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
            inject(function (getStudioPath) {
                studioPath = getStudioPath;
            });
        });

        it('should be injectable', function () {
            expect(studioPath).not.toEqual(null);
        });

        it('should return non null value', function () {
            var result = studioPath();

            expect(result).not.toEqual(null);
        });

        it('should return expected value from $location.path() when no argument used', function () {
            var result = studioPath();

            expect(result).toEqual('//foo-studio.bar.com');
        });

        it('should return expected value when path is provided', function () {
            var result = studioPath('baz-studio.bar.com');

            expect(result).toEqual('//baz-studio.bar.com');
        });

        it('should return mixpo url with username with -studio appended in path', function () {
            var result = studioPath('username.mixpo.com');

            expect(result).toEqual('//username-studio.mixpo.com');
        });

        it('should return original studio path when studio is in original path', function () {
            var result = studioPath('cute-studio.kittens.org');

            expect(result).toEqual('//cute-studio.kittens.org');
        });

        it('should return //studio.mixpo.com path for unmatchable path', function () {
            var result = studioPath('baz.bar.com');

            expect(result).toEqual('//studio.mixpo.com');
        });

        it('should return the proper studio URL', function() {
            var hostname;
            hostname = 'thorwhal-studio.mixpo.com';
            expect(studioPath(hostname)).toEqual('//thorwhal-studio.mixpo.com');
            hostname = 'thorwhal.mixpo.com';
            expect(studioPath(hostname)).toEqual('//thorwhal-studio.mixpo.com');
            hostname = 'studio.mixpo.com';
            expect(studioPath(hostname)).toEqual('//studio.mixpo.com');
            hostname = 'other.com';
            expect(studioPath(hostname)).toEqual('//studio.mixpo.com');
        });
    });
});

