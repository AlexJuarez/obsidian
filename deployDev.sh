#!/bin/bash
read -r -p "Are you sure? [y/N] " response
if [[ $response =~ ^([yY][eE][sS]|[yY])$ ]]
then
    echo "Deploying..."
else
    exit 0
fi

#Build the bower package
git fetch
git rebase
grunt build:bower
# We need to deploy the font icons manually 
cp -R build/fonts/* ../thorwhal/public/fonts
git commit -a -m "built bower package"

#Tag the release
BOWER_TAG=$(bower version patch)
git push
git push origin $BOWER_TAG

#Update obsidian on Thorwhal
cd ../thorwhal
git fetch
git rebase
bower install git@github.com:Mixpo/obsidian.git#$BOWER_TAG --save -F
git commit -a -m "Updated obsidian to $BOWER_TAG"
git push
echo "Bower version $BOWER_TAG deployed. You can now build thorwhal-dev.mixpo.com from build.mixpo.com"
exit 0