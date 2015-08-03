#!/usr/bin/env bash
npm install
node ./node_modules/bower/bin/bower install

set +e
set +x

results=$(node ./node_modules/karma/bin/karma start --browsers Firefox --single-run)

fail=$(echo $results | tail -1 | grep FAIL)

if [ -z "${fail// }" ]
then
summary=$(cat coverage/text-summary.txt)
coverage=$(echo $summary | grep -o 'Statements[ ]*:[ ]*[0-9]*.[0-9]*%' | awk -F" " '{print $3}')
info=$(echo "$results" | tail -1 | awk -F":" '{print $2}' | sed -r "s/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[mGK]//g")
curl -XPOST -H "Authorization: token 40da8eeed353283720cc14c7433beb5462082c53" https://api.github.com/repos/Mixpo/obsidian/statuses/$(git rev-parse HEAD) -d "{
  \"state\": \"success\",
  \"target_url\": \"${BUILD_URL}\",
  \"description\": \"${info}. ${coverage} Statement Coverage.\"
}"
else
curl -XPOST -H "Authorization: token 40da8eeed353283720cc14c7433beb5462082c53" https://api.github.com/repos/Mixpo/obsidian/statuses/$(git rev-parse HEAD) -d "{
  \"state\": \"failure\",
  \"target_url\": \"${BUILD_URL}\",
  \"description\": \"${info}. ${coverage} Statement Coverage.\"
}"
set -e
exit 1
fi
