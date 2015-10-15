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


                var poller = createPoller(500, 3000, function onTick() {
                    tabWindow.postMessage('connect', '*');
                }, function onTimeout() {
                    createFallbackHandler(tabWindow, deferred);
                }).start();

                function receiveMessage(event) {
                    //if (event.origin !== "http://example.org")
                    //   return;

                    if(event.data === 'connected') {
                        return poller.stop();
                    }

                    console.log(event.data);
                    // expect data as JSON string
                    var cmd = JSON.parse(event.data);
                    if(cmd.command === 'closeStudio') {
                        tabWindow.close();
                        deferred.resolve();
                    } else {
                        // unhandled event type
                    }
                }
                window.addEventListener('message', receiveMessage, false);

                return deferred.promise;
            };
        }]);
});
