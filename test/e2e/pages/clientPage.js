var ClientModal = require('./clientModal');
var AccountModal = require('./accountModal');
var clientModal,
    accountModal;

function clientPage (){
  clientModal = new ClientModal();
    accountModal = new AccountModal();
  this._newClientBtn = '[ng-click=\"openNewClientModal()\"]';
    this._newAccountBtn = '[ng-click=\"openNewAccountModal()\"]';
    this._editAccountBtn = '[ng-click=\"openEditClientModal()\"]';
}

clientPage.prototype.validatePage = function(){
    console.log('validating clientPage');
    return browser
        .isExisting(this._newClientBtn).then(function (exists){
            console.log('new client button exists');
        })
        .isExisting(this._newAccountBtn).then(function (exists){
            console.log('new account button exists');
        })
        .isExisting(this._editAccountBtn).then(function (exists){
            console.log('edit account button exists');
        });
}

clientPage.prototype.createInternalClient = function(name) {
    console.log('creating client: '+name);
    return browser
      .pause(2000)
    .click(this._newClientBtn).waitForExist(clientModal._selectChannel).pause(500)
    .waitForExist(clientModal.channelSelect('Mixpo Internal'))
    .click(clientModal.channelSelect('Mixpo Internal'))
    .setValue(clientModal._nameField, name)
    .click(clientModal._saveBtn);
}

clientPage.prototype.createNewAccount = function(name) {
    console.log('creating account: '+name);
    return browser
        .pause(2000)
        .click(this._newAccountBtn).waitForExist(accountModal._accountIndustrySelect).pause(500)
        .isExisting(accountModal._nameField).then(function (isExisting){
            expect(isExisting).toBe(true);
        })
        .waitForExist(accountModal.industrySelect('Business to Business')) //hahaBUSINESS!!.jpg
        .click(accountModal.industrySelect('Business to Business'))
        .setValue(accountModal._nameField, name)
        .setValue(accountModal._keywordsField, 'word1')
        .setValue(accountModal._clickthroughField, 'www.mixpo.com')
        .setValue(accountModal._leadCaptureEmailField, 'test@mixpo.com')
        .click(accountModal._saveAccountBtn);
}

module.exports = clientPage;
