#!/bin/bash

#执行之前，打印出来命令
set -x

coderoot=$PWD

node ${coderoot}/node_modules/react-native/cli.js bundle --entry-file index.js --platform ios --dev false --reset-cache \
--bundle-output "${coderoot}/build/main.jsbundle" \
--assets-dest "${coderoot}/build"

echo "记得 bash里还需要执行的操作 \n " 
echo " - react-native-xcode.sh 里的 coderoot更新.... \n "
echo " - yarn的node_modules如果删除过，重新执行 ./bash/npm_fix.sh"