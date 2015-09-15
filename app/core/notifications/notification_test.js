define(function (require) {
    'use strict';

    require('./index');
    require('angularMocks');
    var template = require('tpl!./notification.html');
    var ng = require('angular');

    describe('$notification', function() {
        var document, templateCache, notification, rootScope, timeout;

        beforeEach(function() {
            module('app.core');

            inject(function($notification, $document, $templateCache, $rootScope, $timeout) {
                notification = $notification;
                document = $document;
                templateCache = $templateCache;
                rootScope = $rootScope;
                timeout = $timeout;

                $templateCache.put('core/notifications/notification.html', template);
            });
        });

        describe('notify', function() {
            var body;

            beforeEach(function() {
                body = ng.element('<div />');
                spyOn(document, 'find').and.returnValue(body);
            });

            afterEach(function() {
                rootScope.$digest();

                expect(document.find).toHaveBeenCalled();
                expect(body.find('.ui-notification').length).toEqual(1);
            });

            it('should create a basic notification', function() {
                notification.primary('test');
            });

            it('should create a error notification', function() {
                notification.error('test');
            });

            it('should create a success notification', function() {
                notification.success('test');
            });

            it('should create a info notification', function() {
                notification.info('test');
            });

            it('should create a warn notification', function() {
                notification.warn('test');
            });
        });

        describe('controller', function() {
            function setUpController() {
                var instance;
                var testCtrl = function($scope, $notificationInstance, test, test2) {
                    $scope.test = test;
                    $scope.test2 = test2;
                    instance = $notificationInstance;
                };

                var body = ng.element('<div />');
                spyOn(document, 'find').and.returnValue(body);

                notification.primary({
                    message: 'test',
                    controller: testCtrl,
                    timeout: 0,
                    resolve: {
                        test: function() {
                            return 'passed';
                        },
                        test2: 'passed'
                    }
                });

                rootScope.$digest();
                expect(document.find).toHaveBeenCalled();

                return {
                    instance: instance,
                    body: body
                };
            }

            it('should open with a controller', function() {
                var setUp = setUpController();
                var instance = setUp.instance;

                expect(instance.scope.test).toEqual('passed');
                expect(instance.scope.test2).toEqual('passed');
            });

            it('should be possible to dismiss the instance', function() {
                var setUp = setUpController();
                var instance = setUp.instance;
                var body = setUp.body;

                instance.scope.$dismiss();
                expect(body.find('.ui-notification').length).toEqual(0);
            });
        });

        describe('general', function() {
            var body;

            beforeEach(function() {
                body = ng.element('<div />');
                spyOn(document, 'find').and.returnValue(body);
            });

            afterEach(function() {
                expect(document.find).toHaveBeenCalled();
            });

            it('should reposition the message element', function() {
                notification.primary('test');
                notification.primary('test');
                rootScope.$digest();

                expect(body.find('.ui-notification').eq(0).css('top')).toEqual('20px');
            });

            it('should clear all of the notifications', function() {
                notification.primary('test');
                notification.primary('test');
                rootScope.$digest();

                notification.clearAll();

                expect(body.find('.killed').length).toEqual(2);
            });

            it('should remove a message element', function() {
                notification.primary('test');
                rootScope.$digest();

                var el = body.find('.ui-notification').eq(0);

                el.css('opacity', 0);
                el.trigger({type: 'transitionend', propertyName: 'opacity'});
                expect(body.find('.ui-notification').length).toEqual(0);
            });

            it('should timeout and be removed', function() {
                notification.primary({ message: 'test', timeout: 10});
                rootScope.$digest();

                timeout.flush();
                expect(body.find('.killed').length).toEqual(1);
            });
        });
    });

    describe('notificationFactory', function() {
        var document, templateCache, notify, rootScope, timeout, body;

        beforeEach(function() {
            module('app.core');

            inject(function(notification, $document, $templateCache, $rootScope, $timeout) {
                notify = notification;
                document = $document;
                templateCache = $templateCache;
                rootScope = $rootScope;
                timeout = $timeout;

                $templateCache.put('core/notifications/notification.html', template);
            });

            body = ng.element('<div />');
            spyOn(document, 'find').and.returnValue(body);
            spyOn(rootScope, '$broadcast').and.callThrough();
        });

        afterEach(function() {
            expect(rootScope.$broadcast).toHaveBeenCalled();
        });

        it('should create an error notification', function() {
            notify.error('an error');
        });

        it('should create an error notification', function() {
            notify.warn('a warning');
        });

        it('should create an error notification', function() {
            notify.info('info');
        });

        it('should create an error notification', function() {
            notify.success('a success');
        });

        it('should create an error notification', function() {
            notify.dismissAll();
        });

    });
});
