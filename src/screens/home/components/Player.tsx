import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '~router';
import { Iconfont } from '~components';
import { useDoubleAction } from '~utils';
import { useApolloClient, ApolloProvider } from '~apollo';
import { observer } from '~store';
import VideoStore from '../VideoStore';
import VideoLoading from './VideoLoading';
import Operation from './Operation';
import Video from 'react-native-video';
import { Overlay } from 'teaset';

export default observer((props) => {
	const { media, index } = props;
	const navigation = useNavigation();
	const client = useApolloClient();
	const [progress, setProgress] = useState(0);
	const currentTime = useRef(0);
	const duration = useRef(100);
	const videoRef = useRef();
	const isIntoView = index === VideoStore.viewableItemIndex;
	const [paused, setPause] = useState(true);
	const [loading, setLoaded] = useState(true);
	const resizeMode = useMemo(() => {
		const videoHeight = Helper.syncGetter('video.info.height', media);
		const videoWidth = Helper.syncGetter('video.info.width', media);
		return videoHeight > videoWidth * 1.3 ? 'cover' : 'contain';
	}, [media]);

	const onLongPress = useCallback(() => {
		let overlayRef;
		const MoreOperationOverlay = (
			<Overlay.PopView
				style={styles.overlay}
				ref={(ref) => (overlayRef = ref)}
				containerStyle={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
				<ApolloProvider client={client}>
					<Operation
						navigation={navigation}
						onPressIn={() => overlayRef.close()}
						target={media}
						downloadUrl={Helper.syncGetter('video.url', media)}
						downloadUrlTitle={Helper.syncGetter('body', media)}
						options={['下载', '不感兴趣', '举报']}
					/>
				</ApolloProvider>
			</Overlay.PopView>
		);
		Overlay.show(MoreOperationOverlay);
	}, [client, media]);

	const togglePause = useCallback(() => {
		setPause((v) => !v);
	}, []);

	const giveALike = useCallback(() => {
		if (TOKEN && !media.liked) {
			media.liked ? media.count_likes-- : media.count_likes++;
			media.liked = !media.liked;
		}
	}, [TOKEN, media]);
	// 双击点赞、单击暂停视频
	const onPress = useDoubleAction(giveALike, 200, togglePause);

	const videoEvents = useMemo((): object => {
		return {
			onLoadStart() {
				setProgress(0);
				currentTime.current = 0;
				VideoStore.playedVideoIds.push(media.id);
			},

			onLoad(data) {
				duration.current = data.duration;
				setLoaded(false);
			},

			onProgress(data) {
				if (!media.watched) {
					((rewardProgress) => {
						setTimeout(() => {
							VideoStore.rewardProgress += rewardProgress;
						}, 20);
					})(data.currentTime - currentTime.current);
					if (Math.abs(currentTime.current - duration.current) <= 1) {
						media.watched = true;
					}
				}
				setProgress(data.currentTime);
				currentTime.current = data.currentTime;
			},

			onEnd() {},

			onError() {},

			onAudioBecomingNoisy() {
				setPause(true);
			},

			onAudioFocusChanged(event: { hasAudioFocus: boolean }) {
				videoRef.current.seek(0);
			},
		};
	}, []);

	useEffect(() => {
		setPause(!isIntoView);
		const navWillFocusListener = navigation.addListener('willFocus', () => {
			setPause(!isIntoView);
		});
		const navWillBlurListener = navigation.addListener('willBlur', () => {
			setPause(true);
		});
		return () => {
            navWillFocusListener();
            navWillBlurListener();
		};
	}, [isIntoView]);

	return (
		<TouchableWithoutFeedback onPress={onPress} onLongPress={onLongPress}>
			<View style={styles.playContainer}>
				<Video
					ref={videoRef}
					resizeMode={resizeMode}
					paused={paused}
					source={{
						uri: Helper.syncGetter('video.url', media),
					}}
					style={styles.fullScreen}
					rate={1} // 控制暂停/播放，0 代表暂停paused, 1代表播放normal.
					volume={1} // 声音的放大倍数，0 代表没有声音，就是静音muted, 1 代表正常音量 normal，更大的数字表示放大的倍数
					muted={false} // true代表静音，默认为false.
					progressUpdateInterval={150}
					disableFocus={true}
					useTextureView={false}
					repeat={true} // 是否重复播放
					ignoreSilentSwitch="obey"
					playWhenInactive={false}
					playInBackground={false}
					{...videoEvents}
				/>

				{paused && <Iconfont name="bofang1" size={PxDp(70)} color="rgba(255,255,255,0.8)" />}
				<View style={styles.bottom}>
					<VideoLoading loading={loading} />
					<View style={[styles.progress, { width: (progress / duration.current) * 100 + '%' }]} />
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
});

const styles = StyleSheet.create({
	overlay: { alignItems: 'center', justifyContent: 'center' },
	fullScreen: {
		bottom: 0,
		left: 0,
		position: 'absolute',
		right: 0,
		top: 0,
	},
	playContainer: {
		alignItems: 'center',
		bottom: 0,
		justifyContent: 'center',
		left: 0,
		position: 'absolute',
		right: 0,
		top: 0,
	},
	bottom: {
		position: 'absolute',
		zIndex: 99,
		left: 0,
		right: 0,
		bottom: PxDp(Theme.BOTTOM_HEIGHT),
		height: PxDp(1),
		backgroundColor: 'rgba(255,255,255,0.5)',
	},
	progress: {
		backgroundColor: '#fff',
		bottom: 0,
		height: PxDp(1),
		left: 0,
		position: 'absolute',
		width: 0,
	},
});
