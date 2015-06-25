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
                scope.fileSelected = false;
                scope.btnLabel = 'browse';
                
                var filePickerWrapper = elem.find('.file-picker')[0],
                previewImg = elem.find('.image-preview')[0],
                fileName = elem.find('.file-name')[0];

                var uploader = new ss.SimpleUpload({
                    button: elem.find('.btn'),
                    name: 'filename',
                    //url: 'uploadHandler.php',
                    hoverClass: 'ui-state-hover',
                    dropzone: elem.find('.droparea'),
                    dragClass: 'drag-over',
                    responseType: 'json',
                    maxSize: 2000,
                    accept: 'image/*',
                    allowedExtensions: ['jpg', 'jpeg', 'png', 'gif'],
                    queue: true,
                    multiple: false,
                    multipart: true,
                    autoSubmit: false,
                    debug: true,
                    onChange: function (filename) {
                        
                        // Make sure image has no src set
                        previewImg.src = '';
                        // Remove any current file in the queue
                        uploader.removeCurrent();
                        
                        // Needs to be synchronous...
                        setTimeout(function () {
                            if (uploader._queue[0].file) {
                                var oFReader = new FileReader();
                                oFReader.readAsDataURL(uploader._queue[0].file);
                                oFReader.onload = function (oFREvent) {
                                    previewImg.src = oFREvent.target.result;

                                    fileName.innerHTML = filename;
                                    scope.fileSelected = true;
                                    scope.btnLabel = 'select new file';
                                    scope.$apply();
                                };
                            }
                        }, 0);
                        
                    },
                    onSubmit: function (filename) {

                        var progressWrapper = document.createElement('div'),
                            progressBar = document.createElement('div'),
                            //sizeBox = document.createElement('div'),
                            self = this;

                        progressWrapper.className = 'progress-wrapper';
                        progressBar.className = 'progress-bar';
                        //sizeBox.className = 'size-box';

                        progressWrapper.appendChild(progressBar);
                        //progressWrapper.appendChild(sizeBox);
                        filePickerWrapper.appendChild(progressWrapper);

                        //self.setFileSizeBox(sizeBox);
                        self.setProgressBar(progressBar);
                        
                        // Set this to remove progress bar when upload complete
                        //self.setProgressContainer(progressWrapper);

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

                scope.removeFile = function () {
                    uploader.removeCurrent();
                    fileName.innerHTML = '';
                    scope.btnLabel = 'browse';
                    scope.fileSelected = false;
                };

                scope.$on('$destroy', function () {
                    uploader.destroy();
                });

            }
        };
    }]);
});
