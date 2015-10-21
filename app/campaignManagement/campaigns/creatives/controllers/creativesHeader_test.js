/* globals spyOn */
define(function (require) {
    'use strict';

    require('./creativesHeader');
    require('angularMocks');

    describe('creativesHeaderCtrl', function () {
        var header, mockCreatives, httpBackend, state, scope, modal;

        mockCreatives = {
            all: function() {
                return {
                    data: [
                        {type: 'In-Banner'},
                        {type: 'Rich Media'},
                        {type: 'In-Stream'},
                        {type: 'In-Banner'},
                        {type: 'Display'}
                    ]
                };
            },
            noContent: function () {
                return {};
            },
            data: function() {
                return {
                    isLoaded: function() {
                        return true;
                    }
                };
            },
            observe: function() {}
        };

        beforeEach(function () {
            module('app.campaign-management');

            module(function($provide){
                $provide.value('$modal', {
                    open: function(opts) {
                        opts.resolve.modalState();
                    }
                });
            });

            spyOn(mockCreatives, 'observe');

            inject(function ($controller, $httpBackend, $state, $rootScope, $modal) {
                httpBackend = $httpBackend;
                state = $state;
                scope = $rootScope.$new();
                modal = $modal;
                header = $controller('creativesHeaderCtrl', {$scope: scope, creatives: mockCreatives});
            });
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of creativesHeader', function () {
            expect(header).not.toEqual(null);
        });

        it('should observe creatives', function() {
            expect(mockCreatives.observe).toHaveBeenCalled();
        });

        it('should set $scope.creativesMeta appropriately', function() {
            var expected = {
                all: 5,
                inBannerVideo: 2,
                richMedia: 1,
                inStream: 1,
                display: 1
            };

            expect(scope.creativesMeta).toEqual(expected);
        });

        it('should open a modal', function() {
            spyOn(modal, 'open').and.callThrough();

            scope.openNewCreativeModal();

            expect(modal.open).toHaveBeenCalled();
        });

    });
});
