//define( function(require){
//	require('loginPage');
	var webdriverio = require('webdriverio');
	var options = {
	    desiredCapabilities: {
	        browserName: 'firefox'
	    }
	};

var landingPage;
 
//	webdriverio
//		.remote(options)
//    		.init()
//    		.url('http://www.google.com')
//    		.title(function(err, res) {
//    			console.log('Title was: ' + res.value);
//    		})
//    		.end();

//before: function(){
//  landingPage = LoginPage.loginToWebsite('test','testpw');
//}
	
describe('New Ad Build by LMP Creative Producer', function () {
  it('will have no account ____', function(done) {
    landingPage.
    .call(done);
  });
});  

//});
