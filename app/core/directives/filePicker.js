define(function (require) {
    'use strict';

    var app = require('./../module');
    //Check https://github.com/LPology/Simple-Ajax-Uploader for docs
    var ss = require('simpleUpload');

    require('tpl!./filePicker.html');

    app.directive('filePicker', [function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            scope: {
                preview: '='
            },
            transclude: true,
            templateUrl: 'core/directives/filePicker.html',
            link: function (scope, elem, attrs, ngModel) {
                scope.btnLabel = 'Choose a File';

                var uploader = new ss.SimpleUpload({
                    button: elem.find('.btn'),
                    name: 'filename',
                    hoverClass: 'ui-state-hover',
                    dropzone: elem.find('.droparea'),
                    responseType: 'json',
                    onComplete: function (filename, response) {
                        console.log(filename);
                        ngModel.$setViewValue(filename);
                    },
                    onError: function (filename, errorType, status, statusText, response) {
                        console.log(filename);
                        ngModel.$setViewValue(filename);
                    }
                });

                scope.$on('$destroy', function () {
                    uploader.destroy();
                });

            }
        };
    }]);
});
