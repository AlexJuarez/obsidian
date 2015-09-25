/* globals spyOn */
define(function (require) {
    'use strict';

    require('./../../../core/modal/index');
    require('./newEditCampaign');
    require('angularMocks');

    describe('newEditCampaignCtrl', function () {
        var mockAccounts, mockModalInstance, httpBackend, state, scope, controller, campaignRecords;

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

            module(function($provide) {
                $provide.value('notification', {
                    info: function() {},
                    success: function() {}
                });

                $provide.value('accountRecordService', {
                    fetch: function() {
                        return { then: function() {} };
                    }
                });
            });

            spyOn(mockAccounts, 'observe').and.callThrough();

            inject(function ($controller, $httpBackend, $state, $rootScope, campaignRecordService) {
                httpBackend = $httpBackend;
                state = $state;
                scope = $rootScope.$new();
                controller = $controller;
                campaignRecords = campaignRecordService;
            });
        });

        function setUp(modalState) {
            modalState = modalState || {};

            httpBackend.when('GET', '/api/crud/campaigns/1').respond({ id: 1 });

            return controller('newEditCampaignCtrl',
                {
                    $scope: scope,
                    $modalInstance: mockModalInstance,
                    modalState: modalState,
                    accountService: mockAccounts
                }
            );
        }

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of newCampaignCtrl', function () {
            var newCampaign = setUp();
            expect(newCampaign).not.toEqual(null);
        });

        it('should observe accounts', function() {
            setUp();

            expect(mockAccounts.observe).toHaveBeenCalled();
        });

        it('should confirm closing and not close when false with unsaved changes', function() {
            setUp();

            spyOn(window, 'confirm').and.returnValue(false);
            spyOn(mockModalInstance, 'dismiss');
            scope.campaign.change = 'test';
            scope.cancel();

            expect(scope).toExist();
            expect(mockModalInstance.dismiss.calls.any()).toEqual(false);
            expect(window.confirm).toHaveBeenCalled();
        });

        it('should confirm closing and close when true with unsaved changes', function() {
            setUp();

            spyOn(window, 'confirm').and.returnValue(true);
            spyOn(mockModalInstance, 'dismiss');
            scope.campaign.change = 'test';
            scope.cancel();

            expect(scope).toExist();
            expect(mockModalInstance.dismiss).toHaveBeenCalled();
            expect(window.confirm).toHaveBeenCalled();
        });

        it('should just close when there are no changes', function() {
            setUp();

            spyOn(window, 'confirm');
            spyOn(mockModalInstance, 'dismiss');
            scope.cancel();

            expect(scope).toExist();
            expect(mockModalInstance.dismiss).toHaveBeenCalled();
            expect(window.confirm.calls.any()).toEqual(false);
        });

        it('should submit', function() {
            setUp();

            scope.ok('errors');
            expect(scope.submitted).toEqual(true);
        });

        it('should open a picker', function() {
            setUp();

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

        describe('ok', function() {
            it('should work without errors', function() {
                setUp({ campaignId: 1 });
                var record = campaignRecords.get(1);
                httpBackend.flush();

                spyOn(record, 'save').and.returnValue({
                    then: function() {}
                });

                scope.ok({});

                expect(record.save).toHaveBeenCalled();
            });

            it('should update the campaign', function() {
                var record = campaignRecords.get(1);
                spyOn(record, 'update').and.returnValue({
                    then: function() {}
                });

                setUp({ campaignId: 1 });
                httpBackend.flush();

                scope.campaign.name = 'New Name';
                spyOn(mockModalInstance, 'dismiss');

                scope.ok({});

                expect(record.update).toHaveBeenCalled();
                expect(scope.errors).toEqual({});
            });

            it('should create the campaign', function() {
                httpBackend.when('POST', '/api/crud/campaigns').respond({ id: 1, name: 'New Name'});
                setUp();
                scope.campaign.name = 'New Name';

                spyOn(mockModalInstance, 'dismiss');

                scope.ok({});
                httpBackend.flush();

                expect(campaignRecords.get(1).get().name).toEqual('New Name');
                expect(mockModalInstance.dismiss).toHaveBeenCalled();
                expect(scope.errors).toEqual({});
            });
        });

        it('should save the campaign on scope.$destroy', function() {
            var modalState = {
                campaign: { name: 'test' }
            };

            setUp(modalState);

            scope.campaign.other = 'test';

            scope.$destroy();

            expect(modalState.campaign.other).toEqual('test');
        });


    });
});
