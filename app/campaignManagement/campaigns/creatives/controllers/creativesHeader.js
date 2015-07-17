'use strict';

define(function(require) {
    var app = require('./../../../module');

    app.controller('creativesHeader', ['$scope', '$rootScope', 'campaignCreative', function($scope, $rootScope, campaignCreative) {
        function updateMeta() {

            var allCreatives = campaignCreative.all().data;

            if (allCreatives) {
                var creative = 0;

                var meta = {
                    all: 0,
                    IBV: 0,
                    RM: 0,
                    IS: 0
                };

                for(var i = 0; i < allCreatives.length; i ++) {
                    creative = allCreatives[i];

                    meta.all ++;
                    if(creative.type) {
                        meta[creative.type] ++;
                    }
                }
                $scope.creativesMeta = meta;
            }
        }
        updateMeta();
        campaignCreative.observe(updateMeta, $scope, true);
    }
    ]);
});
