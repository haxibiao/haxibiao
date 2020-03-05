import { NativeModules, Platform } from 'react-native';
import {
    TTAppID,
    TTAppIDIOS,
    CodeIdFeedIOS,
    CodeIdFeed
} from '@app/app.json';
import { appStore } from '@src/store';

//这里决策这个APP需要init的sdk...
let { AdManager } = NativeModules;

export const init = () => {
    let appid = '';
    //init 所有 后端 加载的appid provider codeids
    let {
        tt_appid,
        tx_appid,
        bd_appid,
        splash_provider,
        feed_provider,
        reward_video_provider,
        codeid_splash,
        codeid_splash_tencent,
        codeid_splash_baidu,
        codeid_feed,
        codeid_feed_tencent,
        codeid_feed_baidu,
        codeid_draw_video,
        codeid_full_video,
        codeid_reward_video,
        codeid_reward_video_tencent,
    } = appStore;
    if (tt_appid) {
        appid = tt_appid;
        AdManager.init({
            tt_appid,
            tx_appid,
            bd_appid,
            splash_provider,
            feed_provider,
            reward_video_provider,
            codeid_splash,
            codeid_splash_tencent,
            codeid_splash_baidu,
            codeid_feed,
            codeid_feed_tencent,
            codeid_feed_baidu,
            codeid_draw_video,
            codeid_full_video,
            codeid_reward_video,
            codeid_reward_video_tencent
        });
    }

    if (appid === '') {
        //如果没有后端加载的appid，默认用json里的
        appid = Platform.OS === 'ios' ? TTAppIDIOS : TTAppID;
        AdManager.init({ appid });
    }

};

//弹层前可以考虑预加载FeedAd
export const loadFeedAd = () => {
    let { codeid_feed, feed_provider } = appStore;
    let codeid = codeid_feed;
    if (!codeid)
        codeid = Platform.OS === 'ios' ? CodeIdFeedIOS : CodeIdFeed;
    return AdManager.loadFeedAd({ codeid, provider: feed_provider });
}

export default { init, loadFeedAd };
