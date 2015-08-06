define(function (require) {
    'use strict';

    require('./clientDropdown');
    require('angularMocks');

    var template = require('tpl!./client.html');

    describe('clientDropdownDirective', function () {
        var compile, httpBackend, rootScope, document, client, navbar;

        beforeEach(function () {
            module('app.core');
        });

        beforeEach(inject(function ($compile, $httpBackend, $rootScope, $document, $templateCache, clientService, navbarService) {
            $templateCache.put('core/navbar/directives/client.html', template);

            compile = $compile;
            httpBackend = $httpBackend;
            rootScope = $rootScope;
            document = $document;
            client = clientService;
            navbar = navbarService;
        }));

        function createDropDown(clients) {
            client.setData(clients);

            var parentScope = rootScope.$new();
            var html = compile('<div client-dropdown="test"></div>')(parentScope);
            parentScope.$apply();

            return html.scope();
        }

        describe('controller', function () {
            var clients = [{
                'id': 'clientId0',
                'name': 'Client 0',
                'pinned': true,
                'active': false,
                'lastViewed': '2015-01-01T12:00:00Z',
                'lastViewedName': 'Joe Snoopypants',
                'channel': 'Advertisers'
            }];

            it('should check to see if elements are pinned.',function(){
                var scope = createDropDown(clients);

                expect(scope.pinned).toEqual(client.all());
            });

            it('should check to see if the clientsMap exists',function(){
                var scope = createDropDown(clients);

                expect(scope.clientsMap).toEqual(client.alphabetMap());
            });

            it('should change the pinned client when pin state change', function() {
                var scope = createDropDown(clients);

                httpBackend.expect('GET', '/api/crud/clients/clientId0')
                    .respond( 200, { id: 'clientId0', pinned: false } );
                httpBackend.expect('PUT', '/api/crud/clients/clientId0')
                    .respond( 200, { pinned: false } );

                scope.unpin(client.all()[0]);
                httpBackend.flush();
                expect(scope.pinned.length).toEqual(0);

                httpBackend.expect('PUT', '/api/crud/clients/clientId0')
                    .respond( 200, { pinned: true } );
                scope.pin(client.all()[0]);

                httpBackend.flush();
                expect(scope.pinned.length).toEqual(1);
            });

            it('should have the current client', function() {
                var scope = createDropDown(clients);

                expect(scope.current).toEqual('All Clients');
            });

            it('should update the query results on a search', function () {
                var scope = createDropDown(clients);

                scope.query = 'Client 0';
                scope.$digest();

                expect(scope.results).toEqual(client.all());
                scope.query = 'Client 01';
                scope.$digest();

                expect(scope.results).toEqual([]);
            });

            it('should return the current client', function () {
                navbar.setData({clientId: 'clientId0'});

                var scope = createDropDown(clients);

                expect(scope.current).toEqual('Client 0');
            });
        });



    });
});
