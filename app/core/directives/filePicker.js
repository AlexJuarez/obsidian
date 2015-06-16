define(function (require) {
    'use strict';

    var app = require('./../module');
    //Check https://github.com/LPology/Simple-Ajax-Uploader for docs
    var ss = require('simpleUpload');

    require('tpl!./filePicker.html');

    app.directive('filePicker', [function () {
        return {
            restrict: 'A',
            require: ['^ngModel'],
            scope: {
                preview: '='
            },
            transclude: true,
            templateUrl: 'core/directives/filePicker.html',
            link: function (scope, elem) {
                scope.btnLabel = 'Choose a File';

                var uploader = new ss.SimpleUpload({
                    button: elem.find('.btn'),
                    name: 'filename',
                    hoverClass: 'ui-state-hover',
                    dropzone: elem.find('.droparea'),
                    responseType: 'json'
                });

                scope.$on('$destroy', function () {
                    uploader.destroy();
                });

            }
        };
    }]);
});
