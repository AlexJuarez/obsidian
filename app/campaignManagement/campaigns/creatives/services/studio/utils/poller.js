define(function() {
    'use strict';

    /**
     * Polling helper object that has frequency and timeout
     *
     * @param {Number} frequencyMs - duration in ms for each poll
     * @param {Number} timeoutMs - duration before stopping and erroring 'timeout'
     * @param callback
     * @returns {{start: start, stop: stop}}
     */
    return function poller(frequencyMs, timeoutMs, callback) {
        var poll, timeout;

        function start() {
            poll = setInterval(function onTick(){
                callback();
            }, frequencyMs);

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
    };
});
