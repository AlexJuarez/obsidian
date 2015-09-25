define(function (require) {
    'use strict';

    require('./account');
    require('angularMocks');

    describe('accountService', function () {
        var account, httpBackend, divisions, state, apiGenerator, records;

        var apiConfig = {
            endpoint: 'test',
            dimensions: ['one']
        };

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
            },
            {
                'id': 'accountId1',
                'name': 'Account 1',
                'pinned': false,
                'active': false,
                'lastViewed': '2015-01-01T12:00:00Z',
                'lastViewedName': 'Jo Ma Ma',
                'client': {'id': 'clientId1'},
                'division': {'id': 'divisionId1'}
            },
            {
                'id': 'accountId2',
                'name': 'Account 2',
                'pinned': false,
                'active': false,
                'lastViewed': '2015-01-01T12:00:00Z',
                'lastViewedName': 'Jo Padre',
                'client': {'id': 'clientId1'},
                'division': {'id': ''}
            }
        ];

        beforeEach(function () {
            module('app.core');
            inject(function (accountService, $httpBackend, divisionService, $state, apiUriGenerator, accountRecordService) {
                account = accountService;
                httpBackend = $httpBackend;
                state = $state;
                divisions = divisionService;
                apiGenerator = apiUriGenerator;
                records = accountRecordService;
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
            httpBackend.when('GET', apiGenerator(apiConfig))
                .respond({
                    'accounts': accounts
                });

            account.init(apiConfig).then(function () {
                expect(account.all()).toEqual(accounts);
            });
            httpBackend.flush();
        });

        it('should pin an account', function () {
            account.setData(accounts);
            var a = account.all()[0];
            var record = records.get(a.id);

            spyOn(record, 'save').and.returnValue({
                then: function() {}
            });

            account.pin(a);

            expect(record.get().pinned).toEqual(true);
            expect(record.save).toHaveBeenCalled();
        });

        it('should unpin an account', function () {
            account.setData(accounts);
            var a = account.all()[0];
            var record = records.get(a.id);

            spyOn(record, 'save').and.returnValue({
                then: function() {}
            });

            account.unpin(a);

            expect(record.get().pinned).toEqual(false);
            expect(record.save).toHaveBeenCalled();
        });

        it('should return a map containing a key of the first letter by name', function () {
            account.setData(accounts);
            expect(account.alphabetMap()).toEqual([{key: 'a', value: accounts}]);
        });

        it('should get an account by id', function () {
            account.setData(accounts);
            expect(account.get('accountId0')).toEqual(accounts[0]);
        });

        it('should correctly fallback and populate output in filtered()', function () {
            account.setData(accounts);
            divisions.filtered = function(){
                return [
                    {
                        'id': 'divisionId0',
                        'name': 'Division 0',
                        'pinned': true,
                        'active': false,
                        'lastViewed': '2015-01-01T12:00:00Z',
                        'client': {'id': 'clientId0'}
                    }
                ];
            };
            state.params.divisionId = '';
            state.params.clientId = 'clientId0';
            expect(account.filtered()[0]).toEqual(account.get('accountId0'));
        });

        it('should filter by account id', function () {
            account.setData(accounts);

            state.params.divisionId = '';
            state.params.accountId = 'accountId0';
            expect(account.filtered()[0]).toEqual(account.get('accountId0'));
        });

        it('should return all with matching divisonId', function () {
            account.setData(accounts);
            state.params.divisionId = 'divisionId1';
            expect(account.filtered()[0]).toEqual(account.get('accountId1'));
        });

        it('should return all from filter', function () {
            account.setData(accounts);
            state.params.divisionId = '';
            expect(account.all()).toEqual(account.filtered());
        });

        it('should find our result by name', function () {
            account.setData(accounts);

            expect(account.search('nt 0')[0].id).toEqual('accountId0');
        });
    });
});
