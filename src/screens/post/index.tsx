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
} from '@src/components';
import { GQL, useQuery } from '@src/apollo';
import { observer, userStore } from '@src/store';

import PostContent from './components/PostContent';
import PostBottom from './components/PostBottom';
import CommentItem from '../comment/CommentItem';
import CommentInput from '../comment/CommentInput';

interface Props {
    navigation: any;
}
const index = (props: Props) => {
    const { navigation } = props;
    const media = navigation.getParam('post');
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
        comment => {
            fancyInputRef.current.focus();
            setReplyByComment(comment);
        },
        [fancyInputRef],
    );

    const { data, refetch, fetchMore } = useQuery(GQL.commentsQuery, {
        variables: { commentable_type: 'articles', commentable_id: media.id, replyCount: 3 },
        fetchPolicy: 'network-only',
    });
    const commentsData = useMemo(() => Helper.syncGetter('comments.data', data), [data]);
    let currentPage = useMemo(() => Helper.syncGetter('comments.paginatorInfo.currentPage', data), [data]);
    const hasMorePages = useMemo(() => Helper.syncGetter('comments.paginatorInfo.hasMorePages', data), [data]);
    const hiddenListFooter = commentsData && commentsData.length === 0;

    return (
        <PageContainer title="详情" contentViewStyle={hasVideo ? { marginTop: 0 } : {}}>
            {hasVideo && <Player video={media.video} />}
            <View style={[styles.container, Device.IOS && { paddingBottom: Theme.HOME_INDICATOR_HEIGHT }]}>
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.contentContainerStyle}
                    keyboardShouldPersistTaps={'handled'}>
                    <View style={styles.contentWrap}>
                        <PostContent post={media} navigation={navigation} />
                        <PostBottom post={media} navigation={navigation} />
                    </View>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        ref={flatListRef}
                        data={commentsData}
                        renderItem={({ item }) => {
                            return (
                                <CommentItem
                                    isQuestioner={isQuestioner}
                                    separator={true}
                                    comment={item}
                                    replyHandler={replyHandler}
                                    decreaseCountComments={decreaseCountComments}
                                />
                            );
                        }}
                        keyExtractor={item => item.id.toString()}
                        ListEmptyComponent={() => (
                            <StatusView.EmptyView imageSource={require('@src/assets/images/default_comment.png')} />
                        )}
                        ListFooterComponent={() => <ListFooter hidden={hiddenListFooter} finished={!hasMorePages} />}
                        keyboardShouldPersistTaps="always"
                        onEndReachedThreshold={0.3}
                        onScrollBeginDrag={() => {
                            Keyboard.dismiss();
                        }}
                        // onEndReached={() => {
                        //     if (hasMorePages) {
                        //         fetchMore({
                        //             variables: {
                        //                 page: ++currentPage,
                        //             },
                        //             updateQuery: (prev, { fetchMoreResult }) => {
                        //                 if (fetchMoreResult && fetchMoreResult.comments) {
                        //                     return Object.assign({}, prev, {
                        //                         comments: Object.assign({}, prev.comments, {
                        //                             paginatorInfo: fetchMoreResult.comments.paginatorInfo,
                        //                             data: [...fetchMoreResult.comments.data, ...prev.comments.data],
                        //                         }),
                        //                     });
                        //                 }
                        //             },
                        //         });
                        //     }
                        // }}
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
