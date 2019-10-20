import React, { Component, useMemo } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Row, Avatar, TouchFeedback, GridImage, SafeText } from '@src/components';
import { observer, appStore } from '@src/store';

interface Props {
    navigation: any;
    post: any;
}

const PostContent = observer((props: Props) => {
    const { navigation, post } = props;
    const { type, user, time_ago, body, description, category, answered_status, question_reward, images } = post;
    const isQuestion = type === 'issue';
    const renderCover = useMemo(() => {
        if (Array.isArray(images) && images.length > 0) {
            return (
                <View style={styles.contentBottom}>
                    <GridImage images={images} />
                </View>
            );
        }
    }, []);
    return (
        <View>
            <View style={styles.headerWrapper}>
                <TouchableOpacity style={styles.userInfo} onPress={() => navigation.navigate('User', { user })}>
                    <Avatar source={user.avatar} size={PxDp(38)} />
                    <View style={styles.info}>
                        <SafeText style={styles.nameText}>{user.name}</SafeText>
                        <SafeText style={styles.timeAgoText} numberOfLines={1}>
                            {time_ago}
                        </SafeText>
                    </View>
                </TouchableOpacity>
                {isQuestion && question_reward > 0 && appStore.enableWallet ? (
                    <View style={styles.questionLabel}>
                        <Text style={styles.questionText}>悬赏问答</Text>
                        <Text style={styles.rewardText}>{`${question_reward}${Config.goldAlias}`}</Text>
                    </View>
                ) : null}
            </View>
            <View style={styles.contentTop}>
                <Text style={styles.bodyText}>{body || description}</Text>
            </View>
            {renderCover}
        </View>
    );
});

const styles = StyleSheet.create({
    headerWrapper: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    contentTop: {
        marginTop: PxDp(Theme.itemSpace),
    },
    contentBottom: {
        marginTop: PxDp(Theme.itemSpace),
    },
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: PxDp(Theme.itemSpace),
    },
    info: {
        justifyContent: 'space-between',
        marginLeft: PxDp(Theme.itemSpace),
    },
    timeAgoText: { fontSize: PxDp(12), color: Theme.slateGray1, fontWeight: '300', marginTop: PxDp(5) },
    nameText: { fontSize: PxDp(14), color: Theme.defaultTextColor },
    questionLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        height: PxDp(24),
        borderRadius: PxDp(12),
        paddingHorizontal: PxDp(9),
        backgroundColor: Theme.groundColour,
    },
    questionText: {
        fontSize: PxDp(11),
        color: Theme.subTextColor,
    },
    rewardText: {
        marginLeft: PxDp(5),
        fontSize: PxDp(11),
        color: Theme.watermelon,
    },
    bodyText: { color: Theme.defaultTextColor, fontSize: PxDp(16), lineHeight: PxDp(22), letterSpacing: 0.8 },
});

export default PostContent;
