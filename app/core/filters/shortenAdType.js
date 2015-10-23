define(function (require) {
    'use strict';

    var app = require('./../module');

    app.filter('shortenAdType', ['ENUMS', function (ENUMS) {
        var creativeTypes = ENUMS.up.creativeTypes;
        return function (data, containerType) {
            switch (data) {
                case creativeTypes.inBannerVideo:
                    return 'IBV';
                case creativeTypes.inStream:
                    return 'ISV';
                case creativeTypes.display:
                    return containerType || 'IMG/SWF';
                case creativeTypes.richMedia:
                    return 'RM';
                default:
                    return 'Unknown';
            }
        };
    }]);
});
