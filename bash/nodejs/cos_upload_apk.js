// 引入模块
var COS = require('cos-nodejs-sdk-v5');
var appConfig = require('../../app.json');

// 使用永久密钥创建实例
var cos = new COS({
    SecretId: 'AKIDPbXCbj5C1bz72i7F9oDMHxOaXEgsNX0E',
    SecretKey: '70e2B4g27wWr1wf9ON8ev1rWzC9rKYXH',
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
