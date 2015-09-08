#![Obsidian](http://obsidian.mixpo.com/images/obsidian-iconx32.png)Obsidian Style Guide / Frontend UI

http://obsidian.mixpo.com

The client code lives in app

the compiled version is in dist

* webfonts requires `sudo apt-get install fontforge ttfautohint` - (https://github.com/sapegin/grunt-webfont)

This project also requires

* `npm install -g grunt-cli`
* `npm install -g bower`
* `npm install -g karma-cli`
* `bower install`

## Current Grunt Tasks

* `grunt workon` - starts a local server
* `grunt build` builds the distribution version
* `grunt build:bower` builds the core version
* `grunt --proxy https://narwhal-dev-api.mixpo.com` Proxy API requests to a server of your choosing

## Running tests

The test runner for this project is karma.

* `karma start`

## Deploying to obsidian.mixpo.com

To deploy you will need to install [pm2](https://github.com/Unitech/pm2)

* `npm install pm2 -g` should do the trick

Then to deploy to the server from the obsidian directory run

* `pm2 deploy production`

The deployment settings can be found in the ecosystem.json
