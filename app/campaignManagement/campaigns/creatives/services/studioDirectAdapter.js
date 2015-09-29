define(function(require) {
    'use strict';

    var module = require('./../../../module');

    /**
     * The studioDirectAdapter adapt the newEditCreative.js params object to
     * Studio Direct's params API.
     *
     * @memberof app
     * @ngdoc service
     * @name studioDirectAdapter
     * @ngInject
     */
    module.service('studioDirectAdapter', [function () {
        function getAdType(type, subtype, expandedWidth, expandedHeight) {
            if(type === 'Display' && subtype === 'IMG') {
                // Image
                return 'IMG';
            } else if(type === 'Display' && subtype === 'SWF') {
                // SWF
                return 'SWF';
            }  else if(type === 'In-Stream') {
                // In-Stream Video
                return 'IS';
            } else if(type === 'Rich Media') {
                // 'Rich Media' AKA 'Interactive-Display'
                if(!isNaN(expandedWidth) && !isNaN(expandedHeight)) {
                    return 'IDRM';
                } else {
                    return 'ID';
                }
            } else if(type === 'In-Banner') {
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
                case 'multidevice':
                    return 'multiscreen';
                case 'mobile':
                    return 'tabletphone';
                case 'tablet':
                    return 'inappmraid';
                case 'desktop':
                    return 'desktop';
                default:
                    // unknown
                    return null;
            }
        }

        function setDimensions(params, type, embedWidth, embedHeight, expandedWidth, expandedHeight) {
            if(type === 'In-Banner') {
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
            } else if(type === 'ISV') {
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
            if(!!!creative) {
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
