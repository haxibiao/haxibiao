/*
 * @flow
 * created by wyk made in 2019-01-14 11:44:03
 */

import { VideoUploader } from '@src/native';

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
    VideoUploader.getFileInfo(videoPath).then(metadata => {
        const options = Object.assign(
            {
                method: 'POST',
                type: 'multipart',
                field: 'video',
                headers: {
                    'content-type': 'multipart/form-data',
                    token: TOKEN,
                },
                parameters: {
                    videoName: metadata.name,
                    api_token: TOKEN,
                },
            },
            {
                url: Config.UploadServer + '/api/video',
                path: videoPath,
            },
        );
        onBeforeUpload && onBeforeUpload(metadata);
        console.log('metadata', metadata);
        VideoUploader.startUpload(options) // 上传
            .then(uploadId => {
                console.log('uploadId', uploadId);
                onStarted && onStarted(uploadId);
                VideoUploader.addListener('progress', uploadId, data => {
                    console.log('progerss', data);
                    onProcess && onProcess(parseInt(data.progress, 10)); // 上传进度
                });
                VideoUploader.addListener('completed', uploadId, data => {
                    console.log('completed', data);
                    onCompleted && onCompleted(data);
                });
                VideoUploader.addListener('cancelled', uploadId, data => {
                    onCancelled && onCancelled();
                });
                VideoUploader.addListener('error', uploadId, data => {
                    console.log('error', data);
                    onError ? onError(data) : Toast.show({ content: '视频上传失败' });
                });
            })
            .catch(err => {
                console.log('err', err);
                onError ? onError(data) : Toast.show({ content: '视频上传失败' });
            });
    });
}
