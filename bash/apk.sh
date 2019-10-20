#!/bin/bash

yel=$'\e[1;33m'
grn=$'\e[1;32m'
red=$'\e[1;31m'
end=$'\e[0m'

app="haxibiao"

cd /data/app/$app/

if [ "$1" = "upload" ]; then

echo "${yel}开始上传 apk 正式包"
node ./bash/nodejs/cos_upload_apk.js release

echo  -e "${grn}上传完成${end}"
echo "下载地址：http://$app-1251052432.cos.ap-shanghai.myqcloud.com/$app-release.apk"

else

echo "${grn}开始生成正式包 ..."
cd ./android
./gradlew assembleRelease 

fi