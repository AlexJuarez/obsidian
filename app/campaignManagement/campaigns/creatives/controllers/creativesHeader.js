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
                    originalCreative: {
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

        function update() {
            updateMeta();
            $scope.noContent = creatives.noContent();
        }


        function updateMeta() {

            var allCreatives = creatives.all().data;
            $scope.noContent = creatives.noContent();

            if (allCreatives && creatives.data().isLoaded()) {
                var creative = 0;

                var meta = {
                    all: 0,
                    inBannerVideo: 0,
                    richMedia: 0,
                    inStream: 0,
                    display: 0
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
        update();
        creatives.observe(update, $scope, true);
    }
    ]);
});
