import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Image, Text, Dimensions, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import { SvgUri } from 'react-native-svg';
import Avatar from '../Basic/Avatar';
import PlaceholderImage from '../Basic/PlaceholderImage';
import Row from '../Basic/Row';
import SafeText from '../Basic/SafeText';
import GridImage from './GridImage';

import Gift from '@src/assets/images/gift_svg.svg';
import Comment from '@src/assets/images/pinglun.svg';

import Like from './Like';
import StoreContext, { observer, useObservable, appStore } from '@src/store';
import { StackActions } from 'react-navigation';

export interface Props {
    post: any;
    navigation: any;
}

const videoWidth = Device.WIDTH * 0.6;
const videoHeight = videoWidth * 1.33;
const COVER_WIDTH = Device.WIDTH - PxDp(Theme.itemSpace) * 2;

const PostItem: React.FC<Props> = observer((props: Props) => {
    const { post, navigation } = props;
    const {
        type,
        user,
        time_ago,
        body,
        description,
        cover,
        category,
        submit,
        answered_status,
        question_reward,
        count_likes,
        count_replies,
        id,
        video,
        images,
    } = post;
    const isQuestion = type === 'issue';
    const renderCover = useMemo(() => {
        if (Array.isArray(images) && images.length > 0) {
            return (
                <View style={styles.contentBottom}>
                    <GridImage images={images} />
                </View>
            );
        } else if (cover) {
            const isLandscape = video && video.info && video.info.width && video.info.width >= video.info.height;
            return (
                <View style={styles.contentBottom}>
                    <PlaceholderImage
                        source={{ uri: cover }}
                        style={isLandscape ? styles.landscape : styles.portrait}
                        videoMark={true}
                    />
                </View>
            );
        }
    }, []);

    const pushAction = useMemo(() => {
        return StackActions.push({
            routeName: 'PostDetail',
            params: {
                post,
            },
        });
    }, [post]);

    return (
        <TouchableWithoutFeedback onPress={() => navigation.dispatch(pushAction)}>
            <View style={styles.postContainer}>
                <View style={styles.headerWrapper}>
                    <View style={styles.userInfo}>
                        <TouchableOpacity onPress={() => navigation.navigate('User', { user })}>
                            <Avatar source={user.avatar} size={PxDp(38)} />
                        </TouchableOpacity>
                        <View style={styles.info}>
                            <SafeText style={styles.nameText}>{user.name}</SafeText>
                            <SafeText style={styles.timeAgoText} numberOfLines={1}>
                                {time_ago}
                            </SafeText>
                        </View>
                    </View>
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

                <View style={styles.bottomPartWrapper}>
                    <Row style={styles.metaList}>
                        <Like
                            media={post}
                            type="icon"
                            iconSize={PxDp(22)}
                            containerStyle={{ flexDirection: 'row', alignItems: 'center' }}
                            textStyle={{ color: '#CCD5E0', fontSize: 14, marginStart: 15, marginEnd: 23 }}
                        />
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => navigation.navigate('PostDetail', { post })}>
                            <Comment width={22} height={22} />
                        </TouchableOpacity>
                        {count_replies >= 0 && (
                            <Text style={{ color: '#bfbfbf', fontSize: 14, marginStart: 15, marginEnd: 23 }}>
                                {count_replies || 0}
                            </Text>
                        )}
                        {/* {isQuestion ? (
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => {
                                    //TODO : 添加赞赏事件
                                }}>
                                <Gift width={18} height={18} />
                            </TouchableOpacity>
                        ) : null} */}
                    </Row>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
});

export default withNavigation(PostItem);

const styles = StyleSheet.create({
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
    bottomPartWrapper: {
        marginTop: PxDp(10),
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    metaList: {
        flex: 1,
        marginLeft: PxDp(10),
        justifyContent: 'flex-start',
    },
    contentTop: {
        marginTop: PxDp(Theme.itemSpace),
    },
    contentBottom: {
        marginTop: PxDp(Theme.itemSpace),
    },
    bodyText: { color: Theme.defaultTextColor, fontSize: PxDp(16), letterSpacing: 0.8 },
    postContainer: {
        paddingHorizontal: PxDp(Theme.itemSpace),
        marginVertical: PxDp(Theme.itemSpace),
    },
    headerWrapper: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    landscape: {
        width: COVER_WIDTH,
        height: (COVER_WIDTH * 9) / 16,
        borderRadius: PxDp(6),
    },
    portrait: {
        width: COVER_WIDTH * 0.5,
        height: COVER_WIDTH * 0.8,
        borderRadius: PxDp(6),
    },
});
