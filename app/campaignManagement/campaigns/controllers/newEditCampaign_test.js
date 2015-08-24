/* globals spyOn */
define(function (require) {
    'use strict';

    require('./../../../core/modal/index');
    require('./newEditCampaign');
    require('angularMocks');

    describe('newEditCampaignCtrl', function () {
        var newCampaign, mockAccounts, mockModalInstance, httpBackend, state, scope;

        mockAccounts = {
            filtered: function() {
                return [
                    { name: 'account' }
                ];
            },
            observe: function(callback) {
                callback();
            }
        };

        mockModalInstance = {
            dismiss: function() {}
        };

        beforeEach(function () {
            module('app.campaign-management');
            module('app.core');

            spyOn(mockAccounts, 'observe');

            inject(function ($controller, $httpBackend, $state, $rootScope) {
                httpBackend = $httpBackend;
                state = $state;
                scope = $rootScope.$new();
                newCampaign = $controller('newEditCampaignCtrl',
                    {
                        $scope: scope,
                        $modalInstance: mockModalInstance,
                        modalState: {},
                        accountService: mockAccounts
                    }
                );
            });
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of newCampaignCtrl', function () {
            expect(newCampaign).not.toEqual(null);
        });

        it('should observe accounts', function() {
            expect(mockAccounts.observe).toHaveBeenCalled();
        });

        it('should confirm closing and not close when false with unsaved changes', function() {
            spyOn(window, 'confirm').and.returnValue(false);
            spyOn(mockModalInstance, 'dismiss');
            scope.campaign.change = 'test';
            scope.cancel();

            expect(scope).toExist();
            expect(mockModalInstance.dismiss.calls.any()).toEqual(false);
            expect(window.confirm).toHaveBeenCalled();
        });

        it('should confirm closing and close when true with unsaved changes', function() {
            spyOn(window, 'confirm').and.returnValue(true);
            spyOn(mockModalInstance, 'dismiss');
            scope.campaign.change = 'test';
            scope.cancel();

            expect(scope).toExist();
            expect(mockModalInstance.dismiss).toHaveBeenCalled();
            expect(window.confirm).toHaveBeenCalled();
        });

        it('should just close when there are no changes', function() {
            spyOn(window, 'confirm');
            spyOn(mockModalInstance, 'dismiss');
            scope.cancel();

            expect(scope).toExist();
            expect(mockModalInstance.dismiss).toHaveBeenCalled();
            expect(window.confirm.calls.any()).toEqual(false);
        });

        it('should submit', function() {
            scope.ok('errors');
            expect(scope.errors).toEqual('errors');
            expect(scope.submitted).toEqual(true);
        });

        it('should open a picker', function() {
            scope.datePickers = {
                'one': true,
                'two': false
            };
            var expected = {
                'one': false,
                'two': true
            };
            var event = new Event('test');
            scope.openPicker(event, 'two');
            expect(scope.datePickers).toEqual(expected);
        });
    });
});
