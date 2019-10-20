import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Animated, TouchableOpacity } from 'react-native';
import { Avatar, Iconfont, Like } from '@src/components';
import { useNavigation } from '@src/router';
import { observer } from '@src/store';
import VideoStore from '../VideoStore';

export default observer(props => {
    const { media } = props;
    const navigation = useNavigation();
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
                <Like media={media} />
            </View>
            <View style={styles.itemWrap}>
                <TouchableOpacity onPress={VideoStore.showComment}>
                    <Image source={require('@src/assets/images/comment_item.png')} style={styles.imageStyle} />
                    <Text style={styles.countText}>
                        {Helper.NumberFormat(Helper.syncGetter('count_comments', media))}
                    </Text>
                </TouchableOpacity>
                {media.type === 'issue' && media.answered_status === 0 && media.question_reward > 0 && (
                    <Image source={require('@src/assets/images/question_reward.png')} style={styles.questionReward} />
                )}
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
