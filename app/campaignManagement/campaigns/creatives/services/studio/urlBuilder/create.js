define(function() {
    'use strict';

    /**
     * Create a new ad from scratch using the provided options.
     *
     * @param {Object} requires $httpParamSerializer
     * @param {string} The ad type ID | IDRM | MLQ | IDMLQ | IS
     * @param {string} The ad environment multiscreen | desktop | tabletphone | inappmraid
     * @param {string} The title of the ad
     * @param {string} The clickthrough url
     * @returns {Object} builder
     */
    return function($httpParamSerializer, adType, environment, title, clickthroughUrl) {
        var _hostname;
        var _path = '/studio';
        var _params = {
            sdf: 'new',
            ad: adType,
            env: environment,
            title: title,
            url: clickthroughUrl
        };

        return {
            /**
             * Set the hostname to use
             *
             * @param {string} hostname
             * @returns {Object} builder
             */
            setHostname: function setHostname(hostname) {
                _hostname = hostname;
                return this;
            },

            /**
             * Set the path to use
             *
             * @param {string} path
             * @returns {Object} builder
             */
            setPath: function setPath(path) {
                _path = path;
                return this;
            },

            /**
             * Set the interactive display width
             *
             * @param value
             * @returns {Object} builder
             */
            setIdWidth: function setIdWidth(value) {
                _params.idw = value;
                return this;
            },

            /**
             * Sets the interactive display height
             *
             * @param value
             * @returns {Object} builder
             */
            setIdHeight: function setIdHeight(value) {
                _params.idh = value;
                return this;
            },

            /**
             * Set the timeline canvas width
             * @param value
             * @returns {Object} builder
             */
            setTcWidth: function setTcWidth(value) {
                _params.tcw = value;
                return this;
            },

            /**
             * Sets the timeline canvas height
             * @param value
             * @returns {Object} builder
             */
            setTcHeight: function setTcHeight(value) {
                _params.tch = value;
                return this;
            },

            /**
             * Set the filter
             *
             * @param {Object} params handed to Studio via flashvars
             */
            setFilter: function setFilter(filter) {
                _params.filter = JSON.stringify(filter);
                return this;
            },

            /**
             * build the url
             *
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
