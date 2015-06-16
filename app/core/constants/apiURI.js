define(function (require) {
    'use strict';

    var module = require('./../module');

    var apiURI = (window.apiURI && window.apiURI) || '';

    module.constant('API_URI', apiURI);
});
