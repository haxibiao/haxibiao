import React, { Component, useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, View, ScrollView, Image, Text } from 'react-native';
import { videoPicker, videoUpload, imagePicker } from '@src/common';
import Video from 'react-native-video';
import ImageViewer from 'react-native-image-zoom-viewer';
import Iconfont from '../Iconfont';
import TouchFeedback from '../Basic/TouchFeedback';
import OverlayViewer from '../Popup/OverlayViewer';
import ProgressOverlay from '../Popup/ProgressOverlay';
import PullChooser from '../Popup/PullChooser';

const maxMediaWidth = Device.WIDTH - Theme.itemSpace * 4;
const mediaWidth = maxMediaWidth / 3;

interface VideoProps {
    width: number;
    height: number;
    path: string;
}

interface Props {
    type?: 'video' | 'image' | 'default';
    style?: any;
    maxWidth?: number;
    maximum?: number;
    onResponse: (res: any) => any;
}

const VideoUploadView = (props: Props) => {
    const { type, style, maxWidth, maximum, onResponse } = props;
    const [images, setImages] = useState([]);
    const [video, setVideo] = useState();
    const [videoSize, setVideoSize] = useState();

    const selectAlbum = useCallback(() => {
        const operations = [
            {
                title: '上传视频',
                onPress: videoUploadHandler,
            },
            {
                title: '选择图片',
                onPress: imagePickerHandler,
            },
        ];
        PullChooser.show(operations, 'pop');
    }, []);

    const onPressHandler = useCallback(() => {
        if (video || type === 'video') {
            videoUploadHandler();
        } else if (images.length > 0 || type === 'image') {
            imagePickerHandler();
        } else {
            selectAlbum();
        }
    }, [video, images]);

    const imagePickerHandler = useCallback(() => {
        imagePicker(
            images => {
                let imagesPath;
                if (maximum > 1) {
                    imagesPath = images.map(image => `data:${image.mime};base64,${image.data}`);
                } else {
                    imagesPath = [`data:${images.mime};base64,${images.data}`];
                }
                setImages(prevImages => {
                    const newImages = prevImages.concat(imagesPath);
                    if (newImages.length > maximum) {
                        newImages.splice(maximum);
                        Toast.show({ content: `最多上传${maximum}张图片` });
                    }
                    return newImages;
                });
            },
            {
                multiple: maximum > 1,
                includeBase64: true,
            },
        );
    }, []);

    const removeImage = useCallback(ImageIndex => {
        setImages(prevImages => {
            prevImages.splice(ImageIndex, 1);
            return [...prevImages];
        });
    }, []);

    const showImage = useCallback(
        initIndex => {
            const imageUrls = images.map(image => {
                return { url: image };
            });
            const overlayView = (
                <ImageViewer
                    onSwipeDown={() => OverlayViewer.hide()}
                    imageUrls={imageUrls}
                    index={initIndex}
                    enableSwipeDown={true}
                />
            );
            OverlayViewer.show(overlayView);
        },
        [images],
    );

    const showVideo = useCallback(path => {
        const overlayView = (
            <Video
                source={{
                    uri: path,
                }}
                style={{ ...StyleSheet.absoluteFill }}
                muted={false}
                paused={false}
                resizeMode="contain"
            />
        );
        OverlayViewer.show(overlayView);
    }, []);

    const deleteVideo = useCallback(() => {
        setVideo(null);
        onResponse(null);
    }, []);

    useEffect(() => {
        if (video) {
            setVideoSize(Helper.ResponseMedia(video.width, video.height, maxWidth || maxMediaWidth));
        }
    }, [video]);

    const videoUploadHandler = useCallback(() => {
        videoPicker(
            uploadVideo => {
                setVideo(uploadVideo);
            },
            {
                onBeforeUpload: metadata => {
                    if (metadata.duration > 60) {
                        setVideo(null);
                        Toast.show({
                            content: `视频时长需在${60}秒以内`,
                        });
                        throw Error(`视频时长需在${60}秒以内`);
                    }
                },
                onStarted: uploadId => {
                    ProgressOverlay.show('正在上传...');
                },
                onProcess: (progress:number) => {
                    // 设置上传进度回调方法
                    ProgressOverlay.progress(progress);
                },
                onCompleted: (data: any) => {
                    // console.log("测试vod返回",data);
                    if (data.video_id) {
                        ProgressOverlay.hide();
                        Toast.show({
                            content: '视频上传成功',
                        });
                        onResponse(data);
                    } else {
                        onUploadError();
                    }
                },
                onError: () => onUploadError(),
            },
        );
    }, []);

    const onUploadError = useCallback(() => {
        ProgressOverlay.hide();
        Toast.show({
            content: '上传失败',
        });
        setVideo(null);
    }, []);

    useEffect(() => {
        onResponse(images);
    }, [images]);

    const Album = useMemo(() => {
        return images.map((path, index) => {
            return (
                <TouchFeedback
                    activeOpacity={1}
                    key={index}
                    onPress={() => showImage(index)}
                    style={[styles.uploadView, style]}>
                    <Image source={{ uri: path }} style={styles.imageItem} />
                    <TouchFeedback style={styles.close} onPress={() => removeImage(index)}>
                        <Iconfont name="guanbi1" size={PxDp(12)} color="#fff" />
                    </TouchFeedback>
                </TouchFeedback>
            );
        });
    }, [images]);

    if (video) {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchFeedback activeOpacity={1} onPress={() => showVideo(video.path)}>
                    <Video
                        muted={true}
                        repeat={true}
                        style={[styles.uploadView, { marginRight: 0 }, videoSize]}
                        resizeMode="cover"
                        source={{
                            uri: video.path,
                        }}
                    />
                    <View style={styles.playMark}>
                        <TouchFeedback style={styles.close} onPress={deleteVideo}>
                            <Iconfont name="guanbi1" size={PxDp(12)} color="#fff" />
                        </TouchFeedback>
                    </View>
                </TouchFeedback>
            </View>
        );
    } else if (images.length > 0) {
        return (
            <View style={styles.albumContainer}>
                {Album}
                {images.length < maximum && (
                    <TouchFeedback activeOpacity={0.8} onPress={imagePickerHandler} style={[styles.uploadView, style]}>
                        <Iconfont name="iconfontadd" size={PxDp(30)} color={Theme.slateGray1} />
                    </TouchFeedback>
                )}
            </View>
        );
    }
    return (
        <TouchFeedback activeOpacity={0.8} onPress={onPressHandler} style={[styles.uploadView, style]}>
            <Iconfont name="iconfontadd" size={PxDp(30)} color={Theme.slateGray1} />
        </TouchFeedback>
    );
};

const styles = StyleSheet.create({
    albumContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    close: {
        alignItems: 'center',
        backgroundColor: 'rgba(32,30,51,0.8)',
        borderRadius: PxDp(18) / 2,
        height: PxDp(18),
        justifyContent: 'center',
        position: 'absolute',
        right: PxDp(3),
        top: PxDp(3),
        width: PxDp(18),
    },
    imageItem: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    playMark: {
        ...StyleSheet.absoluteFill,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: PxDp(5),
        justifyContent: 'center',
    },
    uploadView: {
        alignItems: 'center',
        backgroundColor: Theme.slateGray2,
        borderRadius: PxDp(5),
        height: mediaWidth,
        justifyContent: 'center',
        marginRight: Theme.itemSpace,
        overflow: 'hidden',
        width: mediaWidth,
    },
});

VideoUploadView.defaultProps = {
    type: 'default',
    maximum: 9,
};

export default VideoUploadView;
