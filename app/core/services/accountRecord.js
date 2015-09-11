define(function (require) {
    'use strict';

    var module = require('./../module');

    var apiConfig = {
        update: {
            version: 'crud',
            endpoint: 'accounts/{id}'
        },
        create: {
            version: 'crud',
            endpoint: 'accounts'
        }
    };

    module.service('accountRecordService', ['recordPoolFactory', function (recordPoolFactory) {
        return recordPoolFactory(apiConfig);
    }]);
});
