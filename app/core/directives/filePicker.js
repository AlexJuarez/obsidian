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
                scope.btnLabel = 'browse';
                var filePickerWrapper = elem.find('.file-picker')[0];
                
                var uploader = new ss.SimpleUpload({
                    button: elem.find('.btn'),
                    name: 'filename',
                    //url: 'uploadHandler.php',
                    hoverClass: 'ui-state-hover',
                    dropzone: elem.find('.droparea'),
                    dragClass: 'drag-over',
                    responseType: 'json',
                    maxSize: 1024,
                    accept: 'image/*',
                    allowedExtensions: ['jpg', 'jpeg', 'png', 'gif'],
                    queue: false,
                    //multipart: true,
                    debug: true,
                    onChange: function (filename) {
                        console.log('onChange: ', filename);
                        //var previewImg = elem.find('.image-preview')[0];
                        //previewImg.src = filename;

                        //return false;
                    },
                    onSubmit: function (filename) {

                        var progressWrapper = document.createElement('div'),
                            progressBar = document.createElement('div'),
                            sizeBox = document.createElement('div'),
                            fileNameWrapper = document.createElement('div'),
                            fileName = document.createElement('span'),
                            removeFile = document.createElement('a'),
                            self = this;

                        progressWrapper.className = 'progress-wrapper';
                        progressBar.className = 'progress-bar';
                        sizeBox.className = 'size-box';
                        fileNameWrapper.className = 'file-name-wrapper';
                        fileName.className = 'file-name';
                        removeFile.className = 'glyph-icon glyph-close';
                        removeFile.href = '';

                        removeFile.setAttribute('ng-click', 'remove()');

                        // Not sure if this should be handled differently
                        fileName.innerHTML = filename;

                        fileNameWrapper.appendChild(fileName);
                        fileNameWrapper.appendChild(removeFile);
                        filePickerWrapper.appendChild(fileNameWrapper);
                        progressWrapper.appendChild(progressBar);
                        progressWrapper.appendChild(sizeBox);
                        filePickerWrapper.appendChild(progressWrapper);

                        self.setFileSizeBox(sizeBox);
                        self.setProgressBar(progressBar);
                        //self.setProgressContainer(progressWrapper);

                        //btn.value = 'Replace File';
                    },
                    onComplete: function (filename) {
                        console.log('onComplete');
                        ngModel.$setViewValue(filename);
                    },
                    onError: function (filename, response) {
                        console.log('onError ' + filename, response);
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
