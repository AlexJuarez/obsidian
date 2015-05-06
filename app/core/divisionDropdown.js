define(function (require) {
    'use strict';

    var app = require('./module');

    app.directive('divisionDropdown', ['divisionService', '$timeout', function (divisions, $timeout) {
        return {
            restrict: 'A',
            link: function (scope) {

                scope.pin = divisions.pin;
                scope.unpin = divisions.unpin;

                divisions.init();

                divisions.observe(update);

                function update() {
                    $timeout(function () {
                        scope.$apply(function () {
                            scope.divisionsMap = divisions.alphabetMap();
                            scope.pinned = divisions.pinned();
                        });
                    });
                }
            }
        };
    }]);
});
