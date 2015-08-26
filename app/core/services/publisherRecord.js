define(function (require) {
    'use strict';

    var module = require('./../module');

    var apiConfig = {
        version: 'crud',
        endpoint: 'clients/{id}/publishers'
    };


    module.service('publisherRecordService', ['recordPoolFactory', function (recordPoolFactory) {
        return recordPoolFactory(apiConfig);
    }]);
});

