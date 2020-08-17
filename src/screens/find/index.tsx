import React, { useState, useCallback, useMemo, useRef, Fragment } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, FlatList, Platform } from 'react-native';
import {
    PageContainer,
    Placeholder,
    StatusView,
    PostItem,
    Footer,
    ItemSeparator,
    Avatar,
    SafeText,
    Row,
    Like,
} from '~/components';
import Swiper from 'react-native-swiper';
import { GQL, useQuery } from '~/apollo';
import { observer, appStore } from '~/store';
import { useNavigation } from '~/router';
import { useDetainment } from '~/utils';
import { observable } from 'mobx';
import { ad } from 'react-native-ad';
import Comment from '!/assets/images/pinglun.svg';

const sw = Device.WIDTH;
const rech = 280;

const recommend_datas = [
    { url: 'http://cos.haxibiao.com/images/kanshipin.png', dest: 'TaskRewardVideo' },
    {
        url: 'http://cos.haxibiao.com/images/shuijiaozhunqian.png',
        dest: 'TaskDrinkWater',
    },
    {
        url: 'http://cos.haxibiao.com/images/shuijiaozhunqian2.png',
        dest: 'TaskSleep',
    },
];

export default observer(() => {
    const navigation = useNavigation();
    useDetainment(navigation);
    const swiperRef = useRef<any>(null);
    let currentPage = 0;
    const { loading, data, fetchMore, refetch } = useQuery(GQL.postsSquareQuery, {
        variables: { page: currentPage },
    });

    const [adVisible, setAdVisible] = useState(true);

    let articles = useMemo(() => Helper.syncGetter('articles.data', data), [data]);
    currentPage = useMemo(() => Helper.syncGetter('articles.paginatorInfo.currentPage', data), [data]);
    const hasMorePages = useMemo(() => Helper.syncGetter('articles.paginatorInfo.hasMorePages', data), [data]);
    const fetchMoreArticles = useCallback(() => {
        if (hasMorePages) {
            fetchMore({
                variables: {
                    page: currentPage + 1,
                },
                updateQuery: (prev: any, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;
                    return Object.assign({}, prev, {
                        articles: Object.assign({}, fetchMoreResult.articles, {
                            data: [...prev.articles.data, ...fetchMoreResult.articles.data],
                        }),
                    });
                },
            });
        }
    }, [hasMorePages, currentPage]);
    if (Array.isArray(articles)) {
        articles = observable(articles);
    }

    const isFeedADList = [];

    let avatarId = Math.round(Math.random() * 10);

    return (
        <PageContainer isTopNavigator={true} title="动态广场">
            <View style={styles.container}>
                <FlatList
                    data={articles}
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
                    renderItem={({ item, index }) => {
                        const i = index + 1;
                        const w = i % 5 === 0;
                        if (!w) {
                            return <PostItem post={item} recommend={false} />;
                        } else {
                            return (
                                <Fragment>
                                    {adVisible && appStore.enableAd && (
                                        <View style={styles.ad}>
                                            <View style={styles.headerWrapper}>
                                                <TouchableOpacity style={styles.userInfo}>
                                                    <Avatar
                                                        source={`http://cos.dianmoge.com/storage/avatar/avatar-${avatarId}.jpg`}
                                                        size={pixel(38)}
                                                    />
                                                    <View style={styles.info}>
                                                        <SafeText style={styles.nameText}>匿名墨友</SafeText>
                                                        <SafeText style={styles.timeAgoText} numberOfLines={1}>
                                                            {avatarId + '分钟前'}
                                                        </SafeText>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                            <View>
                                                <ad.FeedAd
                                                    visible={adVisible}
                                                    visibleHandler={setAdVisible}
                                                    useCache={false}
                                                    adWidth={Device.WIDTH}
                                                    onClick={() => {
                                                        if (isFeedADList.indexOf(index) === -1) {
                                                            isFeedADList.push(index);
                                                            appStore.client
                                                                .mutate({
                                                                    mutation: GQL.clickFeedAD,
                                                                })
                                                                .then((data) => {
                                                                    console.log('点击广告', data);

                                                                    const { amount, message } = Helper.syncGetter(
                                                                        'data.clickFeedAD2',
                                                                        data,
                                                                    );
                                                                    Toast.show({
                                                                        content:
                                                                            message ||
                                                                            `+${amount || 0} 用户行为${
                                                                                Config.limitAlias
                                                                            }`,
                                                                        duration: 1500,
                                                                    });
                                                                });
                                                        }
                                                    }}
                                                />
                                            </View>
                                            <View style={styles.bottomPartWrapper}>
                                                <Row style={styles.metaList}>
                                                    <Like
                                                        media={{
                                                            count_likes: Math.round(Math.random() * 100),
                                                            liked: false,
                                                        }}
                                                        type="icon"
                                                        iconSize={pixel(22)}
                                                        containerStyle={{ flexDirection: 'row', alignItems: 'center' }}
                                                        textStyle={{
                                                            color: '#CCD5E0',
                                                            fontSize: 14,
                                                            marginStart: 15,
                                                            marginEnd: 23,
                                                        }}
                                                        isAd={true}
                                                    />
                                                    <View>
                                                        <Comment width={22} height={22} />
                                                    </View>
                                                    <SafeText
                                                        style={{
                                                            color: '#bfbfbf',
                                                            fontSize: 14,
                                                            marginStart: 15,
                                                            marginEnd: 23,
                                                        }}>
                                                        {Math.round(Math.random() * 100)}
                                                    </SafeText>
                                                </Row>
                                            </View>
                                        </View>
                                    )}
                                    {adVisible && appStore.enableAd && <ItemSeparator />}
                                    <PostItem post={item} recommend={false} />
                                </Fragment>
                            );
                        }
                    }}
                    refreshing={loading}
                    onRefresh={refetch}
                    onEndReachedThreshold={0.01}
                    onEndReached={fetchMoreArticles}
                    ListEmptyComponent={() => <StatusView.EmptyView />}
                    ListFooterComponent={() =>
                        hasMorePages ? <Placeholder quantity={1} /> : <Footer finished={true} />
                    }
                    // ListHeaderComponent={_renderRecommend}
                />
            </View>
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    recommendItem: {
        height: rech * 0.72,
        width: sw * 0.9,
        borderRadius: 12,
        marginLeft: sw * 0.05 - 1,
        // ...Platform.select({
        //     android: {
        //         elevation: 9,
        //         backgroundColor: '#D9D9D9'
        //     },
        //     ios: {
        //         backgroundColor: '#E7E7E7',
        //         shadowColor: '#000',
        //         shadowOffset: { x: 0, y: 0 },
        //         shadowOpacity: 0.2,
        //         shadowRadius: 5,
        //     },
        // }),
    },
    recommendItemWrapper: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        overflow: 'hidden',
        paddingBottom: 15,
    },
    recommendItemTextWrapper: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: 5,
        marginLeft: sw * 0.05,
        marginBottom: 10,
    },
    title: {
        color: '#222',
        fontSize: 16,
        marginStart: 0,
    },
    description: {
        color: '#7F7F7F',
        fontSize: 16,
        marginTop: 4,
    },
    RecommendWrapper: {
        marginTop: -30,
        width: sw,
        height: rech,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 0,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: pixel(Theme.BOTTOM_HEIGHT),
    },
    headerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: pixel(Theme.itemSpace),
        paddingTop: pixel(5),
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
    bottomPartWrapper: {
        // marginTop: pixel(10),
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: pixel(Theme.itemSpace),
        paddingBottom: pixel(5),
    },
    metaList: {
        flex: 1,
        marginLeft: pixel(10),
        justifyContent: 'flex-start',
    },
    ad: {
        // minHeight: pixel(200),
        // backgroundColor: '#F00',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: pixel(5),
        marginRight: pixel(5),
    },
});
