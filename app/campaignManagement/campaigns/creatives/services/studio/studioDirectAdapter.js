define(function(require) {
    'use strict';

    var module = require('./../../../../module');

    /**
     * The studioDirectAdapter adapt the newEditCreative.js params object to
     * Studio Direct's params API.
     *
     * @memberof app
     * @ngdoc service
     * @name studioDirectAdapter
     * @ngInject
     */
    module.service('studioDirectAdapter', ['ENUMS', function (ENUMS) {
        var types = ENUMS.up.creativeTypes;
        var environments = ENUMS.up.creativeEnvironments;
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

        function setDimensions(params, type, embedWidth, embedHeight, expandedWidth, expandedHeight) {
            if(type === types.inBannerVideo) {
                if(!isNaN(expandedWidth) && !isNaN(expandedHeight)) {
                    // IDMLQ
                    params.idw = embedWidth;
                    params.idh = embedHeight;
                    params.tcw = expandedWidth;
                    params.tch = expandedHeight;
                } else {
                    // MLQ
                    params.tcw = embedWidth;
                    params.tch = embedHeight;
                }
            } else if(type === types.inStream) {
                // IS
                params.tcw = embedWidth;
                params.tch = embedHeight;
            } else {
                params.idw = embedWidth;
                params.idh = embedHeight;
                if(!isNaN(expandedWidth) && !isNaN(expandedHeight)) {
                    params.tcw = expandedWidth;
                    params.tch = expandedHeight;
                }
            }
        }

        function validate(creative) {
            if(!creative) {
                return false;
            }

            if(getAdType(creative.type, creative.subtype, creative.expandedWidth, creative.expandedHeight)===null) {
                return false;
            }
            if(getAdEnvironment(creative.environment)===null) {
                return false;
            }
            if(creative.clickthroughUrl===null) {
                return false;
            }
            if(creative.name===null) {
                return false;
            }
            return true;
        }

        return function(creative) {
            if(!validate(creative)) {
                return null;
            }
            var params = {};
            params.sdf = 'new';
            params.ad = getAdType(creative.type, creative.subtype, creative.expandedWidth, creative.expandedHeight);
            params.env = getAdEnvironment(creative.environment);
            params.url = creative.clickthroughUrl;
            params.title = creative.name;
            setDimensions(params, creative.type, creative.embedWidth, creative.embedHeight, creative.expandedWidth, creative.expandedHeight);
            return params;
        };
    }]);
});
