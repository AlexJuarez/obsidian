define(function (require) {
    'use strict';

    var module = require('./../module');

    var apiConfig = {
        version: 'crud',
        endpoint: 'divisions'
    };


    module.service('divisionRecordService', ['recordPoolFactory', '$q', function (recordPoolFactory) {
        return recordPoolFactory(apiConfig);
    }]);
});
