define(function(require) {
    'use strict';

    var module = require('./../../../module');

    /**
     * The newCreativeService returns a promise that creates a new Ad
     * from the settings handed to the service and returns the URL
     * to be opened in a new.
     *
     * @memberof app
     * @ngdoc service
     * @name newCreativeService
     * @ngInject
     */
    module.service('newCreativeService', ['ENUMS', '$httpParamSerializer', '$q', 'studioLocation', 'studioUrlBuilder', function(ENUMS, $httpParamSerializer, $q, studioLocation, studioUrlBuilder) {
        var types = ENUMS.up.creativeTypes;
        var environments = ENUMS.up.creativeEnvironments;

        /**
         * @param creative
         * @returns {Object} builder
         */
        return function(creative) {
            var deferred = $q.defer();
            var hostname = studioLocation.host();
            validate(creative, function(err) {
                if(err) {
                    deferred.reject(err);
                    return;
                }

                var strategy = getAdTypeStrategy(creative.type);
                strategy(creative, hostname, function(err, url){
                    if(err) {
                        deferred.reject(err);
                        return;
                    }
                    deferred.resolve(url);
                });
            });
            return deferred.promise;
        };

        /**
         *
         * @param type - creative.type
         * @returns {Object} Strategy
         */
        function getAdTypeStrategy(type) {
            var strategy = createDefaultAdStrategy; // use default create strategy
            if(type === types.display) {
                // if display image or display swfs, use DisplayAd strategy
                strategy = createDisplayAdStrategy;
            }
            return strategy;
        }

        /**
         * Create Default (Non-DisplayAd) Strategy
         *
         * @param creative
         * @param hostname
         * @param callback
         */
        function createDefaultAdStrategy(creative, hostname, callback) {
            var adType = getAdType(creative.type, creative.subtype, creative.expandedWidth, creative.expandedHeight),
                environment = getAdEnvironment(creative.environment),
                title = creative.name,
                clickthroughUrl = creative.clickthroughUrl,
                campaignId = creative.campaignId;

            var builder = studioUrlBuilder
                .create(adType, environment, title, clickthroughUrl, campaignId)
                .setHostname(hostname);
            setDimensions(builder, creative.type, creative.embedWidth, creative.embedHeight, creative.expandedWidth, creative.expandedHeight);

            callback(null, builder.build());
        }

        /**
         * Create DisplayAd Strategy, for all but Display Ads.
         * Display Ads are special in that they need to supply a MediaItem to the Servlet.
         * Uploading MediaItems is a special Async process.
         *
         * @param creative
         * @param hostname
         * @param callback
         */
        function createDisplayAdStrategy(creative, hostname, callback) {
            var builder = studioUrlBuilder
                .mediaselect() // TODO(Hays) will need to update the mediaselect()
                .setHostname(hostname);

            callback(null, builder.build());
        }

        /**
         * Validates the Creative
         *
         * @param creative
         * @param callback
         */
        function validate(creative, callback) {
            if(!creative) {
                callback('creative is required');
                return;
            }
            if(getAdType(creative.type, creative.subtype, creative.expandedWidth, creative.expandedHeight)===null) {
                callback('invalid adType');
                return;
            }
            if(getAdEnvironment(creative.environment)===null||creative.environment===undefined) {
                callback('invalid environment');
                return;
            }
            if(creative.clickthroughUrl===null||creative.clickthroughUrl===undefined) {
                callback('clickthough url is required');
                return;
            }
            if(creative.name===null||creative.name===undefined) {
                callback('name is required');
                return;
            }
            callback(null);
        }

        function getAdType(type, subtype, expandedWidth, expandedHeight) {
            if(type === types.display && subtype === 'IMG') {
                // Image
                return 'IMG';
            } else if(type === types.display && subtype === 'SWF') {
                // SWF
                return 'SWF';
            }  else if(type === types.inStream) {
                // In-Stream Video
                return 'IS';
            } else if(type === types.richMedia) {
                // 'Rich Media' AKA 'Interactive-Display'
                if(!isNaN(expandedWidth) && !isNaN(expandedHeight)) {
                    return 'IDRM';
                } else {
                    return 'ID';
                }
            } else if(type === types.inBannerVideo) {
                // 'In-Banner Video' AKA 'MLQ'
                if(!isNaN(expandedWidth) && !isNaN(expandedHeight)) {
                    return 'IDMLQ';
                } else {
                    return 'MLQ';
                }
            } else {
                // unknown
                return null;
            }
        }

        function getAdEnvironment(env) {
            switch(env) {
                case environments.all:
                    return 'multiscreen';
                case environments.mobile:
                    return 'tabletphone';
                case environments.mraid:
                    return 'inappmraid';
                case environments.desktop:
                    return 'desktop';
                default:
                    // unknown
                    return null;
            }
        }

        function setDimensions(studioUrlBuilder, type, embedWidth, embedHeight, expandedWidth, expandedHeight) {
            if(type === types.inBannerVideo) {
                if(!isNaN(expandedWidth) && !isNaN(expandedHeight)) {
                    // IDMLQ
                    studioUrlBuilder.setIdWidth(embedWidth);
                    studioUrlBuilder.setIdHeight(embedHeight);
                    studioUrlBuilder.setTcWidth(expandedWidth);
                    studioUrlBuilder.setTcHeight(expandedHeight);
                } else {
                    // MLQ
                    studioUrlBuilder.setTcWidth(embedWidth);
                    studioUrlBuilder.setTcHeight(embedHeight);
                }
            } else if(type === types.inStream) {
                // IS
                studioUrlBuilder.setTcWidth(embedWidth);
                studioUrlBuilder.setTcHeight(embedHeight);
            } else {
                studioUrlBuilder.setIdWidth(embedWidth);
                studioUrlBuilder.setIdHeight(embedHeight);
                if(!isNaN(expandedWidth) && !isNaN(expandedHeight)) {
                    studioUrlBuilder.setTcWidth(expandedWidth);
                    studioUrlBuilder.setTcHeight(expandedHeight);
                }
            }
        }
    }]);
});
