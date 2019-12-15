import { NativeModules, DeviceEventEmitter, NativeEventEmitter, Platform } from 'react-native';

export type UploadEvent = 'resultVideo' | 'videoProgress';

let module = NativeModules.VodVideoUploader;
let eventPrefix = 'VodUploader-';
let deviceEmitter = Platform.OS === 'android' ? DeviceEventEmitter : module ? new NativeEventEmitter(module) : null;

// export const getFileInfo = (path: string): Promise<Object> => {
//     return module.getFileInfo(path).then(data => {
//         if (data.size) {
//             data.size = +data.size;
//         }
//         return data;
//     });
// };

export const startUpload = (signature: string, videoPath: string): Promise<string> => module.beginUpload(signature, videoPath);

// export const cancelUpload = (cancelUploadId: string): Promise<boolean> => {
//     if (typeof cancelUploadId !== 'string') {
//         return Promise.reject(new Error('Upload ID must be a string'));
//     }
//     return module.cancelUpload(cancelUploadId);
// };

export const addListener = (eventType: UploadEvent, listener: Function) => {
    return deviceEmitter.addListener(eventPrefix + eventType, (data : any) => {
        // console.log(data);       
        if (data) {
            listener(data);
        }
    });
};

export default {
    addListener,
    startUpload,
};
