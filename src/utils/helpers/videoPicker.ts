/*
 * @flow
 * created by wyk made in 2019-01-14 10:44:51
 */
import ImagePicker from 'react-native-image-crop-picker';
import { videoUpload, UploadOption } from './videoUpload';

export function videoPicker(onPickerVideo?: Function, options: UploadOption) {
	ImagePicker.openPicker({
		multiple: false,
		mediaType: 'video',
	})
		.then((video) => {
			let videoPath = video.path.substr(7);
			options.videoPath = videoPath;
			onPickerVideo && onPickerVideo(video);
			videoUpload(options);
		})
		.catch((err) => {
			console.log(err);
		});
}
