var browserSingleton = require('../browser');
browserSingleton.addCommand('asdf', function() {browser.url('http://www.google.com')
  .getTitle(function (err, title) {
    expect(err).toBeFalsy();
    expect(title).toBe('asdfasfadfads');
    console.log('NARWHALS NARWHALS SWIMMING IN THE OCEAN!!!');
  })
;});
browserSingleton = require('../browser');


function LoginPage (email, password){
  this._email = email;
  this._password = password;
}

var userField = '#account',
    passwordField = '#password';

LoginPage.prototype.validatePage = function(){
    console.log('validating login page');
    return browser
        .isExisting(this._email).then(function (exists){
            console.log('email field exists');
        })
        .isExisting(this._password).then(function (exists){
            console.log('password field exists');
        });
};

LoginPage.prototype.goToWebsite = function () {
    return browser.url('https://thorwhal-dev-api.mixpo.com/campaign-management', function () {
        console.log('went to login page!');
    })
    .isExisting('#account').then(function(isExisting) {
        expect(isExisting).toBe(true);
        console.log('made it to the mixpo homepage!');
    });
};

LoginPage.prototype.loginToWebsite = function () {
    if(!global.loggedIn){
      global.loggedIn = true;
      console.log(this);
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
};

browserSingleton.addCommands(LoginPage, 'automated-tester-employee','b1xR5*h-D$#h@2(8aCm!V&');

module.exports = LoginPage;
