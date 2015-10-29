var browserSingleton = require('../browser');

function NavBar (){
   this._clientDrop = '#navbar-client-dropdown [ng-click=\"toggleOpen()\"]';
   this._clientSearchField = '#client-dropdown-search';
   this._divisionDrop = '#navbar-division-dropdown [ng-click=\"toggleOpen()\"]';
   this._divisionSearchField = '#division-dropdown-search';
   this._accountDrop = '#navbar-account-dropdown [ng-click=\"toggleOpen()\"]';
   this._accountSearchField = '#account-dropdown-search';
   this._campaignDrop = '#navbar-campaign-dropdown [ng-click=\"toggleOpen()\"]';
   this._campaignSearchField = '#campaign-dropdown-search';

   this._campaignManagementTab = '#navbar-campaign-management-tab';
   this._navbarAnalyticsTab = '#navbar-analytics-tab';
}

NavBar.prototype.validateNavBar = function(){
    return browser
        .isExisting(this._clientDrop).then(function (exists){
            console.log('client dropdown exists');
        })
        .isExisting(this._divisionDrop).then(function (exists){
            console.log('division dropdown exists');
        })
        .isExisting(this._accountDropunt).then(function (exists){
            console.log('account dropdown exists');
        })
        .isExisting(this._campaignDrop).then(function (exists){
            console.log('campaign dropdown exists');
        })
        .isExisting(this._campaignManagementTab).then(function (exists){
            console.log('campaign manmagement tab exists');
        })
        .isExisting(this._navbarAnalyticsTab).then(function (exists){
            console.log('analytics tab exists');
        });
};

NavBar.prototype.searchResult = function(section,actual) {
  return '#navbar-' +section+ '-dropdown [title=\"' + actual + '\"]';
};

NavBar.prototype.clientSearch = function(term, actual) {
  return browser.click(this._clientDrop).waitForExist(this._clientSearchField, 5000)
  .setValue(this._clientSearchField, term).waitForExist(this.searchResult('client', actual))
  .isExisting(this.searchResult('client',actual)).then(function (isExisting) {
    expect(isExisting).toBe(true);
  });
};

NavBar.prototype.clientNavigate = function (client) {
    return this.clientSearch(client,client)
        .click(this.searchResult('client',client))
        .waitUntil(window.document.URL.contains('mixpo.com/campaign-management/account'));
};

NavBar.prototype.divisionSearch = function(term, actual) {
  return browser.click(this._divisionDrop).waitForExist(this._divisionSearchField, 5000)
  .setValue(this._divisionSearchField, term).waitForExist(this.searchResult('division', actual))
  .isExisting(this.searchResult('division',actual)).then(function (isExisting) {
    expect(isExisting).toBe(true);
    console.log(actual+' found in search!');
  });
};


NavBar.prototype.divisionNavigate = function (division) {
    return this.divisionSearch(division,division)
        .click(this.searchResult('division', division));
};

NavBar.prototype.accountSearch = function(term, actual) {
  return browser.click(this._accountDrop).waitForExist(this._accountSearchField, 5000)
  .setValue(this._accountSearchField, term).waitForExist(this.searchResult('account', actual))
  .isExisting(this.searchResult('account',actual)).then(function (isExisting) {
    expect(isExisting).toBe(true);
  });
};


NavBar.prototype.accountNavigate = function (account) {
    return this.accountSearch(account,account)
        .click(this.searchResult('account',account));
};

NavBar.prototype.campaignSearch = function(term, actual) {
  return browser.click(this._campaignDrop).waitForExist(this._campaignSearchField, 5000)
  .setValue(this._campaignSearchField, term).waitForExist(this.searchResult('campaign', actual))
  .isExisting(this.searchResult('campaign',actual)).then(function (isExisting) {
    expect(isExisting).toBe(true);
  });
};

NavBar.prototype.campaignNavigate = function (campaign) {
    return this.campaignSearch(campaign,campaign)
        .click(this.searchResult('campaign',campaign));
};

var navBar = new NavBar();
browserSingleton.addCommand(navBar, 'validateNavBar');
browserSingleton.addCommand(navBar, 'searchResult');
browserSingleton.addCommand(navBar, 'clientSearch');
browserSingleton.addCommand(navBar, 'clientNavigate');
browserSingleton.addCommand(navBar, 'divisionSeach');
browserSingleton.addCommand(navBar, 'divisionNavigate');
browserSingleton.addCommand(navBar, 'accountSearch');
browserSingleton.addCommand(navBar, 'accountNavigate');
browserSingleton.addCommand(navBar, 'campaignSearch');
browserSingleton.addCommand(navBar, 'campaignNavigate');

module.exports = NavBar;
