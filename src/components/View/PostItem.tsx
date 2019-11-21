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

import Gift from '@src/assets/images/gift_svg.svg';
import Comment from '@src/assets/images/pinglun.svg';

import StoreContext, { observer, useObservable, appStore, userStore } from '@src/store';
import { useApolloClient, ApolloProvider } from '@src/apollo';
import { useNavigation } from '@src/router';
import { StackActions } from 'react-navigation';
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
}

const videoWidth = Device.WIDTH * 0.6;
const videoHeight = videoWidth * 1.33;
const COVER_WIDTH = Device.WIDTH - PxDp(Theme.itemSpace) * 2;

const PostItem: React.FC<Props> = observer((props: Props) => {
    const { showSubmitStatus, showSeparator, post, showComment } = props;
    const navigation = useNavigation();
    const client = useApolloClient();
    const {
        type,
        user,
        time_ago,
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
                ref={ref => (overlayRef = ref)}>
                <ApolloProvider client={client}>
                    <MoreOperation
                        onPressIn={() => overlayRef.close()}
                        target={post}
                        options={isSelf ? ['删除'] : ['不感兴趣', '举报']}
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
        const action = StackActions.push({
            routeName: 'PostDetail',
            params: {
                post,
            },
        });
        navigation.dispatch(action);
    }, [post, showComment]);

    const showRemark = useMemo(() => showSubmitStatus && remark && submit < 0, [props]);

    if (!visible) {
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
                        {showSubmitStatus && <SubmitStatus submit={submit} />}
                    </View>

                    <View style={styles.contentTop}>
                        <Text style={styles.bodyText} numberOfLines={showComment ? 100 : 3}>
                            {body || description}
                        </Text>
                    </View>
                    {renderCover}
                    {renderCategories}
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
                                <Comment width={PxDp(23)} height={PxDp(23)} />
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
                            <TouchableOpacity activeOpacity={0.6} onPress={showMoreOperation}>
                                <Iconfont name="qita1" size={PxDp(22)} color={'#CCD5E0'} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>
            {showSeparator && <ItemSeparator height={PxDp(8)} />}
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
        height: PxDp(34),
        justifyContent: 'center',
        marginRight: PxDp(10),
        marginTop: PxDp(10),
    },
    categoryName: {
        color: Theme.primaryColor,
        fontSize: Font(13),
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
        paddingHorizontal: PxDp(8),
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
        justifyContent: 'space-between',
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
    submitStatus: {
        borderRadius: PxDp(12),
        height: PxDp(24),
        paddingHorizontal: PxDp(8),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: PxDp(10),
    },
    statusText: {
        fontSize: PxDp(12),
        color: '#fff',
    },
    remark: {
        flex: 1,
        paddingBottom: PxDp(Theme.itemSpace),
    },
    remarkText: {
        fontSize: PxDp(14),
        color: Theme.subTextColor,
    },
    commentsHeader: {
        borderColor: Theme.borderColor,
        borderBottomWidth: PxDp(0.5),
        padding: PxDp(Theme.itemSpace),
    },
});
