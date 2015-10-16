define(function(require) {
    'use strict';

    var module = require('./../../../../module'),
        poller = require('./utils/poller');

    /**
     * Proxy class for window, which encapsulating the Studio communication logic.
     *
     * Ideally this logic would be a full Proxy object:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
     *
     * @memberof app
     * @ngdoc service
     * @name studioWindow
     * @ngInject
     */
    module.service('studioWindow', ['$window', function($window) {
        var DEFAULT_WINDOW_NAME = 'mixpo_studio';
        var POLL_FREQ = 500;
        var POLL_TIMOUT = 5000;
        var phases = {
            CONNECTING: 'connecting',
            CONNECTED: 'connected',
            LEGACY: 'legacy'
        };

        /**
         * overrides the Frequency of connections polls
         *
         * @param freqMs - poll frequency in ms
         */
        function setPollFreq (freqMs) {
            POLL_FREQ = freqMs;
        }

        /**
         * overrides the timeout duration for connection polling
         *
         * @param timeoutMs - timeout in ms
         */
        function setPollTimout (timeoutMs) {
            POLL_TIMOUT = timeoutMs;
        }

        /**
         * Opens window that hosts Studio and returns the window reference.
         *
         * @example
         * // returns studioWindowObjectReference
         * studioWindow.open(strUrl, strWindowName, [strWindowFeatures]);
         *
         * @param {string} strUrl - The URL to be loaded in the newly opened window. strUrl can be an HTML document on the web,
         * image file or any resource supported by the browser.
         * @param {string} strWindowName - A string name for the new window. The name can be used as the target of links and
         * forms using the target attribute of an <a> or <form> element. The name should not contain any whitespace characters.
         * Note that strWindowName does not specify the title of the new window.
         * @param {string} strWindowFeatures - An optional parameter listing the features (size, position, scrollbars, etc.) of
         * the new window as a string. The string must not contain any whitespace, and each feature name and its value must be
         * separated by a comma. See Position and size features below for details.
         * @returns {Object} A reference to the newly created window. If the call failed, it will be null.
         * The reference can be used to access properties and methods of the new window provided it complies with Same origin
         * policy security requirements.
         */
        function open (strUrl, strWindowName, strWindowFeatures) {
            // default to a common windowName if not set
            if (strWindowName === undefined) {
                strWindowName = DEFAULT_WINDOW_NAME;
            }

            /**
             * Builder a poller with default value and handle fallback scenario
             * if timeout is reached.
             *
             * @returns {*}
             */
            function createPoller(tabWindow) {
                return poller(POLL_FREQ, POLL_TIMOUT, function(err) {
                    if(err) {
                        if(err === 'timeout') {
                            // use fallback
                            $window.removeEventListener('message', onMessage);
                            setPhase(phases.LEGACY);
                            createStudioDirectHandler(tabWindow);
                        }
                        return polling.stop();
                    }
                    tabWindow.postMessage('connect', '*');
                });
            }

            /**
             * phase setter helper
             * @param {string} newPhase - the new phase
             */
            function setPhase(newPhase) {
                phase = newPhase;
            }

            /**
             * construct the legacy StudioDirectHandler window object, this will NOT
             * function property locally unless if there are any crossdomain issues.
             *
             * @param {Object} tabWindow
             * @return {Object}
             */
            function createStudioDirectHandler(tabWindow) {
                tabWindow.StudioDirectHandler = (function(){
                    return {
                        execute: execute
                    };
                })();
            }

            /**
             * routes commands to local methods
             *
             * @param command
             * @param args
             */
            function execute(command, args) {
                if(self[command] === undefined) {
                    return;
                }
                self[command].apply(null, args);
            }

            /**
             * postMessage handler which routes messages depending on the phase.
             *
             * @param event
             */
            function onMessage(event) {
                if(phase === phases.CONNECTING) {
                    processConnectingMessage(event);
                } else if(phase === phases.CONNECTED) {
                    processConnectedMessage(event);
                }
            }

            /**
             * event processing logic for the CONNECTING phase.
             *
             * @param event
             */
            function processConnectingMessage(event) {
                if(event.data !== phases.CONNECTED) {
                    return; // ignore all message while connecting other then 'connected'.
                }

                // we are connected!
                polling.stop();
                event.stopPropagation();
                setPhase(phases.CONNECTED);
            }

            /**
             * event processing logic for the CONNECTED phase.
             *
             * @param event
             */
            function processConnectedMessage(event) {
                var data = JSON.parse(event.data);
                execute(data.command, toArray(data.args));
            }

            /**
             * Helper method to convert the object arrays back to Arrays
             *
             * @param {Object} obj - array after JSON parsing
             * @returns {Array}
             */
            function toArray(obj) {
                var array = [];
                for(var p in obj){
                    array.push(obj[p]);
                }
                return array;
            }

            // set the initial phase
            var phase = phases.CONNECTING;

            // internal windows object
            var tabWindow = $window.open(strUrl, strWindowName, strWindowFeatures);

            // start polling, timeout and fallback encapsulated in method
            var polling = createPoller(tabWindow);
            polling.start();

            // listen for postMessages
            $window.addEventListener('message', onMessage, false);

            var self = {
                ref: tabWindow,
                close: function close() {
                    if (phase === phases.CONNECTING) {
                        polling.stop();
                    } else if (phase === phases.CONNECTED) {
                        $window.removeEventListener('message', onMessage);
                    } else if (phase === phases.LEGACY) {

                    }
                    return tabWindow.close();
                }
            };
            return self;
        }

        return {
            DEFAULT_WINDOW_NAME: DEFAULT_WINDOW_NAME,
            setPollFreq: setPollFreq,
            setPollTimout: setPollTimout,
            open: open
        };
    }]);
});
