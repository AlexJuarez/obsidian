# End 2 end tests!

# Requirements
Globally install webdriverio and jasmine.
`npm install -g webdriverio`
`npm install -g jasmine`

## To run tests:
You'll want three terminals. One to run a local selenium server, one to run a local webserver, and one to run your tests.
`npm install`
Local selenium server. `./startSelenium`
Local webserver. `grunt --proxy https://thorwhal-dev-api.mixpo.com` 
`wdio wdio.conf.js` from the obsidian/test/e2e folder.

##Test files 
Go in the spec folder. 
Make sure to follow the name scheme NAME.spec.js

## Page files 
Go in the pages folder.
