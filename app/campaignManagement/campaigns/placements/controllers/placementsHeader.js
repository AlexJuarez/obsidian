'use strict';

define(function(require) {
    var app = require('./../../../module');

    app.controller('placementsHeader', [
        '$scope', '$modal', '$rootScope', '$q', '$interpolate', 'placements', 'adTagService', 'placementRecordService',
        function($scope, $modal, $rootScope, $q, $interpolate, placements, adTagService, placementRecordService) {

            $scope.openNewPlacementModal = openNewPlacementModal;
            $scope.editPlacements = editPlacements;
            $scope.pullTags = pullTags;
            $scope.selectedPlacements = [];

            var newPlacementModal;

            function openNewPlacementModal() {
                if(! newPlacementModal) {
                    newPlacementModal = {
                        action: 'New'
                    };
                }

                $modal.open({
                    animation: 'true',
                    templateUrl: 'campaignManagement/campaigns/placements/new-edit-placement.html',
                    controller: 'newEditPlacementCtrl',
                    resolve: {
                        modalState: function() {
                            return newPlacementModal;
                        }
                    },
                    size: 'lg'
                });
            }

            function update() {
                updateMeta();
                updateSelected();
            }

            function updateMeta() {
                var allPlacements = placements.all(true);

                if(allPlacements) {
                    var placement;
                    var creative;

                    var publishers = [];
                    var creatives = [];
                    var types = [];

                    for(var i = 0; i < allPlacements.length; i ++) {
                        placement = allPlacements[i];

                        pushUnique(publishers, placement.publisher.id);
                        pushUnique(types, placement.type);

                        if(placement.creatives) {
                            for(var k = 0; k < placement.creatives.length; k ++) {
                                creative = placement.creatives[k];

                                pushUnique(creatives, creative.id);

                            }
                        }
                    }

                    $scope.placementsMeta = {
                        publishers: publishers.length,
                        creatives: creatives.length,
                        types: types.length
                    };
                }
            }

            function updateSelected() {
                $scope.selectedPlacements = placements.getSelectedPlacementIds();
            }

            updateMeta();
            placements.observe(update, $scope, true);

            // Edit Placements
            var editPlacementsModal, selectedPlacements;

            function editPlacements() {
                if(! editPlacementsModal || selectedPlacementsChanged()) {
                    selectedPlacements = $scope.selectedPlacements;
                    editPlacementsModal = {
                        placementIds: $scope.selectedPlacements,
                        action: 'Edit'
                    };
                }

                $modal.open({
                    animation: 'true',
                    templateUrl: 'campaignManagement/campaigns/placements/new-edit-placement.html',
                    controller: 'newEditPlacementCtrl',
                    resolve: {
                        modalState: function() {
                            return editPlacementsModal;
                        }
                    },
                    size: 'lg'
                });
            }

            function selectedPlacementsChanged() {
                return arraysAreDifferent(selectedPlacements, $scope.selectedPlacements);
            }

            /**
             * Push an item to an array if the item isn't already in the array
             * @param array
             * @param item
             */
            function pushUnique(array, item) {
                if(! inArray(item, array)) {
                    array.push(item);
                }
            }

            function inArray(needle, haystack) {
                return haystack.indexOf(needle) > - 1;
            }

            /**
             * Returns true if two arrays are different
             *
             * @param a {Array<number>}
             * @param b {Array<number>}
             *
             * @returns {boolean}
             */
            function arraysAreDifferent(a, b) {
                return ! isSubsetOf(a, b) || ! isSubsetOf(b, a);
            }

            /**
             * Returns true if b is a subset of a
             *
             * @param a {Array<number>}
             * @param b {Array<number>}
             *
             * @returns {boolean}
             */
            function isSubsetOf(a, b) {
                var difference = a.filter(function(i) {
                    return b.indexOf(i) < 0;
                });

                return difference.length === 0;
            }

            var tagTemplates = [];
            adTagService.init();
            adTagService.observe(function() {
                tagTemplates = adTagService.all();
            });

            function pullTags() {
                var placementIds = placements.getSelectedPlacementIds();
                if (placementIds.length === 0) {
                    window.alert('No ad tags to pull!');
                    return;
                }
                var tags = '';
                var placementPromises = [];

                placementIds.forEach(function(placementId) {
                    placementPromises.push(placementRecordService.getById(placementId));
                });

                $q.all(placementPromises).then(function(placements) {
                    placements.forEach(function(placement) {
                        placement = placement.all();
                        tags += getPlacementTagText(placement);
                    });

                    if (placements.length > 0) {
                        var firstPlacementName = placements[0].all().name;
                        download(firstPlacementName + '_tags.txt', tags);
                    }
                });
            }

            function getPlacementTagTemplate(placement) {
                var placementTagTemplate = false;
                tagTemplates.forEach(function(tagTemplate) {
                   if (tagTemplate.id === placement.adTagId) {
                       placementTagTemplate = tagTemplate;
                   }
                });

                return placementTagTemplate;
            }

            function getPlacementInterpolateObject(placement, adTagType) {
                return {
                    width: placement.embedWidth,
                    height: placement.embedHeight,
                    id: placement.targetId, // The creative guid / entry point for multi-creative
                    // TODO: ad real url here
                    prerenderUrl: 'http://www.google.com', // Image to show before load
                    clickThroughUrl: placement.clickthroughUrl,
                    // TODO: add real data here
                    version: '1.1.1', // The current build version
                    clicktag: adTagType.attributes.clicktag,
                    folder: placement.targetId.slice(0, 2) // The first 2 letters of the id
                };
            }

            function getPlacementTagText(placement) {
                var tagTemplate = getPlacementTagTemplate(placement);
                if (tagTemplate) {
                    // Interpolate in "all-or-nothing" mode to avoid missing variables
                    var adTag = $interpolate(tagTemplate.template || tagTemplates[0].template, false, null, true);
                    var tag = '';

                    tag += 'Title: ' + placement.name + '\n';
                    tag += 'Identifier: ' + placement.id + '\n';
                    tag += 'Primary URL: ' + placement.clickthroughUrl + '\n';
                    tag += 'Play Mode: ' + placement.playMode + '\n';
                    tag += 'Ad Tag: \n';
                    tag += adTag(getPlacementInterpolateObject(placement, tagTemplate));
                    tag += '\n\n---\n\n';

                    return tag;
                } else {
                    return '';
                }
            }

            function download(filename, text) {
                var pom = document.createElement('a');
                pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
                pom.setAttribute('download', filename);

                if(document.createEvent) {
                    var event = document.createEvent('MouseEvents');
                    event.initEvent('click', true, true);
                    pom.dispatchEvent(event);
                }
                else {
                    pom.click();
                }
            }
        }
    ]);
});
