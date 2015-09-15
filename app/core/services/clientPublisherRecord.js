define(function (require) {
    'use strict';

    var module = require('./../module');

    var apiConfig = {
        update: {
            version: 'crud',
            endpoint: 'clients/{id}/publishers'
        },
        create: {}
    };


    module.service('clientPublisherRecordService', ['recordPoolFactory', function (recordPoolFactory) {
        return recordPoolFactory(apiConfig);
    }]);
});

