define(function (require) {
    'use strict';

    var module = require('./../module');

    var apiConfig = {
        update: {
            version: 'crud',
            endpoint: 'divisions/{id}'
        },
        delete: {
            version: 'crud',
            endpoint: 'divisions'
        }
    };


    module.service('divisionRecordService', ['recordPoolFactory', function (recordPoolFactory) {
        return recordPoolFactory(apiConfig);
    }]);
});
