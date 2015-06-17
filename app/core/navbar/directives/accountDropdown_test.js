define(function (require) {
    'use strict';

    require('./accountDropdown');
    require('angularMocks');

    var template = require('tpl!./account.html');

    describe('accountDropdownDirective', function () {
        var compile, rootScope, document, account, division, navbar;

        beforeEach(function () {
            module('app.core');
        });

        beforeEach(inject(function ($compile, $rootScope, $document, $templateCache, accountService, navbarService, divisionService) {
            $templateCache.put('core/navbar/directives/account.html', template);

            compile = $compile;
            rootScope = $rootScope;
            document = $document;
            account = accountService;
            navbar = navbarService;
            division = divisionService;
        }));

        function createDropDown(accounts) {
            account.setData(accounts);
            division.setData([
                {
                    'id': 'divisionId0',
                    'name': 'Division 0',
                    'pinned': false,
                    'active': false,
                    'lastViewed': '2015-01-01T12:00:00Z',
                    'client': {'id': 'clientId0'}
                }
            ]);

            var parentScope = rootScope.$new();
            var html = compile('<div account-dropdown="test"></div>')(parentScope);
            parentScope.$apply();

            return html.scope();
        }

        describe('controller', function () {
            var accounts = [
                {
                    'id': 'accountId0',
                    'name': 'Account 0',
                    'pinned': true,
                    'active': false,
                    'lastViewed': '2015-01-01T12:00:00Z',
                    'lastViewedName': 'Joe Snoopypants',
                    'client': {'id': 'clientId0'},
                    'division': {'id': 'divisionId0'}
                },
                {
                    'id': 'accountId1',
                    'name': 'Account 1',
                    'pinned': true,
                    'active': false,
                    'lastViewed': '2015-01-01T12:00:00Z',
                    'lastViewedName': 'Jo Ma Ma',
                    'client': {'id': 'clientId0'},
                    'division': {'id': 'divisionId0'}
                }];

            it('should check to see if elements are pinned.',function(){
                var scope = createDropDown(accounts);

                expect(scope.pinned).toEqual(account.all());
            });

            it('should check to see if the accountsMap exists',function(){
                var scope = createDropDown(accounts);

                expect(scope.accountsMap).toEqual(account.alphabetMap());
            });

            it('should change the pinned account when pin state change', function() {
                var scope = createDropDown(accounts);

                scope.unpin(account.all()[0]);
                expect(scope.pinned.length).toEqual(1);

                scope.pin(account.all()[0]);
                expect(scope.pinned.length).toEqual(2);
            });

            it('should have the current account', function() {
                var scope = createDropDown(accounts);

                expect(scope.current).toEqual('All Accounts');
            });

            it('should update the query results on a search', function () {
                var scope = createDropDown(accounts);

                scope.query = 'Account 0';
                scope.$digest();

                expect(scope.results).toEqual([account.all()[0]]);

                scope.query = 'Account 01'; //real is 'Account 1'
                scope.$digest();

                expect(scope.results).toEqual([]);
            });

            it('should return the first account', function () {
                navbar.setData({accountId: 'accountId0'});

                var scope = createDropDown(accounts);

                expect(scope.current).toEqual('Account 0');
            });
        });
    });
});
