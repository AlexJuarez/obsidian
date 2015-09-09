define(function (require) {
    'use strict';

    var module = require('./../module');

    module.service('studioUrl', ['$window', function ($window) {
        return function () {
            var domain = $window.location.hostname;

            if (domain.indexOf('studio') > -1) {
                return '//' + domain;
            } else if (domain.indexOf('mixpo.com') > -1) {
                return '//' + domain.replace(/(w*)\.mixpo\.com/, '$1-studio.mixpo.com');
            } else {
                return '//studio.mixpo.com';
            }
        };
    }]);
});
