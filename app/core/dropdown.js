/**
 * Created by alex on 4/15/15.
 */
define(function (require) {
    'use strict';

    var app = require('./module');

    app.directive('dropdownToggle', ['$document', function ($document) {
        return {
            restrict: 'C',
            scope: {
                selected: '='
            },
            link: function (scope, element) {
                function documentClickHandler(event) {
                    if (!event.result || event.result && scope.$id !== event.result.id) {
                        scope.$apply(function () {
                            scope.selected = false;
                        });
                    }
                }

                $document.on('click', documentClickHandler);

                element.on('click', function (event) {
                    event.result = {
                        id: scope.$id
                    };

                    scope.$apply(function () {
                        scope.selected = !scope.selected;
                    });
                });

                element.parent().on('click', function(event){
                    event.result = {
                        id: scope.$id
                    };
                });

                scope.$on('$destroy', function () {
                    $document.off('click', documentClickHandler);
                });

                scope.$watch('selected', function (value) {
                    if (value) {
                        element.parent().addClass('open');
                    } else {
                        element.parent().removeClass('open');
                    }
                });
            }
        };
    }]);
});
