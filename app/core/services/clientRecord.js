define(function (require) {
    'use strict';

    var module = require('./../module');

    var apiConfig = {
        update: {
            version: 'crud',
            endpoint: 'clients/{id}'
        },
        create: {
            version: 'crud',
            endpoint: 'clients'
        }
    };


    module.service('clientRecordService', ['recordPoolFactory', function (recordPoolFactory) {
        return recordPoolFactory(apiConfig);
    }]);
});
