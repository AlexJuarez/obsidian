define(function (require) {
    'use strict';

    require('./store');
    require('angularMocks');
    var data = require('text!/base/assets/fixtures/channel.json');

    describe('channelService', function () {
        var channel, httpBackend;

        beforeEach(function () {
            module('app.core');
            inject(function (channelService, $httpBackend) {
                channel = channelService;
                httpBackend = $httpBackend;
            });
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        function setUpTest() {
            httpBackend.when('GET', '/api/v3/clientSet?dimensions=channel').respond(data);
            channel.init();
            httpBackend.flush();
        }

        it('should have a list of channels', function () {
            setUpTest();

            expect(channel.all().length).toBeTruthy();
        });
    });
});
