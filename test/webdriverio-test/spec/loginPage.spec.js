var LoginPage = (function( ) {

  var userField = '#account',
      passwordField = '#password';

  this.goToWebsite = function() {
    return browser .url('http://studio.mixpo.com', function() {
      console.log('went to http://studio.mixpo.com');
    })
    .getTitle(function(err,title){
      expect(err).toBeFalsy();
      expect(title).toBe('Sign in to your Mixpo SmartVideo advertising account'); 
      console.log('made it to the mixpo homepage!');
    });
  };

  this.loginToWebsite = function(strEmail, strPassword) { 
  return this.goToWebsite()
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
  };

});

describe('New Ad Build by LMP Creative Producer', function () {

  it('will have no account ____', function(done) {
    loginPage = new LoginPage();
    loginPage.loginToWebsite('rawr','lulz')
    .call(done);
    });

});  

