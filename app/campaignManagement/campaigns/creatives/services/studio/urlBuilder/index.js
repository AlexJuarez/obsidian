define(function(require) {
    'use strict';

    var module = require('./../../../../../module');

    /**
     * Studio Url Builder
     *
     * @memberof app
     * @ngdoc service
     * @name studioUrlBuilder
     * @ngInject
     */
    module.service('studioUrlBuilder', ['$httpParamSerializer', function ($httpParamSerializer) {
        return {
            /**
             * Create a new ad from scratch using the provided options.
             *
             * @param {string} The ad type ID | IDRM | MLQ | IDMLQ | IS
             * @param {string} The ad environment multiscreen | desktop | tabletphone | inappmraid
             * @param {string} The title of the ad
             * @param {string} The clickthrough url
             * @returns {Object} builder
             */
            create: function create(adType, environment, title, clickthroughUrl) {
                return require('./create')
                    ($httpParamSerializer, adType, environment, title, clickthroughUrl);
            },

            /**
             * Opens an ad for editing.
             *
             * @param {string} The guid of the source ad
             * @returns {Object} builder
             */
            open: function open(guid) {
                return require('./open')
                    ($httpParamSerializer, guid);
            },

            /**
             * Creates a copy of an ad, using the source as a template.
             *
             * @param {string} The guid of the source ad
             * @param {string} The title of the new ad
             * @returns {Object} builder
             */
            copy: function copy(template, title) {
                return require('./copy')
                    ($httpParamSerializer, template, title);
            },

            /**
             * Select a media item from the media library Fluent url builder
             *
             * @returns {Object} builder
             */
            mediaselect: function() {
                return require('./mediaselect')
                    ($httpParamSerializer);
            }
        };
    }]);
});
