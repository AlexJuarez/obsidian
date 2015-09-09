define(function (require) {
    'use strict';

    var module = require('./../module');

    var apiConfig = {
        version: 'crud',
        endpoint: 'campaigns/{id}'
    };


    module.service('campaignRecordService', ['recordPoolFactory', function (recordPoolFactory) {
        return recordPoolFactory(apiConfig);
    }]);
});
