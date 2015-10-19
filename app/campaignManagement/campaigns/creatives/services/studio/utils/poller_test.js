define(function (require) {
    'use strict';

    describe('poller', function () {
        var poller, callback;

        beforeEach(function () {
            poller = require('./poller');
            callback = jasmine.createSpy('callback');
        });

        it('should be require-able', function () {
            expect(poller).toBeDefined();
        });

        it('should be able to set frequency of polling', function (done) {
            var poll = poller(100, 1000, callback);
            poll.start();

            setTimeout(function() {
                expect(callback.calls.count()).toBeGreaterThan(1); // for slow machines
                expect(callback.calls.count()).toBeLessThan(15); // for fast machines
                poll.stop();
                done();
            }, 1000);
        });
        
        it('should be able to set timeout duration of polling resulting in expected number of poll calls', function (done) {
            var poll = poller(100, 1000, callback);
            poll.start();

            setTimeout(function() {
                expect(callback.calls.count()).toBeGreaterThan(1); // for slow machines
                expect(callback.calls.count()).toBeLessThan(15); // for fast machines
                poll.stop();
                done();
            }, 2000);
        });

        it('should follow nodejs style return err of \'timeout\' timeout is reached', function (done) {
            var poll = poller(100, 1000, callback);
            poll.start();

            setTimeout(function() {
                expect(callback.calls.mostRecent().args[0]).toEqual('timeout');
                poll.stop();
                done();
            }, 2000);
        });

        describe('returns', function () {
            describe('start', function () {
                it('should be defined', function () {
                    var poll = poller(10, 20, callback);
                    expect(poll.start).toBeDefined();
                });

                it('should start polling', function (done) {
                    var poll = poller(100, 1000, callback);
                    poll.start();

                    setTimeout(function() {
                        expect(callback).toHaveBeenCalled();
                        poll.stop();
                        done();
                    }, 2000);
                });

                it('should not poll if start was never called', function (done) {
                    var poll = poller(100, 1000, callback);

                    setTimeout(function() {
                        expect(callback).not.toHaveBeenCalled();
                        poll.stop();
                        done();
                    }, 2000);
                });
            });

            describe('stop', function () {
                it('should be defined', function () {
                    var poll = poller(10, 20, callback);
                    expect(poll.stop).toBeDefined();
                });

                it('should stop polling', function (done) {
                    var poll = poller(100, 1000, callback);
                    poll.start();
                    poll.stop();

                    setTimeout(function() {
                        expect(callback).not.toHaveBeenCalled();
                        done();
                    }, 2000);
                });
            });
        });
    });
});
