/*
 * @flow
 * created by wyk made in 2019-01-14 11:44:03
 */

import { VideoUploader, VodUploader } from '@src/native';

export const { cancelUpload } = VideoUploader;

export type UploadOption = {
    videoPath: string,
    onBeforeUpload?: Function,
    onStarted?: Function,
    onProcess?: Function,
    onCancelled?: Function,
    onCompleted?: Function,
    onError?: Function,
};

export function videoUpload(props: UploadOption) {
    const { videoPath, onBeforeUpload, onStarted, onProcess, onCancelled, onCompleted, onError } = props;
    // VideoUploader.getFileInfo(videoPath).then(metadata => {
    //     const options = Object.assign(
    //         {
    //             method: 'POST',
    //             type: 'multipart',
    //             field: 'video',
    //             headers: {
    //                 'content-type': 'multipart/form-data',
    //                 token: TOKEN,
    //             },
    //             parameters: {
    //                 videoName: metadata.name,
    //                 api_token: TOKEN,
    //             },
    //         },
    //         {
    //             url: Config.UploadServer + '/api/video',
    //             path: videoPath,
    //         },
    //     );
    //     onBeforeUpload && onBeforeUpload(metadata);
    //     console.log('videoPath', videoPath);
    //     // VideoUploader.startUpload(options) // 上传
    //     //     .then(uploadId => {
    //     //         console.log('uploadId', uploadId);
    //     //         onStarted && onStarted(uploadId);
    //     //         VideoUploader.addListener('progress', uploadId, data => {
    //     //             console.log('progerss', data);
    //     //             onProcess && onProcess(parseInt(data.progress, 10)); // 上传进度
    //     //         });
    //     //         VideoUploader.addListener('completed', uploadId, data => {
    //     //             console.log('completed', data);
    //     //             onCompleted && onCompleted(data);
    //     //         });
    //     //         VideoUploader.addListener('cancelled', uploadId, data => {
    //     //             onCancelled && onCancelled();
    //     //         });
    //     //         VideoUploader.addListener('error', uploadId, data => {
    //     //             console.log('error', data);
    //     //             onError ? onError(data) : Toast.show({ content: '视频上传失败' });
    //     //         });
    //     //     })
    //     //     .catch(err => {
    //     //         console.log('err', err);
    //     //         onError ? onError(data) : Toast.show({ content: '视频上传失败' });
    //     //     });
    // });

    fetch('https://haxibiao.com/api/signature/vod-' + Config.Name, { method: 'GET' })
        .then(response => {
            return response.text();
        })
        .then(res => {
            // console.log('res', res);
            onStarted && onStarted("111111");
            VodUploader.startUpload(res, videoPath).then((publishCode:any) => {
                if (publishCode !== 0) {
                    // vod上传失败
                    Toast.show({ content: '视频上传失败，请稍后重试' });
                } else {
                    VodUploader.addListener('videoProgress', (data: any) => {
                        const progerss = (data.upload_bytes / data.total_bytes) * 100;
                        console.log('videoProgress', progerss);
                        onProcess && onProcess(progerss || 0);
                    });

                    VodUploader.addListener('resultVideo', (data: any) => {
                        console.log('resultVideo', data);
                        onCompleted && onCompleted(data);
                    });
                }
            });
        })
        .catch(error => {
            console.log('提示', error);
        });
}
