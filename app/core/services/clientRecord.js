define(function (require) {
    'use strict';

    var module = require('./../module');

    var apiConfig = {
        version: 'crud',
        endpoint: 'clients'
    };


    module.service('clientRecordService', ['recordPoolFactory', '$q', function (recordPoolFactory) {
        return recordPoolFactory(apiConfig);
    }]);
});
