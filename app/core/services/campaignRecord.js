define(function (require) {
    'use strict';

    var module = require('./../module');

    var apiConfig = {
        create: {
            version: 'crud',
            endpoint: 'campaigns/{id}'
        },
        update: {
            version: 'crud',
            endpoint: 'campaigns'
        }
    };


    module.service('campaignRecordService', ['recordPoolFactory', function (recordPoolFactory) {
        return recordPoolFactory(apiConfig);
    }]);
});
