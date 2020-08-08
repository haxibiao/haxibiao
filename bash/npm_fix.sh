#!/bin/bash

echo "修复ios 0.63打包bundle遇到gql导入问题"
/bin/cp -rf ./bash/npm_fix/* ./node_modules/
echo "yarn的node_modules如果删除过，重新执行 yarn build:ios"