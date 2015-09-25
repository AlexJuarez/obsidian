define(function (require) {
    'use strict';

    var module = require('./../module');

    var apiConfig = {
        update: {
            version: 'crud',
            endpoint: 'campaigns/{{id}}'
        },
        create: {
            version: 'crud',
            endpoint: 'campaigns'
        }
    };


    module.service('campaignRecordService', ['recordPoolFactory', function (recordPoolFactory) {
        return recordPoolFactory(apiConfig);
    }]);
});
