import { NativeModules, DeviceEventEmitter, NativeEventEmitter, Platform } from 'react-native';

export type UploadEvent = 'resultVideo' | 'videoProgress';

let module = Platform.OS === 'android' ? NativeModules.VodVideoUploader : NativeModules.VodUploader;
let eventPrefix = 'VodUploader-';
let deviceEmitter = Platform.OS === 'android' ? DeviceEventEmitter : module ? new NativeEventEmitter(module) : null;

export const startUpload = (signature: string, videoPath: string): Promise<string> => module.beginUpload(signature, videoPath);

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
