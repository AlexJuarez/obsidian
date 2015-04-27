###Frontend UI

The client code lives in app

the compiled version is in dist

* webfonts requires `sudo apt-get install fontforge ttfautohint` - (https://github.com/sapegin/grunt-webfont)

This project also requires

* `npm install -g grunt-cli`
* `npm install -g bower`
* `bower install`

## Current Grunt Tasks

* `grunt workon` - starts a local server
* `grunt build` builds the distribution version
* `grunt build:bower` builds the core version
