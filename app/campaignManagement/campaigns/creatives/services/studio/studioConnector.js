define(function(require) {
    'use strict';

    var module = require('./../../../../module');

    /**
     * StudioConnection starts a postMessage dialog with the
     * window object and wraps the polling logic needed to
     * connect to the newly created tab as there is no
     * onLoad support for sandboxed windows.
     *
     * @memberof app
     * @ngdoc service
     * @name studioConnector
     * @ngInject
     */
    module.service('studioConnector', [function() {
        function createPolling(tickMs, timeoutMs, callback) {
            var poll, timeout;

            function start() {
                poll = setInterval(function onTick(){
                    callback(null);
                }, tickMs);
                timeout = setInterval(function onTimeout() {
                    stop();
                    callback('timeout');
                }, timeoutMs);
            }

            function stop() {
                clearInterval(poll);
                clearInterval(timeout);
            }

            return {
                start: start,
                stop: stop
            };
        }

        /**
         * Opens studio and returns a promise.
         *
         * @param creative
         * @returns {Object} promise
         */
        return function(window, tabWindow, callback) {
            var CONNECTING = 'connecting';
            var MESSAGING = 'messaging';

            var phase = CONNECTING,
                messenger;

            // poll for connection
            var polling = createPolling(500, 3000, function(err) {
                if(err) {
                    return callback(err);
                }
                tabWindow.postMessage('connect', '*');
            });
            polling.start();

            function onMessage(event) {
                // security?
                //if (event.origin !== "http://example.org")
                //   return;
                if(phase === CONNECTING) {
                    if(event.data !== 'connected') {
                        return;
                    }
                    polling.stop();
                    event.stopPropagation();
                    startMessaging();
                } else if(messenger) {
                    var data = JSON.parse(event.data);
                    messenger(data.command, data.data);
                }
            }
            window.addEventListener('message', onMessage, false);

            function startMessaging() {
                phase = MESSAGING;
                callback(null, function(target) {
                    messenger = target;
                });
            }

            function getPhase() {
                return phase;
            }

            function shutdown() {
                polling.stop();
                window.removeEventListener('message', onMessage);
            }

            return {
                getPhase: getPhase,
                shutdown: shutdown
            };
        };
    }]);
});
