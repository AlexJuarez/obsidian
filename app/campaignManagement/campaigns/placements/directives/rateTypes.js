define(function (require) {
	'use strict';

	var app = require('./../../../module');

	require('tpl!./rate-types.html');

	app.directive('rateTypes', [function () {
		return {
			restrict: 'A',
			replace: true,
			scope: false,
			templateUrl: 'campaignManagement/campaigns/placements/directives/rate-types.html',
			controller: ['$scope', 'MONEY_REGEX', function ($scope, MONEY_REGEX) {

				$scope.MONEY_REGEX = MONEY_REGEX;
				$scope.rateTypes = [
					{id: 'CPM', name: 'CPM'},
					{id: 'CPC', name: 'CPC'},
					{id: 'CPV', name: 'CPV'},
					{id: 'CPCV', name: 'CPCV'},
					{id: 'FIXED', name: 'Fixed Fee'},
					{id: 'ADDEDV', name: 'Added Value'}
				];

				$scope.rateTypeFields = {
					CPM: { showCostPer: true, showTotalCost: true },
					CPC: { showCostPer: true, showTotalCost: true },
					CPV: { showCostPer: true, showTotalCost: true },
					CPCV: { showCostPer: true, showTotalCost: true },
					FIXED: { showCostPer: false, showTotalCost: true },
					ADDEDV: { showCostPer: false, showTotalCost: false }
				};

				$scope.$watch('placement.rateType', function() {
					var rateType = $scope.placement && $scope.placement.rateType;
					if (rateType) {
						var fields = $scope.rateTypeFields[rateType];
						if(fields) {
							$scope.showCostPer = fields.showCostPer;
							$scope.showTotalCost = fields.showTotalCost;
						}
					}
				});
			}]
		};
	}]);
});
