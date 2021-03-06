import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    Dimensions,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Animated,
} from 'react-native';
import Avatar from '../Basic/Avatar';
import PlaceholderImage from '../Basic/PlaceholderImage';
import Row from '../Basic/Row';
import SafeText from '../Basic/SafeText';
import ItemSeparator from '../Form/ItemSeparator';
import Iconfont from '../Iconfont';
import GridImage from './GridImage';
import Like from './Like';
import MoreOperation from './MoreOperation';

import Gift from '!/assets/images/gift_svg.svg';
import Comment from '!/assets/images/pinglun.svg';

import StoreContext, { observer, appStore, userStore, adStore } from '~/store';
import { useApolloClient, ApolloProvider } from '~/apollo';
import { useNavigation } from '~/router';
import { StackActions } from '@react-navigation/native';
import { Overlay } from 'teaset';

interface SubmitStatusProps {
    submit: number;
}

const SubmitStatus: React.FC<SubmitStatusProps> = (props: SubmitStatusProps) => {
    const audit = useMemo(() => {
        switch (String(props.submit)) {
            case '-1':
                return { status: '已拒绝', color: Theme.error };
                break;
            case '1':
                return { status: '已通过', color: Theme.teaGreen };
                break;
            case '0':
                return { status: '审核中', color: '#FF7233' };
                break;
            default:
                return { status: '审核中', color: '#FF7233' };
        }
    }, [props]);

    return (
        <View style={[styles.submitStatus, { backgroundColor: audit.color }]}>
            <Text style={styles.statusText}>{audit.status}</Text>
        </View>
    );
};

export interface Props {
    showSeparator?: boolean;
    showSubmitStatus?: boolean;
    showComment?: boolean; // 是否显示评论(详情页)
    post: any;
    time_ago: any;
}

const videoWidth = Device.WIDTH * 0.6;
const videoHeight = videoWidth * 1.33;
const COVER_WIDTH = Device.WIDTH - pixel(Theme.itemSpace) * 2;

