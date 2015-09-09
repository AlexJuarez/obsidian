define(function (require) {
    'use strict';

    var module = require('./../module');

    var apiConfig = {
        version: 'crud',
        endpoint: 'accounts/{id}'
    };


    module.service('accountRecordService', ['recordPoolFactory', function (recordPoolFactory) {
        return recordPoolFactory(apiConfig);
    }]);
});
