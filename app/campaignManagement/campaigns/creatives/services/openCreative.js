define(function(require) {
    'use strict';

    var module = require('./../../../module');

    /**
     * The openCreativeService wraps the setup of opening Studio in a
     * new tab and creating the expected JS callback object Studio's
     * js is looking for.
     *
     * @memberof app
     * @ngdoc service
     * @name newCreativeService
     * @ngInject
     */
    module.service('openCreativeService', ['$q', '$window', 'studioUrlBuilder',
        function($q, $window, studioUrlBuilder) {
            function buildUrl(creative, hostname) {
                return studioUrlBuilder.open(creative.id, creative.campaignId)
                    .setHostname(hostname)
                    .build();
            }

            function createPoller(tickMs, timeoutMs, onTick, onTimeout) {
                var poll, timeout;

                function start() {
                    poll = setInterval(onTick, tickMs);
                    timeout = setInterval(function() {
                        stop();
                        onTimeout();
                    }, timeoutMs);
                    return this;
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

            function createFallbackHandler(tabWindow, deferred) {
                tabWindow.StudioDirectHandler = (function(){
                    function onClose(code, detail) {
                        if(code && detail) {
                            //return deferred.reject(err);
                        }
                        tabWindow.close();
                        deferred.resolve();
                    }

                    return {
                        onClose: onClose
                    };
                })();
            }

            function studioConnector(window, tabWindow, callback) {
                // poll for connection
                var poller = createPoller(500, 3000, function onTick() {
                    tabWindow.postMessage('connect', '*');
                }, function onTimeout() {
                    callback('timeout');
                }).start();

                function onMessage(event) {
                    // security?
                    //if (event.origin !== "http://example.org")
                    //   return;

                    if(event.data !== 'connected') {
                        return;
                    }

                    poller.stop();
                    window.removeEventListener('message', onMessage);
                    callback(null, function(subscriber) {
                        function onConvert(event) {
                            var data = JSON.parse(event.data);
                            subscriber(data.command, data.data);
                        }
                        window.addEventListener('message', onConvert, false);
                    });
                }
                window.addEventListener('message', onMessage, false);
            }

            /**
             * Opens studio and returns a promise.
             *
             * @param creative
             * @returns {Object} promise
             */
            return function(creative, hostname) {
                var deferred = $q.defer();

                var url = buildUrl(creative, hostname);
                var tabWindow = $window.open(
                    url,
                    'mixpo_studio'
                );

                studioConnector(window, tabWindow, function(err, notifier) {
                    if(err) {
                        // studio Connect error does not team open failed,
                        // just that supporting postMessage() failed.
                        createFallbackHandler(tabWindow, deferred);
                        return deferred.promise;
                    }

                    notifier(function(command, data){
                        if(command === 'closeStudio') {
                            tabWindow.close();
                            deferred.resolve(data);
                        } else {
                            // unhandled event type
                        }
                    });
                });
                return deferred.promise;
            };
        }]);
});
