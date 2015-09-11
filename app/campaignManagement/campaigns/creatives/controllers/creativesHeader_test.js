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
                        {type: 'IBV'},
                        {type: 'RM'},
                        {type: 'IS'},
                        {type: 'IBV'}
                    ]
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
                all: 4,
                IBV: 2,
                RM: 1,
                IS: 1
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
