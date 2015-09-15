define(function (require) {
    'use strict';

    require('./notification');
    require('angularMocks');
    var template = require('tpl!./../notification.html');
    var ng = require('angular');

    describe('$notification', function() {
        var document, templateCache, notification, httpBackend;

        beforeEach(function() {
            module('app.core');

            inject(function($notification, $document, $templateCache, $httpBackend) {
                notification = $notification;
                document = $document;
                templateCache = $templateCache;
                httpBackend = $httpBackend;

                $templateCache.put('core/notifications/notification.html', template);
            });
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should create a basic notification', function() {
            notification.primary({ message: 'test' }).then(function() {
                var body = document.find('body');
                expect(body.find('div.ui-notification').length).toEqual(1);
            });
        });

    });

});
