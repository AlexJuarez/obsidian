define(function (require) {
	'use strict';

	var app = require('./../../../module');
	var ng = require('angular');

	require('tpl!./start-end-dates.html');

	app.directive('startEndDates', [function() {
		return {
			restrict: 'A',
			replace: true,
			scope: false,
			templateUrl: 'campaignManagement/campaigns/placements/directives/start-end-dates.html',
			controller: ['$scope', function($scope) {
				$scope.format = 'MM/dd/yyyy';
				$scope.openPicker = openPicker;
				$scope.datePickers = {};
				$scope.dateOptions = {
					formatYear: 'yy',
					startingDay: 0,
					maxMode: 'day'
				};

				function openPicker($event, name) {
					$event.preventDefault();
					$event.stopPropagation();

					ng.forEach($scope.datePickers, function (value, key) {
						$scope.datePickers[key] = false;
					});

					$scope.datePickers[name] = true;
				}
			}]
		};
	}]);
});
