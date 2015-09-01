define(function (require) {
    'use strict';

    var module = require('./../module');

    var apiConfig = {
        version: 'crud',
        endpoint: 'placements'
    };


    module.service('creativeRecordService', ['recordPoolFactory', '$q', function (recordPoolFactory) {
        return recordPoolFactory(apiConfig);
    }]);
});
