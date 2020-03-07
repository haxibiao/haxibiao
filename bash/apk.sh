#!/bin/bash

yel=$'\e[1;33m'
grn=$'\e[1;32m'
red=$'\e[1;31m'
end=$'\e[0m'

app="haxibiao"

cd /data/app/$app/

echo "提示：参数upload可以让APK上传到CDN..."
if [ "$1" = "upload" ]; then

echo "${yel}开始上传 apk 正式包 ${end}"
node ./bash/nodejs/cos_upload_apk.js release

echo  -e "${grn}上传完成${end}"
echo "下载地址：http://$app-1251052432.cos.ap-guangzhou.myqcloud.com/$app-release.apk"

else

echo "清理旧的 app-release.apk ..."
if [ -f /data/app/$app/android/app/build/outputs/apk/release/app-release.apk ]; then
rm -rf /data/app/$app/android/app/build/outputs/apk/release/app-release.apk
fi

echo "${grn} 开始生成正式包 ... $app ... ${end}"
cd ./android
# ./gradlew clean
./gradlew assembleRelease 


echo "复制 $app apk 到/data/build ..."
[ ! -d /data/build ] && mkdir /data/build -p
/bin/cp -f /data/app/$app/android/app/build/outputs/apk/release/app-release.apk /data/build/$app.apk
echo "已复制到 $app 到 /data/build,可以发邮件用 ..."

fi