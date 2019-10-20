import React, { useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { observer, appStore } from '@src/store';
import { ttad } from '@src/native';
import Player from './Player';
import SideBar from './SideBar';
import VideoStore from '../VideoStore';

export default observer(props => {
    const { media, index } = props;
    const [adShow, setAdShow] = useState(true);
    if (media.isAdPosition && adShow && appStore.enableAd) {
        return (
            <View style={{ height: appStore.viewportHeight }}>
                <ttad.DrawFeedAd
                    onError={(error: any) => {
                        setAdShow(false);
                    }}
                    onAdClick={() => {
                        Toast.show({ content: '+1用户行为贡献', duration: 1500 });
                    }}
                />
            </View>
        );
    }
    return (
        <View style={{ height: appStore.viewportHeight }}>
            {media.cover && (
                <View style={styles.cover}>
                    <Image style={styles.curtain} source={{ uri: media.cover }} resizeMode="cover" blurRadius={4} />
                    <View style={styles.mask} />
                </View>
            )}
            <Player media={media} index={index} />
            <View style={styles.videoInfo}>
                <View style={styles.left}>
                    <View>
                        <Text style={styles.name}>@{Helper.syncGetter('user.name', media)}</Text>
                    </View>
                    <View>
                        <Text style={styles.body} numberOfLines={3}>
                            {media.body}
                        </Text>
                    </View>
                </View>
                <SideBar media={media} />
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    body: { color: 'rgba(255,255,255,0.9)', fontSize: Font(15), paddingTop: PxDp(10) },
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
        paddingBottom: 10,
        paddingRight: 40,
    },
    name: { color: 'rgba(255,255,255,0.9)', fontSize: Font(16), fontWeight: 'bold' },
    videoInfo: {
        bottom: Theme.HOME_INDICATOR_HEIGHT + PxDp(76),
        flexDirection: 'row',
        left: 0,
        paddingHorizontal: PxDp(Theme.itemSpace),
        position: 'absolute',
        right: 0,
    },
});
