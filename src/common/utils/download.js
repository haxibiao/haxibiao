import { Dimensions, Platform, StatusBar, PixelRatio } from 'react-native';
// import RNFetchBlob from 'rn-fetch-blob';

export function download({ url, onSuccess, onFailed }) {
    return new Promise((resolve, reject) => {
        // LoadingProgress.show();
        // RNFetchBlob.config({
        //     useDownloadManager: true,
        //     fileCache: true,
        //     appendExt: 'mp4',
        // })
        //     .fetch('GET', url, {
        //         //headers
        //     })
        //     // listen to download progress event
        //     .progress((received, total) => {
        //         LoadingProgress.progress((received / total) * 100);
        //     })
        //     .then(res => {
        //         if (Platform.OS === 'android') {
        //             RNFetchBlob.fs.scanFile([{ path: res.path(), mime: 'video/mp4' }]);
        //         }
        //         // the temp file path
        //         LoadingProgress.hide();
        //         onSuccess && onSuccess();
        //         resolve(res.path());
        //     })
        //     .catch(error => {
        //         LoadingProgress.hide();
        //         onFailed && onFailed();
        //         reject(error);
        //     });
    });
}
