define(function (require) {
    'use strict';

    var module = require('./../module');

    var apiConfig = {
        update: {
            version: 'crud',
            endpoint: 'placements/{id}'
        },
        create: {
            version: 'crud',
            endpoint: 'placements'
        }
    };

    module.service('placementRecordService', ['recordPoolFactory', function (recordPoolFactory) {
        return recordPoolFactory(apiConfig);
    }]);
});
