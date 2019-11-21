// 引入模块
var COS = require('cos-nodejs-sdk-v5');
var appConfig = require('../../app.json');


// 使用永久密钥创建实例
var cos = new COS({
    SecretId: 'AKIDKZeYH6uMdqyxkxKyhFuQ0W5ThliVtWlq',
    SecretKey: '61nNlyzqWxLbgaIpBMPM8lCWfeSAkEaq',
});

var env = 'staging';
const args = process.argv.slice(2);
env = args[0];
// 分片上传
cos.sliceUploadFile(
    {
        Bucket: appConfig.name + '-1254284941',
        Region: 'ap-guangzhou',
        Key: appConfig.name + '-' + env + '.apk',
        FilePath: './android/app/build/outputs/apk/' + env + '/app-' + env + '.apk',
    },
    function(err, data) {
        if(err){
            console.log(err);
        } else {
            console.log("\n🐄🍺 " + appConfig.DisplayName + " v" + appConfig.Version + " 下载地址：http://" + data.Location + "\n");
        }
        // console.log(err, data);
    },
);
