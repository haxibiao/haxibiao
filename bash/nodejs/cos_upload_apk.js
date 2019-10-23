// 引入模块
var COS = require('cos-nodejs-sdk-v5');

// 使用永久密钥创建实例
var cos = new COS({
    SecretId: 'AKIDPbXCbj5C1bz72i7F9oDMHxOaXEgsNX0E',
    SecretKey: '70e2B4g27wWr1wf9ON8ev1rWzC9rKYXH',
});

let env = 'staging';
const args = process.argv.slice(2);
const app = args[0];
env = args[1];
// 分片上传
cos.sliceUploadFile(
    {
        Bucket: app + '-1251052432',
        Region: 'ap-guangzhou',
        Key: app + '-' + env + '.apk',
        FilePath: './android/app/build/outputs/apk/' + env + '/app-' + env + '.apk',
    },
    function(err, data) {
        console.log(err, data);
    },
);
