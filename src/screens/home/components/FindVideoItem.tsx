import React, { useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { observer } from '@src/store';
import { ad } from '@native';
import Player from './Player';
import SideBar from './SideBar';
import VideoStore from '../VideoStore';

export default observer(props => {
    const { media, index } = props;
    const [adShow, setAdShow] = useState(true);
    // if (media.isAdPosition && adShow) {
    //     return (
    //         <View style={{ height: VideoStore.viewportHeight }}>
    //             <ad.DrawFeedAd
    //                 onError={(error: any) => {
    //                     setAdShow(false);
    //                 }}
    //                 onAdClick={() => {
    //                     Toast.show({ content: `+1用户行为${Config.limitAlias}`, duration: 1500 });
    //                 }}
    //             />
    //         </View>
    //     );
    // }
    const { video } = media;
    return (
        <View style={{ height: '100%' }}>
            {video.info && video.info.covers.length > 0 && (
                <View style={styles.cover}>
                    <Image
                        style={styles.curtain}
                        source={{ uri: video.info.covers[0] }}
                        resizeMode="cover"
                    // blurRadius={4}
                    />
                    <View style={styles.mask} />
                </View>
            )}
            <Player media={media} index={index} />
            <View style={styles.videoInfo}>
                {/*  <View style={styles.left}>
                    <View>
                        <Text style={styles.name}>@{Helper.syncGetter('user.name', media)}</Text>
                    </View>
                    <View>
                        <Text style={styles.body} numberOfLines={3}>
                            {media.body}
                        </Text>
                    </View>
                </View> */}
                {/* <SideBar media={media} /> */}
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    body: { color: 'rgba(255,255,255,0.9)', fontSize: Font(12), paddingTop: PxDp(8) },
    cover: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    curtain: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: null,
        height: null,
    },
    mask: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    left: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 0,
        paddingRight: 40,
    },
    name: { color: 'rgba(255,255,255,0.9)', fontSize: Font(13), fontWeight: 'bold' },
    videoInfo: {
        bottom: Theme.HOME_INDICATOR_HEIGHT + PxDp(0),
        flexDirection: 'row',
        left: 0,
        paddingHorizontal: PxDp(Theme.itemSpace),
        position: 'absolute',
        right: 0,
    },
});
