import React, { Component, useCallback } from 'react';
import { StyleSheet, View, Image, Animated, TouchableOpacity } from 'react-native';
import { Avatar, Iconfont, Like, SafeText, MoreOperation } from '@src/components';
import { useApolloClient, ApolloProvider } from '@src/apollo';
import { useNavigation } from '@src/router';
import { observer } from '@src/store';
import VideoStore from '../VideoStore';
import { Overlay } from 'teaset';

export default observer(props => {
    const { media } = props;
    const navigation = useNavigation();
    const client = useApolloClient();
    const showMoreOperation = useCallback(() => {
        let overlayRef;
        const MoreOperationOverlay = (
            <Overlay.PullView
                style={{ flexDirection: 'column', justifyContent: 'flex-end' }}
                containerStyle={{ backgroundColor: 'transparent' }}
                animated={true}
                ref={ref => (overlayRef = ref)}>
                <ApolloProvider client={client}>
                    <MoreOperation
                        navigation={navigation}
                        onPressIn={() => overlayRef.close()}
                        target={media}
                        showShare={true}
                        downloadUrl={Helper.syncGetter('video.url', media)}
                        downloadUrlTitle={Helper.syncGetter('body', media)}
                        options={['下载', '不感兴趣',  '复制链接', media.favorited ? '取消收藏': '收藏','举报']}
                    />
                </ApolloProvider>
            </Overlay.PullView>
        );
        Overlay.show(MoreOperationOverlay);
    }, [client, media]);
    return (
        <View style={styles.sideBar}>
            <View style={styles.itemWrap}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('User', { user: Helper.syncGetter('user', media) });
                    }}>
                    <Avatar
                        source={Helper.syncGetter('user.avatar', media)}
                        size={PxDp(52)}
                        style={{ borderColor: '#fff', borderWidth: 1 }}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.itemWrap}>
                <Like media={media} shadowText={true} />
            </View>
            <View style={styles.itemWrap}>
                <TouchableOpacity onPress={VideoStore.showComment}>
                    <Image source={require('@app/assets/images/comment_item.png')} style={styles.imageStyle} />
                    <SafeText shadowText={true} style={styles.countText}>
                        {Helper.NumberFormat(Helper.syncGetter('count_comments', media))}
                    </SafeText>
                </TouchableOpacity>
                {media.type === 'issue' && media.answered_status === 0 && media.question_reward > 0 && (
                    <Image source={require('@app/assets/images/question_reward.png')} style={styles.questionReward} />
                )}
            </View>
            <View style={styles.itemWrap}>
                <TouchableOpacity onPress={showMoreOperation}>
                    <Image source={require('@app/assets/images/more_item.png')} style={styles.imageStyle} />
                </TouchableOpacity>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    countText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: Font(12),
        marginTop: PxDp(10),
        textAlign: 'center',
    },
    imageStyle: {
        height: PxDp(40),
        width: PxDp(40),
    },
    itemWrap: {
        marginTop: PxDp(20),
    },
    questionReward: {
        bottom: PxDp(20),
        height: (PxDp(40) * 48) / 142,
        left: PxDp(0),
        position: 'absolute',
        width: PxDp(40),
    },
    sideBar: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
