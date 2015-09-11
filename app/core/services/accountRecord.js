define(function (require) {
    'use strict';

    var module = require('./../module');

    var apiConfig = {
        create: {
            version: 'crud',
            endpoint: 'accounts/{id}'
        },
        update: {
            version: 'crud',
            endpoint: 'accounts'
        }
    };


    module.service('accountRecordService', ['recordPoolFactory', function (recordPoolFactory) {
        return recordPoolFactory(apiConfig);
    }]);
});
