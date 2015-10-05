define(function (require) {
	'use strict';

	var app = require('./../../../module');
	var ng = require('angular');

	require('tpl!./start-end-dates.html');

	app.directive('startEndDates', ['$filter', function ($filter) {
		return {
			restrict: 'A',
			replace: true,
			scope: {
				placement: '='
			},
			templateUrl: 'campaignManagement/campaigns/placements/directives/start-end-dates.html',
			controller: ['$scope', function ($scope) {
				$scope.format = 'MM/dd/yyyy';
				$scope.openPicker = openPicker;
				$scope.datePickers = {};
				$scope.dateOptions = {
					formatYear: 'yy',
					startingDay: 0,
					maxMode: 'day'
				};
				$scope.formatDate = formatDate;

				function openPicker($event, name) {
					$event.preventDefault();
					$event.stopPropagation();

					ng.forEach($scope.datePickers, function (value, key) {
						$scope.datePickers[key] = false;
					});

					$scope.datePickers[name] = true;
				}

				function formatDate($event) {
					var date = new Date($event.target.value);
					if (isNaN( date.getTime() )) {

						// Date doesn't parse!
						date = new Date('Jan 1 2000');
					}
					$event.target.value = $filter('date')(date, 'M/d/yyyy');
				}
			}]
		};
	}]);
});
