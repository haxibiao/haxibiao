import React, { useContext, useState, useCallback, useEffect, useMemo, useRef, Fragment } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, StatusBar,Platform } from 'react-native';
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
} from '@src/components';
import Swiper from 'react-native-swiper';
import { GQL, useQuery, useLazyQuery } from '@src/apollo';
import StoreContext, { observer, appStore } from '@src/store';
import { middlewareNavigate ,useNavigation} from '@src/router';
import { exceptionCapture } from '@src/common';
import { observable } from 'mobx';
import ad from '@src/native/ad';
import Comment from '@app/assets/images/pinglun.svg';

const sh = Device.HEIGHT;
const sw = Device.WIDTH;
const rech = 280;

const recommend_datas = [
    { url : "http://cos.haxibiao.com/images/kanshipin.png",
    dest: "TaskRewardVideo"
},{
    url: "http://cos.haxibiao.com/images/shuijiaozhunqian.png",
    dest: "TaskDrinkWaterScreen"
},
{
    url: "http://cos.haxibiao.com/images/shuijiaozhunqian2.png",
    dest: "TaskSleepScreen"
}

];

export default observer(props => {
    const navigation = useNavigation();
    const swiperRef = useRef<any>(null);
    const store = useContext(StoreContext);
    const { loading, error, data, fetchMore, refetch } = useQuery(GQL.postsSquareQuery, {
        variables: { page: currentPage },
    });

    const [adVisible, setAdVisible] = useState(true);

    let articles = useMemo(() => Helper.syncGetter('articles.data', data), [data]);
    const currentPage = useMemo(() => Helper.syncGetter('articles.paginatorInfo.currentPage', data), [data]);
    const hasMorePages = useMemo(() => Helper.syncGetter('articles.paginatorInfo.hasMorePages', data), [data]);
    const fetchMoreArticles = useCallback(() => {
        if (hasMorePages) {
            fetchMore({
                variables: {
                    page: currentPage + 1,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
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

    /**
     *  渲染轮播图
     */
    function _renderRecommend() {
        return (
            <>
                <Swiper
                    containerStyle={styles.RecommendWrapper}
                    height={rech}
                    horizontal={true}
                    ref={swiperRef}
                    autoplay={true}
                    loop={true}
                    index={0}
                    paginationStyle={{ bottom: 10 }}
                    autoplayTimeout={6}
                    showsPagination={true}
                    removeClippedSubviews={false}
                    dotStyle={{ backgroundColor: 'rgba(255,255,255,.3)', width: 18, height: 3,...Platform.select({
                        android : {
                            marginBottom:12,
                        },
                        ios: {
                            marginBottom:14,
                        }
                    }) }}
                    activeDotStyle={{
                        backgroundColor: 'rgba(255,255,255,.9)',
                        width: 18,
                        height: 3,
                        ...Platform.select({
                            android : {
                                marginBottom:12,
                            },
                            ios: {
                                marginBottom:14,
                            }
                        })
                    }}>
                    {recommend_datas.map(item => {
                        return (
                            <View style={styles.recommendItemWrapper}>
                                {/* <View style={styles.recommendItemTextWrapper}>
                                    <Text style={styles.title}>这是标题</Text>
                                    <Text style={styles.description}>这里是APP介绍信息</Text>
                                </View> */}
                                <View style={styles.recommendItemTextWrapper}/>

                                <View style={styles.recommendItem}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            //TODO: 轮播图点击跳转事件
                                            navigation.navigate(item.dest)
                                        }}>
                                        <Image
                                            source={{uri: item.url}}
                                            style={{ height: rech * 0.72, width: sw * 0.9, borderRadius: 12 }}
                                            resizeMode={'cover'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })}
                </Swiper>
            </>
        );
    }

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
                                                        size={PxDp(38)}
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
                                                    adWidth={Device.WIDTH}
                                                    onClick={() => {
                                                        if (isFeedADList.indexOf(index) === -1) {
                                                            isFeedADList.push(index);
                                                            appStore.client
                                                                .mutate({
                                                                    mutation: GQL.clickFeedAD,
                                                                })
                                                                .then(data => {
                                                                    console.log("点击广告", data);
                                                                    
                                                                    const { amount, message } = Helper.syncGetter('data.clickFeedAD2', data);
                                                                    Toast.show({
                                                                        content: message || `+${amount || 0} 用户行为贡献`,
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
                                                        iconSize={PxDp(22)}
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
                    ListHeaderComponent={_renderRecommend}
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
        justifyContent:'space-between',
        alignItems:'flex-start',
        overflow: 'hidden',
        paddingBottom:15,
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
        paddingBottom: PxDp(Theme.BOTTOM_HEIGHT),
    },
    headerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: PxDp(Theme.itemSpace),
        paddingTop: PxDp(5),
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
    bottomPartWrapper: {
        // marginTop: PxDp(10),
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: PxDp(Theme.itemSpace),
        paddingBottom: PxDp(5),
    },
    metaList: {
        flex: 1,
        marginLeft: PxDp(10),
        justifyContent: 'flex-start',
    },
    ad: {
        // minHeight: PxDp(200),
        // backgroundColor: '#F00',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: PxDp(5),
        marginRight: PxDp(5),
    },
});
