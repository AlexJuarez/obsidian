define(function (require) {
    'use strict';

    var module = require('./../module');

    var apiConfig = {
        version: 'crud',
        endpoint: 'campaigns'
    };


    module.service('campaignRecordService', ['recordPoolFactory', '$q', function (recordPoolFactory) {
        return recordPoolFactory(apiConfig);
    }]);
});
