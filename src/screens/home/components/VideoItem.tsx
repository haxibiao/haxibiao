import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { SafeText } from '@src/components';
import { observer, appStore } from '@src/store';
import { ttad } from '@src/native';
import { useNavigation } from '@src/router';
import Player from './Player';
import SideBar from './SideBar';
import VideoStore from '../VideoStore';

export default observer(props => {
    const { media, index } = props;
    const navigation = useNavigation();
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

    const renderCategories = useMemo(() => {
        if (Array.isArray(media.categories) && media.categories.length > 0) {
            return media.categories.map(category => (
                <SafeText
                    shadowText={true}
                    key={category.id}
                    style={styles.categoryName}
                    onPress={() => navigation.navigate('Category', { category })}>
                    {`#${category.name} `}
                </SafeText>
            ));
        } else {
            return null;
        }
    }, []);

    return (
        <View style={{ height: appStore.viewportHeight }}>
            {media.cover && (
                <View style={styles.cover}>
                    <Image style={styles.curtain} source={{ uri: media.cover }} resizeMode="cover" blurRadius={4} />
                    <View style={styles.mask} />
                </View>
            )}
            <Player media={media} index={index} />
            <View style={styles.videoContent}>
                <View>
                    <SafeText shadowText={true} style={styles.name}>
                        @{Helper.syncGetter('user.name', media)}
                    </SafeText>
                </View>
                <View>
                    <SafeText shadowText={true} style={styles.body} numberOfLines={3}>
                        {renderCategories}
                        {media.body}
                    </SafeText>
                </View>
            </View>
            <View style={styles.videoSideBar}>
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
    categoryName: {
        fontWeight: 'bold',
    },
    mask: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    name: { color: 'rgba(255,255,255,0.9)', fontSize: Font(16), fontWeight: 'bold' },
    videoContent: {
        position: 'absolute',
        bottom: Theme.HOME_INDICATOR_HEIGHT + PxDp(80),
        left: PxDp(Theme.itemSpace),
        right: PxDp(90),
    },
    videoSideBar: {
        position: 'absolute',
        bottom: Theme.HOME_INDICATOR_HEIGHT + PxDp(80),
        right: PxDp(Theme.itemSpace),
    },
});
