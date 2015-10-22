#!/bin/bash

git pull --rebase
grunt build:bower
git commit -a -m "built bower"
BOWER_TAG=$(bower version patch)
git push
git push origin $BOWER_TAG
cd ../thorwhal
bower install git@github.com:Mixpo/obsidian.git#$BOWER_TAG --save -F
git commit -a -m "Updated obsidian to $BOWER_TAG"
git push
echo "Bower version $BOWER_TAG deployed. You can now build thorwhal-dev.mixpo.com from build.mixpo.com"