//var webbrowserio = require('webbrowserio');
//var options = { 
//  desiredCapabilities: { browserName: 'firefox' }
//};

//var browser = {};

var LoginPage = (function( ) {

  var userField = '#account',
      passwordField = '#password';

  this.goToWebsite = function() {
    browser
      .url('http://studio.mixpo.com', function() {
        console.log('went to http://studio.mixpo.com');
      })
      
      .getTitle(function(err,title){
        expect(err).toBeFalsy();
        expect(title).toBe('Sign in to your Mixpo SmartVideo advertising account'); 
        console.log('made it to the mixpo homepage!');
      });
    return browser;
  };
/*
  this.setEmail = function(strEmail) {
    browser
      .setValue(userField, strEmail, function() {
        console.log('set email');
    });
    return browser;
  };

  this.setPassword = function(strPassword) {
      browser
          .setValue(passwordField, strPassword, function() {
              console.log('set password');
          });
      return browser;
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
      return browser;
  };

});

describe('New Ad Build by LMP Creative Producer', function () {

//  jasmine.DEFAULT_TIMEOUT_INTERVAL = 9999999;

//  beforeEach(function (done) {
//    browser = webbrowserio.remote( );
//    browser.init(done);
//  });

//  afterEach(function(done) {
//    browser.end(done);
//  });

  it('will have no account ____', function(done) {
/*
    loginPage = new LoginPage();
    loginPage.goToWebsite();
    loginPage.setEmail('rawr');
    loginPage.setPassword('lols');
*/
    loginPage = new LoginPage();
    loginPage.loginToWebsite('rawr','lulz');

    browser.pause(30000)
      .call(done);
    //  .setEmail('rawr')
    //  .setPassword('lols')
    //  .click(loginPage.passwordField)
    //  .keys('Enter')
    //  .call(done);
    //browser.call(done);
/*
    browser
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
    //browser.call(done);
  });

});  


