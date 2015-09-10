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
        function getAdType(type, expandedWidth, expandedHeight) {
            if(type === 'IMG') {
                // Image
                return 'IMG';
            } else if(type === 'SWF') {
                // SWF
                return 'SWF';
            }  else if(type === 'ISV') {
                // In-Stream Video
                return 'IS';
            } else if(type === 'RM') {
                // 'Rich Media' AKA 'Interactive-Display'
                if(!isNaN(expandedWidth) && !isNaN(expandedHeight)) {
                    return 'IDRM';
                } else {
                    return 'ID';
                }
            } else if(type === 'IBV') {
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
                case 'multi-screen':
                    return 'multiscreen';
                case 'mobile':
                    return 'tabletphone';
                case 'mraid':
                    return 'inappmraid';
                default: // desktop
                    return env;
            }
        }

        function setDimensions(params, type, embedWidth, embedHeight, expandedWidth, expandedHeight) {
            if(type === 'IBV') {
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
            } else {
                params.idw = embedWidth;
                params.idh = embedHeight;
                if(!isNaN(expandedWidth) && !isNaN(expandedHeight)) {
                    params.tcw = expandedWidth;
                    params.tch = expandedHeight;
                }
            }
        }

        return function(creative) {
            var params = {};
            params.sdf = 'new';
            params.ad = getAdType(creative.type, creative.expandedWidth, creative.expandedHeight);
            params.env = getAdEnvironment(creative.environment);
            params.url = creative.clickthroughUrl;
            params.title = creative.name;
            setDimensions(params, creative.type, creative.embedWidth, creative.embedHeight, creative.expandedWidth, creative.expandedHeight );

            return params;
        };
    }]);
});
