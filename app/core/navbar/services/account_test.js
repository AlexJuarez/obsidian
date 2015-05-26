define(function (require) {
    'use strict';

    require('./account');
    require('angularMocks');

    describe('accountService', function () {
        var account, httpBackend;

        var accounts = [
            {
                'id': 'accountId0',
                'name': 'Account 0',
                'pinned': false,
                'active': false,
                'lastViewed': '2015-01-01T12:00:00Z',
                'lastViewedName': 'Joe Snoopypants',
                'client': {'id': 'clientId0'},
                'division': {'id': 'divisionId0'}
            }
        ];

        beforeEach(function () {
            module('app.core');
            inject(function (accountService, $httpBackend) {
                account = accountService;
                httpBackend = $httpBackend;
            });
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of accountService', function () {
            expect(account).not.toEqual(null);
        });

        it('should make a request on init', function () {
            httpBackend.when('GET', '/test')
                .respond({
                    'accounts': accounts
                });

            account.init('/test').then(function () {
                expect(account.all()).toEqual(accounts);
            });
            httpBackend.flush();
        });

        it('should pin an account', function () {
            account.setData(accounts);
            var a = account.all()[0];
            account.pin(a);
            expect(account.pinned().length).toEqual(1);
        });

        it('should unpin an account', function () {
            account.setData(accounts);
            var a = account.all()[0];
            account.pin(a);
            account.unpin(a);
            expect(account.pinned().length).toEqual(0);
        });

        it('should return a map containing a key of the first letter by name', function () {
            account.setData(accounts);
            expect(account.alphabetMap()).toEqual({a: [accounts[0]]});
        });

        it('should get an account by id', function () {
            account.setData(accounts);
            expect(account.get('accountId0')).toEqual(accounts[0]);
        });

        it('should make a request to search', function () {
            account.setData(accounts);
            httpBackend.when('GET', '/narwhal/accounts/search?q=test&limit=5').respond(
                []
            );
            expect(account.search('test')).toEqual([]);
            httpBackend.flush();
        });
    });
});
