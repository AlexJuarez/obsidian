define(function() {
    'use strict';

    /**
     * Opens an ad for editing.
     *
     * @param {Object} requires $httpParamSerializer
     * @param {string} The guid of the source ad
     * @returns {Object} builder
     */
    return function($httpParamSerializer, guid) {
        var _hostname;
        var _path = '/studio';
        var _params = {
            sdf: 'open',
            guid: guid,
        };

        return {
            /**
             * Set the hostname to use
             * @param {string} hostname
             */
            setHostname: function setHostname(hostname) {
                _hostname = hostname;
                return this;
            },

            /**
             * Set the path to use
             * @param {string} path
             */
            setPath: function setPath(path) {
                _path = path;
                return this;
            },

            /**
             * Set the filter
             * @param {Object} params handed to Studio via flashvars
             */
            setFilter: function setFilter(filter) {
                _params.filter = JSON.stringify(filter);
                return this;
            },

            /**
             * build the url
             * @returns {string} url
             */
            build: function build() {
                var url = _hostname || '';
                url += _path;
                url += '?' + $httpParamSerializer(_params);
                return url;
            }
        };
    };
});
