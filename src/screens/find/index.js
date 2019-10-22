import React, { useContext, useState, useCallback, useEffect, useMemo, useRef, Fragment } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, StatusBar } from 'react-native';
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

import { GQL, useQuery, useLazyQuery } from '@src/apollo';
import StoreContext, { observer, appStore } from '@src/store';
import { middlewareNavigate } from '@src/router';
import { exceptionCapture } from '@src/common';
import { observable } from 'mobx';
import ttad from '@src/native/ttad';
import Comment from '@src/assets/images/pinglun.svg';

export default observer(props => {
    const store = useContext(StoreContext);
    const { loading, error, data, fetchMore, refetch } = useQuery(GQL.articlesQuery, {
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
                                        <View style={styles.ttAd}>
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
                                            <ttad.FeedAd
                                                visible={adVisible}
                                                visibleHandler={setAdVisible}
                                                adWidth={Device.WIDTH}
                                            />
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
                    ItemSeparatorComponent={() => <ItemSeparator />}
                    refreshing={loading}
                    onRefresh={refetch}
                    onEndReachedThreshold={0.01}
                    onEndReached={fetchMoreArticles}
                    ListEmptyComponent={() => <StatusView.EmptyView />}
                    ListFooterComponent={() =>
                        hasMorePages ? <Placeholder quantity={1} /> : <Footer finished={true} />
                    }
                    ListHeaderComponent={() => <View style={{ height: 5, width: '100%' }} />}
                />
            </View>
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT + PxDp(56),
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
    ttAd: {
        // minHeight: PxDp(200),
        // backgroundColor: '#F00',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: PxDp(5),
        marginRight: PxDp(5),
    },
});
