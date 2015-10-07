'use strict';

define(function(require) {
    var app = require('./../../../module');

    app.controller('creativesHeaderCtrl', ['$scope', '$rootScope', '$state', '$modal', 'creatives', 'ENUMS', function($scope, $rootScope, $state, $modal, creatives, ENUMS) {

        $scope.openNewCreativeModal = openNewCreativeModal;

        var newCreativeModal;
        function openNewCreativeModal() {
            if (!newCreativeModal) {
                newCreativeModal = {
                    action: 'New',
                    creative: {
                        expandedHeight: null,
                        expandedWidth: null
                    }
                };
            }

            $modal.open({
                animation: 'true',
                templateUrl: 'campaignManagement/campaigns/creatives/new-edit-creative.html',
                controller: 'newEditCreativeCtrl',
                resolve: {
                    modalState: function() {
                        return newCreativeModal;
                    }
                },
                size: 'lg'
            });
        }

        function updateMeta() {

            var allCreatives = creatives.all().data;
            
            if (allCreatives) {
                
                var creative = 0;

                var meta = {
                    all: 0,
                    inBannerVideo: 0,
                    richMedia: 0,
                    inStream: 0
                };

                for(var i = 0; i < allCreatives.length; i ++) {
                    creative = allCreatives[i];

                    meta.all ++;
                    if(creative.type) {
                        meta[ENUMS.down.creativeTypes[creative.type]]++;
                    }
                }
                $scope.creativesMeta = meta;
            }
        }
        updateMeta();
        creatives.observe(updateMeta, $scope, true);
    }
    ]);
});
