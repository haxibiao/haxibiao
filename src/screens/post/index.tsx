import React, { Component, useState, useCallback, useRef, useMemo } from 'react';
import { Text, View, StyleSheet, ScrollView, FlatList, Keyboard } from 'react-native';
import {
    Player,
    PageContainer,
    Row,
    Avatar,
    TouchFeedback,
    KeyboardSpacer,
    ListFooter,
    StatusView,
    PostItem,
} from '~/components';
import { GQL, useQuery } from '~/apollo';
import { observer, userStore } from '~/store';
import { useNavigation, useRoute } from '@react-navigation/native';

import CommentItem from '../comment/CommentItem';
import CommentInput from '../../components/View/CommentInput';

interface Props {
    navigation: any;
}
const index = (props: Props) => {
    const navigation = useNavigation();
    const route = useRoute();
    const media = route.params?.post ?? {};
    const hasVideo = media.video && media.video.url;
    const [replyByComment, setReplyByComment] = useState();
    const flatListRef = useRef();
    const fancyInputRef = useRef();

    const isQuestioner = useMemo(() => media.user.id === userStore.me.id, [media, userStore]);

    const increaseCountComments = useCallback(() => {
        media.count_comments++;
    }, [media]);

    const decreaseCountComments = useCallback(() => {
        media.count_comments--;
        refetch();
    }, [media]);

    const updateScrollOffset = useCallback(() => {
        flatListRef.current.scrollToOffset({ y: 0 });
    }, [flatListRef]);

    const replyHandler = useCallback(
        (comment) => {
            fancyInputRef.current.focus();
            setReplyByComment(comment);
        },
        [fancyInputRef],
    );

    const { data, refetch, loading, fetchMore } = useQuery(GQL.commentsQuery, {
        variables: { commentable_type: 'articles', commentable_id: media.id, replyCount: 3 },
        fetchPolicy: 'network-only',
    });
    const commentsData = useMemo(() => Helper.syncGetter('comments.data', data), [data]);
    let currentPage = useMemo(() => Helper.syncGetter('comments.paginatorInfo.currentPage', data), [data]);
    const hasMorePages = useMemo(() => Helper.syncGetter('comments.paginatorInfo.hasMorePages', data), [data]);
    const hiddenListFooter = commentsData && commentsData.length === 0;

    const fetchMoreComments = useCallback(() => {
        if (hasMorePages && !loading) {
            fetchMore({
                variables: {
                    page: ++currentPage,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    if (fetchMoreResult && fetchMoreResult.comments) {
                        return Object.assign({}, prev, {
                            comments: Object.assign({}, prev.comments, {
                                paginatorInfo: fetchMoreResult.comments.paginatorInfo,
                                data: [...prev.comments.data, ...fetchMoreResult.comments.data],
                            }),
                        });
                    }
                },
            });
        }
    }, [hasMorePages, currentPage]);

    const onScroll = useCallback(
        (e) => {
            const { contentOffset, contentSize } = e.nativeEvent;
            // fetchMore触发条件
            if (contentSize.height - contentOffset.y < Device.HEIGHT - PxDp(50)) {
                fetchMoreComments();
            }
        },
        [fetchMoreComments],
    );

    return (
        <PageContainer title="详情" contentViewStyle={hasVideo ? { marginTop: 0 } : {}}>
            {hasVideo && <Player video={media.video} navigation={navigation} />}
            <View style={[styles.container, Device.IOS && { paddingBottom: Theme.HOME_INDICATOR_HEIGHT }]}>
                <ScrollView
                    onScroll={onScroll}
                    style={styles.container}
                    contentContainerStyle={styles.contentContainerStyle}
                    keyboardShouldPersistTaps={'handled'}>
                    <PostItem post={media} showComment={true} />
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        ref={flatListRef}
                        data={commentsData}
                        renderItem={({ item }) => {
                            return (
                                <CommentItem
                                    isQuestioner={isQuestioner}
                                    comment={item}
                                    replyHandler={replyHandler}
                                    decreaseCountComments={decreaseCountComments}
                                />
                            );
                        }}
                        keyExtractor={(item) => item.id.toString()}
                        ListEmptyComponent={() => (
                            <StatusView.EmptyView imageSource={require('~/assets/images/default_comment.png')} />
                        )}
                        ListFooterComponent={() => <ListFooter hidden={hiddenListFooter} finished={!hasMorePages} />}
                        keyboardShouldPersistTaps="always"
                        onEndReachedThreshold={0.3}
                        onScrollBeginDrag={() => {
                            Keyboard.dismiss();
                        }}
                    />
                </ScrollView>
                <CommentInput
                    commentAbleType={'articles'}
                    updateScrollOffset={updateScrollOffset}
                    increaseCountComments={increaseCountComments}
                    commentAbleId={media.id}
                    replyByComment={replyByComment}
                    setReplyByComment={setReplyByComment}
                    ref={fancyInputRef}
                />
            </View>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
    contentContainerStyle: {
        flexGrow: 1,
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
    },
    contentWrap: {
        margin: PxDp(Theme.itemSpace),
    },
});

export default index;
