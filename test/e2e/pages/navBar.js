function navBar (){
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

navBar.prototype.searchResult = function(section,actual) {
  return '#navbar-' +section+ '-dropdown [title=\"' + actual + '\"]';
}

navBar.prototype.clientSearch = function(term, actual) {
  return browser.click(this._clientDrop).waitForExist(this._clientSearchField, 5000)
  .setValue(this._clientSearchField, term).waitForExist(this.searchResult('client', actual))
  .isExisting(this.searchResult('client',actual)).then(function (isExisting) {
    expect(isExisting).toBe(true);
  });
}

navBar.prototype.divisionSearch = function(term, actual) {
  return browser.click(this._divisionDrop).waitForExist(this._divisionSearchField, 5000)
  .setValue(this._divisionSearchField, term).waitForExist(this.searchResult('division', actual))
  .isExisting(this.searchResult('division',actual)).then(function (isExisting) {
    expect(isExisting).toBe(true);
  });
}

navBar.prototype.accountSearch = function(term, actual) {
  return browser.click(this._accountDrop).waitForExist(this._accountSearchField, 5000)
  .setValue(this._accountSearchField, term).waitForExist(this.searchResult('account', actual))
  .isExisting(this.searchResult('account',actual)).then(function (isExisting) {
    expect(isExisting).toBe(true);
  });
}

navBar.prototype.campaignSearch = function(term, actual) {
  return browser.click(this._campaignDrop).waitForExist(this._campaignSearchField, 5000)
  .setValue(this._campaignSearchField, term).waitForExist(this.searchResult('campaign', actual))
  .isExisting(this.searchResult('campaign',actual)).then(function (isExisting) {
    expect(isExisting).toBe(true);
  });
}

module.exports = navBar;
