/*
 * @flow
 * created by wyk made in 2019-07-01 14:03:10
 */
import { observable, action, reaction } from 'mobx';
import Orientation from 'react-native-orientation';
import Video from 'react-native-video';
// import { Api, Tools } from '../../utils';
import appStore from './appStore';

type Status = 'error' | 'notWifi' | 'loading' | 'finished' | 'hide';
type Layout = 'portrait' | 'landscape';

export default class PlayerStore {
    @observable videoRef: Video = null;
    @observable video: Object = {};
    @observable dimension: Object = {};
    @observable orientation: Layout = 'portrait';
    @observable inScreen: boolean = false;
    @observable status: Status = 'hide';
    @observable showControl: boolean = false;
    @observable sliderMoveing: boolean = false;
    @observable paused: boolean = false;
    @observable currentTime: number = 0;
    @observable sliderValue: number = 0;
    @observable duration: number = 0;
    @observable controlIntervel: any = null;

    constructor(props) {
        let { video, navigation, inScreen } = props;

        this.video = video;
        this.navigation = navigation;
        if (Helper.syncGetter('width', video) > Helper.syncGetter('height', video)) {
            this.orientation = 'landscape';
        } else {
            this.orientation = 'portrait';
        }
        if (appStore.connectionInfoType !== 'wifi') {
            this.status = 'notWifi';
            this.paused = true;
        }
        if (inScreen) {
            appStore.isFullScreen = true;
            this.inScreen = true;
            this.changeOrientation();
        }
        reaction(
            () => appStore.connectionInfoType,
            (connectionInfoType) => {
                if (connectionInfoType === 'wifi') {
                    this.continueToPlay();
                }
            },
        );
    }

    @action.bound
    public play() {
        this.paused = false;
    }

    @action.bound
    public pause() {
        this.paused = true;
    }

    @action.bound
    getVideoRef(ref: any) {
        this.videoRef = ref;
    }

    //有异常，应该暂停播放
    @action.bound
    onAudioBecomingNoisy() {
        console.log('onAudioBecomingNoisy...');
        this.paused = true;
    }

    //失去声音聚焦，也暂停
    @action.bound
    onAudioFocusChanged(event: { hasAudioFocus: boolean }) {
        console.log('onAudioFocusChanged ...', event);
        this.videoRef.seek(0);
        if (!this.paused && !event.hasAudioFocus) {
            this.paused = true;
        }
    }

    @action.bound
    loadStart() {
        this.status = 'loading';
    }

    @action.bound
    onLoaded(data) {
        this.duration = data.duration;
        this.status = 'hide';
    }

    @action.bound
    onProgressChanged(data) {
        if (!this.paused && !this.sliderMoveing) {
            this.currentTime = data.currentTime;
        }
    }

    @action.bound
    onPlayEnd() {
        this.paused = true;
        this.status = 'finished';
    }

    @action.bound
    onPlayError() {
        this.status = 'error';
        Toast.show({ content: '播放失败，请重新尝试' });
    }

    @action.bound
    controlSwitch() {
        this.showControl = !this.showControl;
        if (this.showControl && !this.paused) {
            this.controlVisibleInterval();
        }
    }

    @action.bound
    continueToPlay() {
        this.status = 'hide';
        this.paused = false;
    }

    @action.bound
    playButtonHandler() {
        this.controlIntervel && clearInterval(this.controlIntervel);
        this.paused = !this.paused;
        if (!this.paused) {
            this.controlVisibleInterval();
        }
    }

    @action.bound
    onFullScreen() {
        appStore.isFullScreen = !appStore.isFullScreen;
        console.log('this.inScreen', this.inScreen);
        if (this.inScreen) {
            Orientation.unlockAllOrientations();
            Orientation.lockToPortrait();
            this.navigation.goBack();
        } else {
            this.changeOrientation();
        }
        // Orientation.unlockAllOrientations();
        // if (this.isFullScreen) {
        // 	this.navigation.goBack();
        // 	Orientation.lockToPortrait();
        // } else {
        // 	if (this.orientation === 'landscape') {
        // 		Orientation.lockToLandscape();
        // 	}
        // 	this.navigation.navigate('VideoExplanation', { video: this.video });
        // }
    }

    @action.bound
    changeOrientation() {
        if (this.orientation === 'landscape') {
            Orientation.unlockAllOrientations();
            if (appStore.isFullScreen) {
                Orientation.lockToLandscape();
            } else {
                Orientation.lockToPortrait();
            }
        }
    }

    @action.bound
    onSliderValueChanged(sliderValue) {
        this.sliderValue = sliderValue;
        this.sliderMoveing = true;
        this.controlIntervel && clearInterval(this.controlIntervel);
    }

    @action.bound
    onSlidingComplete(sliderValue) {
        this.sliderMoveing = false;
        this.currentTime = sliderValue;
        this.videoRef.seek(sliderValue);
        this.controlVisibleInterval();
    }

    @action.bound
    controlVisibleInterval() {
        this.controlIntervel && clearInterval(this.controlIntervel);
        this.controlIntervel = setTimeout(() => {
            this.showControl = false;
        }, 4000);
    }

    @action.bound
    replay() {
        this.videoRef.seek(0);
        this.currentTime = 0;
        this.status = 'hide';
        setTimeout(() => {
            this.paused = false;
        }, 100);
    }
}
