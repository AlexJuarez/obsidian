define(function (require) {
    'use strict';

    require('./divisionDropdown');
    require('angularMocks');

    var template = require('tpl!./division.html');

    describe('divisionDropdownDirective', function () {
        var compile, rootScope, document, division, navbar, client;

        beforeEach(function () {
            module('app.core');
        });

        beforeEach(inject(function ($compile, $rootScope, $document, $templateCache, navbarService, divisionService, clientService) {
            $templateCache.put('core/navbar/directives/division.html', template);

            compile = $compile;
            rootScope = $rootScope;
            document = $document;
            navbar = navbarService;
            division = divisionService;
            client = clientService;
        }));

        function createDropDown(divisions) {
            division.setData(divisions);
            client.setData([{
                'id': 'clientId0',
                'name': 'Client 0',
                'pinned': true,
                'active': false,
                'lastViewed': '2015-01-01T12:00:00Z',
                'lastViewedName': 'Joe Snoopypants',
                'channel': 'Advertisers'
            }]);

            var parentScope = rootScope.$new();
            var html = compile('<div division-dropdown="test"></div>')(parentScope);
            parentScope.$apply();
            return html;
        }

        describe('controller', function () {
            var divisions = [
                {
                    'id': 'divisionId0',
                    'name': 'Division 0',
                    'pinned': true,
                    'active': false,
                    'lastViewed': '2015-01-01T12:00:00Z',
                    'client': {'id': 'clientId0'}
                },
                {
                    'id': 'divisionId1',
                    'name': 'Division 1',
                    'pinned': false,
                    'active': false,
                    'lastViewed': '2015-01-01T12:00:00Z',
                    'client': {'id': 'clientId1'}
                }
            ];

            it('should check to see if elements are pinned.',function(){
                var scope = createDropDown(divisions).scope();

                expect(scope.pinned).toEqual([division.all()[0]]);
            });

            it('should check to see if the accountsMap exists',function(){
                var scope = createDropDown(divisions).scope();

                expect(scope.divisionsMap).toEqual(division.alphabetMap());
            });

            it('should change the pinned account when pin state change', function() {
                var scope = createDropDown(divisions).scope();

                scope.unpin(division.all()[0]);
                expect(scope.pinned.length).toEqual(0);

                scope.pin(division.all()[0]);
                expect(scope.pinned.length).toEqual(1);
            });

            it('should have the current account', function() {
                var scope = createDropDown(divisions).scope();

                expect(scope.current).toEqual('All Divisions');
            });

            it('should update the query results on a search', function () {
                var scope = createDropDown(divisions).scope();

                scope.query = 'Division 0';
                scope.$digest();

                expect(scope.results).toEqual([division.all()[0]]);

                scope.query = 'Division 01'; //real is 'Account 1'
                scope.$digest();

                expect(scope.results).toEqual([]);
            });

            it('should hide the elment when there is one division with an empty name', function () {
                var elementArray = createDropDown([{
                    'name': '',
                    'client': {'id': 'clientId3'}
                }]);
                var scope = elementArray.scope();

                scope.$digest();
                expect(elementArray[0].style.display).toEqual('none');
            });

            it('should hide the elment when there are no divisions', function () {
                var elementArray = createDropDown([]);
                var scope = elementArray.scope();

                scope.$digest();
                expect(elementArray[0].style.display).toEqual('none');
            });

            it('should show the elment when there are >1 divisions', function () {
                var elementArray = createDropDown(divisions);
                var scope = elementArray.scope();

                scope.$digest();
                expect(elementArray[0].style.display).toEqual('block');
            });

            it('should return the first division', function () {
                navbar.setData({divisionId: 'divisionId0'});

                var scope = createDropDown(divisions).scope();

                expect(scope.current).toEqual('Division 0');
            });
        });
    });
});
