define(function (require) {
    'use strict';

    require('./studioWindow');
    require('angularMocks');

    describe('studioWindow', function () {
        var instance, window;

        beforeEach(function () {
            module('app.campaign-management');
            inject(function (studioWindow, $window) {
                instance = studioWindow;
                window = $window;
            });
        });

        it('should be an instance of studioWindow', function () {
            expect(instance).toBeDefined();
        });

        describe('studioWindow.DEFAULT_WINDOW_NAME spec', function () {
            it('should be defined', function () {
                expect(instance.DEFAULT_WINDOW_NAME).toBeDefined();
            });

            it('should equal default window name', function () {
                expect(instance.DEFAULT_WINDOW_NAME).toEqual('mixpo_studio');
            });
        });

        describe('open', function () {
            it('should be defined', function () {
                var fakeWindow = {postMessage: function(){}};
                spyOn(window, 'open').and.returnValue(fakeWindow);
                expect(instance.open).toBeDefined();
            });

            it('should use open window with supplied url', function () {
                var fakeWindow = {postMessage: function(){}};
                spyOn(window, 'open').and.returnValue(fakeWindow);
                var url = '_url_';

                instance.open(url);

                expect(window.open.calls.mostRecent().args[0]).toEqual(url);
            });

            it('should open window with supplied windowName', function () {
                var fakeWindow = {postMessage: function(){}};
                spyOn(window, 'open').and.returnValue(fakeWindow);
                var windowName = '_windowName_';

                instance.open(null, windowName);

                expect(window.open.calls.mostRecent().args[1]).toEqual(windowName);
            });

            it('should open window with DEFAULT_WINDOW_NAME when windowName is undefined', function () {
                var fakeWindow = {postMessage: function(){}};
                spyOn(window, 'open').and.returnValue(fakeWindow);

                instance.open(null);

                expect(window.open.calls.mostRecent().args[1]).toEqual(instance.DEFAULT_WINDOW_NAME);
            });

            it('should open window with supplied strWindowFeatures', function () {
                var fakeWindow = {postMessage: function(){}};
                spyOn(window, 'open').and.returnValue(fakeWindow);
                var strWindowFeatures = [];

                instance.open(null, null, strWindowFeatures);

                expect(window.open.calls.mostRecent().args[2]).toEqual(strWindowFeatures);
            });

            it('should listen for windows postMessage events', function () {
                var fakeWindow = {
                    postMessage: jasmine.createSpy('postMessage'),
                    close: jasmine.createSpy('close')
                };
                spyOn(window, 'open').and.returnValue(fakeWindow);
                spyOn(window, 'addEventListener');
                var strWindowFeatures = [];

                var result = instance.open(null, null, strWindowFeatures);

                expect(window.addEventListener).toHaveBeenCalled();
                expect(window.addEventListener.calls.mostRecent().args[0]).toEqual('message');
                result.close();
            });

            it('should not decorate window with studio direct handler if connected', function(done) {
                var fakeWindow = {
                    postMessage: jasmine.createSpy('postMessage'),
                    close: jasmine.createSpy('close')
                };
                spyOn(window, 'open').and.returnValue(fakeWindow);
                spyOn(window, 'addEventListener');
                instance.setPollTimout(100);

                var result = instance.open('_url_');
                var _onMessage = window.addEventListener.calls.mostRecent().args[1];
                var fakeEvent = {
                    data: 'connected',
                    stopPropagation: jasmine.createSpy('stopPropagation')
                };
                _onMessage(fakeEvent);

                setTimeout(function() {
                    expect(result.ref.StudioDirectHandler).not.toBeDefined();
                    done();
                }, 200);
            });

            it('should request connect until receive connected', function(done) {
                var fakeWindow = {
                    postMessage: jasmine.createSpy('postMessage'),
                    close: jasmine.createSpy('close')
                };
                spyOn(window, 'open').and.returnValue(fakeWindow);
                spyOn(window, 'addEventListener');
                instance.setPollFreq(10);
                instance.open('_url_');
                var _onMessage = window.addEventListener.calls.mostRecent().args[1];

                var attempts = 0;

                setTimeout(function fakeConnectedEvent() {
                    var fakeEvent = {
                        data: 'connected',
                        stopPropagation: jasmine.createSpy('stopPropagation')
                    };
                    _onMessage(fakeEvent);
                    attempts = fakeWindow.postMessage.calls.count();
                    expect(attempts).toBeGreaterThan(0);
                    expect(fakeEvent.stopPropagation).toHaveBeenCalled();
                }, 200);

                setTimeout(function validate() {
                    // verify connect attempts is same
                    expect(attempts).toEqual(fakeWindow.postMessage.calls.count());
                    done();
                }, 500);
            });

            it('should call local methods based on commend received in event after connected', function(done) {
                var fakeWindow = {
                    postMessage: jasmine.createSpy('postMessage'),
                    close: jasmine.createSpy('close')
                };
                spyOn(window, 'open').and.returnValue(fakeWindow);
                spyOn(window, 'addEventListener');
                instance.setPollFreq(10);
                var result = instance.open('_url_');
                result.myCommand = jasmine.createSpy('myCommand');

                var _onMessage = window.addEventListener.calls.mostRecent().args[1];
                setTimeout(function fakeConnectedEvent() {
                    var fakeEvent = {
                        data: 'connected',
                        stopPropagation: jasmine.createSpy('stopPropagation')
                    };
                    _onMessage(fakeEvent);
                }, 20);

                setTimeout(function validate() {
                    var sentEventCommand = {
                        command: 'myCommand'
                    };
                    var fakeEvent = {
                        data: JSON.stringify(sentEventCommand),
                        stopPropagation: jasmine.createSpy('stopPropagation')
                    };
                    _onMessage(fakeEvent);
                    expect(result.myCommand).toHaveBeenCalled();
                    done();
                }, 500);
            });

            it('should call local methods based on commend received in event after connected', function(done) {
                var fakeWindow = {
                    postMessage: jasmine.createSpy('postMessage'),
                    close: jasmine.createSpy('close')
                };
                spyOn(window, 'open').and.returnValue(fakeWindow);
                spyOn(window, 'addEventListener');
                instance.setPollFreq(10);
                var result = instance.open('_url_');
                result.myCommand = jasmine.createSpy('myCommand');

                var _onMessage = window.addEventListener.calls.mostRecent().args[1];
                setTimeout(function fakeConnectedEvent() {
                    var fakeEvent = {
                        data: 'connected',
                        stopPropagation: jasmine.createSpy('stopPropagation')
                    };
                    _onMessage(fakeEvent);
                }, 20);

                setTimeout(function validate() {
                    var sentEventCommand = {
                        command: 'myCommand',
                        args: ['a', 'b', 3]
                    };
                    var fakeEvent = {
                        data: JSON.stringify(sentEventCommand),
                        stopPropagation: jasmine.createSpy('stopPropagation')
                    };
                    _onMessage(fakeEvent);
                    expect(result.myCommand).toHaveBeenCalledWith('a', 'b', 3);
                    done();
                }, 500);

            });

            it('should decorate window with studio direct handler', function(done) {
                var fakeWindow = {
                    postMessage: jasmine.createSpy('postMessage'),
                    close: jasmine.createSpy('close')
                };
                spyOn(window, 'open').and.returnValue(fakeWindow);
                instance.setPollTimout(50);

                var result = instance.open('_url_');

                setTimeout(function() {
                    expect(result.ref.StudioDirectHandler).toBeDefined();
                    done();
                }, 200);
            });

            describe('returns', function () {
                describe('close', function () {
                    it('should exist', function () {
                        var fakeWindow = {
                            postMessage: jasmine.createSpy('postMessage'),
                            close: jasmine.createSpy('close')
                        };
                        spyOn(window, 'open').and.returnValue(fakeWindow);

                        var result = instance.open('_url_');

                        expect(result.close).toBeDefined();
                        result.close();
                    });

                    it('should close composed window', function () {
                        var fakeWindow = {
                            postMessage: jasmine.createSpy('postMessage'),
                            close: jasmine.createSpy('close')
                        };
                        spyOn(window, 'open').and.returnValue(fakeWindow);
                        var result = instance.open('_url_');

                        result.close();

                        expect(fakeWindow.close).toHaveBeenCalled();
                    });
                });
            });
        });
    });
});

