var webdriverio = require('webdriverio');
var options = { 
  desiredCapabilities: { browserName: 'firefox' }
};

var driver = {};

var LoginPage = (function( ) {

  var userField = '#account',
      passwordField = '#password';

  this.goToWebsite = function() {
    driver
      .url('http://studio.mixpo.com', function() {
        console.log('went to http://studio.mixpo.com');
      })
      
      .getTitle(function(err,title){
        expect(err).toBeFalsy();
        expect(title).toBe('Sign in to your Mixpo SmartVideo advertising account'); 
        console.log('made it to the mixpo homepage!');
      });
    return driver;
  };
/*
  this.setEmail = function(strEmail) {
    driver
      .setValue(userField, strEmail, function() {
        console.log('set email');
    });
    return driver;
  };

  this.setPassword = function(strPassword) {
      driver
          .setValue(passwordField, strPassword, function() {
              console.log('set password');
          });
      return driver;
  };
*/
  this.loginToWebsite = function(strEmail, strPassword) { 
      var self = this;
      this.goToWebsite()
        .getTitle(function(err,title){
          expect(err).toBeFalsy();
          expect(title).toBe('Sign in to your Mixpo SmartVideo advertising account'); 
          console.log('checkin it twice!');
        })
        .setValue(userField, strEmail)
        .setValue(passwordField, strEmail)
        .click(passwordField)
        .keys('Enter')
        .getTitle(function(err,title){
          expect(err).toBeFalsy();
          expect(title).not.toBe('Sign in to your Mixpo SmartVideo advertising account'); 
        });
      return driver;
  };

});

describe('New Ad Build by LMP Creative Producer', function () {

  jasmine.DEFAULT_TIMEOUT_INTERVAL = 9999999;

  beforeEach(function (done) {
    driver = webdriverio.remote( );
    driver.init(done);
  });

  afterEach(function(done) {
    driver.end(done);
  });

  it('will have no account ____', function(done) {
/*
    loginPage = new LoginPage();
    loginPage.goToWebsite();
    loginPage.setEmail('rawr');
    loginPage.setPassword('lols');
*/
    loginPage = new LoginPage();
    loginPage.loginToWebsite('rawr','lulz');

    driver.pause(30000)
      .call(done);
    //  .setEmail('rawr')
    //  .setPassword('lols')
    //  .click(loginPage.passwordField)
    //  .keys('Enter')
    //  .call(done);
    //driver.call(done);
/*
    driver
      .url('http://studio.mixpo.com')
      .getTitle(function(err,title){
        expect(err).toBeFalsy();
        expect(title).toBe('Sign in to your Mixpo SmartVideo advertising account'); 
      })
      .call(done);
*/
    //landingPage.
    //console.log('should be logged in off the loginpage');
    //expect(true).toBe(true);
    //driver.call(done);
  });

});  


