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
             * @param {string} The campaignId of the ad
             * @returns {Object} builder
             */
            create: function create(adType, environment, title, clickthroughUrl, campaignId) {
                return require('./create')
                    ($httpParamSerializer, adType, environment, title, clickthroughUrl)
                    .setFilter({
                        campaignId: campaignId
                    });
            },

            /**
             * Opens an ad for editing.
             *
             * @param {string} The guid of the source ad
             * @param {string} The campaignId of the source ad
             * @returns {Object} builder
             */
            open: function open(guid, campaignId) {
                return require('./open')
                    ($httpParamSerializer, guid)
                    .setFilter({
                        campaignId: campaignId
                    });
            },

            /**
             * Creates a copy of an ad, using the source as a template.
             *
             * @param {string} The guid of the source ad
             * @param {string} The title of the new ad
             * @param {string} The campaignId of the new ad
             * @returns {Object} builder
             */
            copy: function copy(template, title, campaignId) {
                return require('./copy')
                    ($httpParamSerializer, template, title)
                    .setFilter({
                        campaignId: campaignId
                    });
            },

            /**
             * Select a media item from the media library Fluent url builder
             *
             * @param {string} campaignId The campaignId of the new ad
             * @param {string} adType The ad type SWF, IMG
             * @returns {*}
             */
            mediaselect: function(campaignId, adType) {
                return require('./mediaselect')
                    ($httpParamSerializer)
                    // Studio uses Mixin's to parse the options from the servlet,
                    // after offical params are passed the filter object is
                    // parsed using mixin's, thus any filters can stomp default
                    // values, or in this case fill values which would otherwise
                    // be null.
                    .setFilter({
                        campaignId: campaignId,
                        'sd_adtype': adType
                    });
            }
        };
    }]);
});
