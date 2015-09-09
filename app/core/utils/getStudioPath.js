define(function(require) {
    'use strict';

    var module = require('./../module');

    /**
     * Gets the studio path, 'path' is used to be like $location usage
     *
     * @memberof app
     * @ngdoc service
     * @name newCreativeService
     * @ngInject
     */
    module.service('getStudioPath', ['$location', function($location) {
        return function(path) {
            if(!!!path) {
                path = $location.path();
            }

            if (path.indexOf('studio') > -1) {
                return '//' + path;
            } else if (path.indexOf('mixpo.com') > -1) {
                return '//' + path.replace(/(w*)\.mixpo\.com/, '$1-studio.mixpo.com');
            } else {
                return '//studio.mixpo.com';
            }
        };
    }]);
});
