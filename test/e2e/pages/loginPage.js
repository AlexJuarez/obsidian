function loginPage (email, password){
  this._email = email;
  this._password = password;
}

var userField = '#account',
    passwordField = '#password';

loginPage.prototype.validatePage = function(){
    console.log('validating login page');
    return browser
        .isExisting(this._email).then(function (exists){
            console.log('email field exists');
        })
        .isExisting(this._password).then(function (exists){
            console.log('password field exists');
        });
}

loginPage.prototype.goToWebsite = function () {
    return browser.url('https://thorwhal-dev-api.mixpo.com/campaign-management', function () {
        console.log('went to login page!');
    })
    .isExisting('#account').then(function(isExisting) {
        expect(isExisting).toBe(true);
        console.log('made it to the mixpo homepage!');
    });
}

loginPage.prototype.loginToWebsite = function () {
    if(!global.loggedIn){
      global.loggedIn = true;
      return this.goToWebsite()
        .isExisting('#account').then(function (isExisting) {
            expect(isExisting).toBe(true);
        })
        .setValue(userField, this._email)
        .setValue(passwordField, this._password)
        .click(passwordField)
        .keys('Enter')
        .waitForExist('#navbar-campaign-management-tab',10000)
        .getTitle(function (err, title) {
          expect(err).toBeFalsy();
          expect(title).toBe('Narwhal');
          console.log('NARWHALS NARWHALS SWIMMING IN THE OCEAN!!!');
        });
    }else{
      console.log('already logged in');
      return browser.url('https://thorwhal-dev-api.mixpo.com/campaign-management').pause(500);
    }
}

module.exports = loginPage;
