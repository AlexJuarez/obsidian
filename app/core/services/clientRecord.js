define(function (require) {
    'use strict';

    var module = require('./../module');

    var apiConfig = {
        version: 'crud',
        endpoint: 'clients/{id}'
    };


    module.service('clientRecordService', ['recordPoolFactory', function (recordPoolFactory) {
        return recordPoolFactory(apiConfig);
    }]);
});
