// PAGE ELEMENTS
// Selectors:
// #  = id
// .  = class
// =  = contains specific text
// *= = contains partial text match
// xpath, css3 selectors also work.
//
 describe('New Ad Build by LMP Creative Producer', function () {

     var name = 'client_'+global.UUID;

   it('will log in as employee', function (done) {
     browser.login()
     .call(done);
   });

     it('will verify page load.', function (done) {
         browser.url('https://thorwhal-dev-api.mixpo.com/campaign-management')
            .validateClientPage();
     });

   it('will have new client via exact search', function(done) {

     browser
     .createInternalClient(name)
     .pause(2000)
     .searchClient(name,name)
     .call(done);
   });

     it('will navigate to new client\'s page', function(done) {
        browser.clientNavigate(name)
            .call(done);
     });
 });