const PostItem: React.FC<Props> = observer((props: Props) => {
    const { showSubmitStatus, showSeparator, post = {}, showComment, time_ago } = props;
    const navigation = useNavigation();
    const client = useApolloClient();
    const {
        type,
        user,
        body,
        description,
        cover,
        categories,
        submit,
        remark,
        answered_status,
        question_reward,
        count_likes,
        count_replies,
        id,
        video,
        images,
    } = post;
    const isQuestion = type === 'issue';
    const me = Helper.syncGetter('me', userStore);
    const isSelf = me.id === user.id;
    const [visible, setVisible] = useState(true);
    const animation = useRef(new Animated.Value(1));
    const startAnimation = useCallback(
        (startValue: number = 0, toValue: number = 1) => {
            animation.current.setValue(startValue);
            Animated.timing(animation.current, {
                useNativeDriver: true,
                toValue,
                duration: 300,
            }).start(() => setVisible(false));
        },
        [setVisible],
    );

    const renderCover = useMemo(() => {
        if (Array.isArray(images) && images.length > 0) {
            return (
                <View style={styles.contentBottom}>
                    <GridImage images={images} />
                </View>
            );
        } else if (cover && !showComment) {
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

    const renderCategories = useMemo(() => {
        if (Array.isArray(categories) && categories.length > 0) {
            return (
                <View style={styles.categories}>
                    {categories.map((category, index) => (
                        <TouchableOpacity
                            activeOpacity={1}
                            key={category.id}
                            style={styles.categoryItem}
                            onPress={() => navigation.navigate('Category', { category })}>
                            <Text style={styles.categoryName}>#{category.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            );
        } else {
            return null;
        }
    }, []);

    const showMoreOperation = useCallback(() => {
        let overlayRef;
        const MoreOperationOverlay = (
            <Overlay.PullView
                style={{ flexDirection: 'column', justifyContent: 'flex-end' }}
                containerStyle={{ backgroundColor: 'transparent' }}
                animated={true}
                ref={(ref) => (overlayRef = ref)}>
                <ApolloProvider client={client}>
                    <MoreOperation
                        navigation={navigation}
                        onPressIn={() => overlayRef.close()}
                        target={post}
                        showShare={true}
                        downloadUrl={Helper.syncGetter('video.url', post)}
                        downloadUrlTitle={Helper.syncGetter('body', post)}
                        options={
                            isSelf
                                ? ['删除', '下载', '复制链接']
                                : ['下载', '不感兴趣', '复制链接', post.favorited ? '取消收藏' : '收藏', '举报', '拉黑']
                        }
                        deleteCallback={() => startAnimation(1, 0)}
                    />
                </ApolloProvider>
            </Overlay.PullView>
        );
        Overlay.show(MoreOperationOverlay);
    }, [client, post]);

    const onPress = useCallback(() => {
        if (showComment) {
            return;
        }
        navigation.navigate('PostDetail', { post: post });
    }, [post, showComment]);

    const showRemark = useMemo(() => showSubmitStatus && remark && submit < 0, [props]);

    if (!visible || !post) {
        return null;
    }

    const animateStyles = {
        opacity: animation.current,
        transform: [
            { scale: animation.current },
            {
                rotate: animation.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['90deg', '0deg'],
                    extrapolate: 'clamp',
                }),
            },
        ],
    };

    return (
        <Animated.View style={animateStyles}>
            <TouchableWithoutFeedback onPress={onPress}>
                <View style={styles.postContainer}>
                    {showRemark && (
                        <View style={styles.remark}>
                            <Text style={styles.remarkText}>描述:{remark}</Text>
                        </View>
                    )}
                    <View style={styles.headerWrapper}>
                        <View style={styles.userInfo}>
                            <TouchableOpacity onPress={() => navigation.navigate('User', { user })}>
                                <Avatar source={user.avatar} size={pixel(38)} />
                            </TouchableOpacity>
                            <View style={styles.info}>
                                <SafeText style={styles.nameText}>{user.name}</SafeText>
                                <SafeText style={styles.timeAgoText} numberOfLines={1}>
                                    {time_ago}
                                </SafeText>
                            </View>
                        </View>
                        {isQuestion && question_reward > 0 && adStore.enableWallet ? (
                            <View style={styles.questionLabel}>
                                <Text style={styles.questionText}>悬赏问答</Text>
                                <Text style={styles.rewardText}>{`${question_reward}${Config.goldAlias}`}</Text>
                            </View>
                        ) : null}
                        {showSubmitStatus && <SubmitStatus submit={submit} />}
                    </View>

                    <View style={styles.contentTop}>
                        <Text style={styles.bodyText} numberOfLines={showComment ? 100 : 3}>
                            {body ? body.replace(/<[^>]+>/g, '') : description.replace(/<[^>]+>/g, '')}
                        </Text>
                    </View>
                    {renderCover}
                    {renderCategories}
                    <View style={styles.bottomPartWrapper}>
                        <Row style={styles.metaList}>
                            <Like
                                post={post}
                                type="icon"
                                iconSize={pixel(22)}
                                containerStyle={{ flexDirection: 'row', alignItems: 'center' }}
                                textStyle={{ color: '#CCD5E0', fontSize: 14, marginStart: 15, marginEnd: 23 }}
                            />
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => navigation.navigate('PostDetail', { post })}>
                                {/* <Comment width={pixel(23)} height={pixel(23)} /> */}
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
                        {!(isSelf && showComment) && (
                            <TouchableOpacity activeOpacity={0.6}>
                                <Iconfont name="qita1" size={pixel(22)} color={'#CCD5E0'} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>
            {showSeparator && <ItemSeparator height={pixel(8)} />}
            {showComment && (
                <View style={styles.commentsHeader}>
                    <Text style={{ color: '#CBD8E1' }}>{`所有评论(${count_replies || 0})`}</Text>
                </View>
            )}
        </Animated.View>
    );
});

PostItem.defaultProps = {
    showSeparator: true,
    showComment: false,
};

export default PostItem;

const styles = StyleSheet.create({
    categories: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    categoryItem: {
        alignItems: 'center',
        flexDirection: 'row',
        height: pixel(34),
        justifyContent: 'center',
        marginRight: pixel(10),
        marginTop: pixel(10),
    },
    categoryName: {
        color: Theme.primaryColor,
        fontSize: font(13),
    },
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: pixel(Theme.itemSpace),
    },
    info: {
        justifyContent: 'space-between',
        marginLeft: pixel(Theme.itemSpace),
    },
    timeAgoText: { fontSize: pixel(12), color: Theme.slateGray1, fontWeight: '300', marginTop: pixel(5) },
    nameText: { fontSize: pixel(14), color: Theme.defaultTextColor },
    questionLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        height: pixel(24),
        borderRadius: pixel(12),
        paddingHorizontal: pixel(8),
        backgroundColor: Theme.groundColour,
    },
    questionText: {
        fontSize: pixel(11),
        color: Theme.subTextColor,
    },
    rewardText: {
        marginLeft: pixel(5),
        fontSize: pixel(11),
        color: Theme.watermelon,
    },
    bottomPartWrapper: {
        marginTop: pixel(10),
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metaList: {
        flex: 1,
        marginLeft: pixel(10),
        justifyContent: 'flex-start',
    },
    contentTop: {
        marginTop: pixel(Theme.itemSpace),
    },
    contentBottom: {
        marginTop: pixel(Theme.itemSpace),
    },
    bodyText: { color: Theme.defaultTextColor, fontSize: pixel(16), letterSpacing: 0.8 },
    postContainer: {
        paddingHorizontal: pixel(Theme.itemSpace),
        marginVertical: pixel(Theme.itemSpace),
    },
    headerWrapper: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    landscape: {
        width: COVER_WIDTH,
        height: (COVER_WIDTH * 9) / 16,
        borderRadius: pixel(6),
    },
    portrait: {
        width: COVER_WIDTH * 0.5,
        height: COVER_WIDTH * 0.8,
        borderRadius: pixel(6),
    },
    submitStatus: {
        borderRadius: pixel(12),
        height: pixel(24),
        paddingHorizontal: pixel(8),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: pixel(10),
    },
    statusText: {
        fontSize: pixel(12),
        color: '#fff',
    },
    remark: {
        flex: 1,
        paddingBottom: pixel(Theme.itemSpace),
    },
    remarkText: {
        fontSize: pixel(14),
        color: Theme.subTextColor,
    },
    commentsHeader: {
        borderColor: Theme.borderColor,
        borderBottomWidth: pixel(0.5),
        padding: pixel(Theme.itemSpace),
    },
});
