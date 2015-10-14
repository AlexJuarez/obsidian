define(function (require) {
	'use strict';

	require('./cdnLocation');
	require('angularMocks');

	describe('cdnLocation', function () {
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
			inject(function (cdnLocation) {
				service = cdnLocation;
			});
		});

		it('should be injectable', function () {
			expect(service).not.toEqual(null);
		});

		it('host path should return non null value', function () {
			var result = service.host();

			expect(result).not.toEqual(null);
		});

		it('should convert a production studio environment to the cdn environment', function () {
			hostname = 'studio.mixpo.com';

			var result = service.host();

			expect(result).toEqual('//swf.mixpo.com');
		});

		it('should convert a preproduction studio environment to the cdn environment', function () {
			hostname = 'thorwhal-studio.mixpo.com';

			var result = service.host();

			expect(result).toEqual('//thorwhal-swf.mixpo.com');
		});

		it('host should return mixpo url with username with -swf appended in path', function () {
			hostname = 'username.mixpo.com';

			var result = service.host();

			expect(result).toEqual('//username-swf.mixpo.com');
		});

		it('host should return //alpha-swf.mixpo.com path for unmatchable path', function () {
			hostname = 'other.com';

			var result = service.host();

			expect(result).toEqual('//alpha-swf.mixpo.com');
		});
	});
});

