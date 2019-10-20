/*
 * @flow
 * created by wyk made in 2019-04-01 17:53:01
 */
'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    Text,
    Keyboard,
    Animated,
    Easing,
    ScrollView,
} from 'react-native';
import {
    TouchFeedback,
    Iconfont,
    Row,
    ItemSeparator,
    StatusView,
    Placeholder,
    KeyboardSpacer,
    Footer,
} from '@src/components';
import { Query, Mutation, compose, withApollo, graphql, GQL } from '@src/apollo';
import CommentItem from './CommentItem';
import InputCommentModal from './InputCommentModal';

class CommentOverlay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: new Animated.Value(0),
            visible: false,
            modalVisible: false,
            finished: false,
            count_comments: props.media && props.media.count_comments,
            reply: null,
            comment_id: null,
            childLimit: 1,
            parent_comment_id: null,
        };
    }

    //显示动画
    slideUp = () => {
        this.setState(
            () => ({ visible: true }),
            () => {
                Animated.parallel([
                    Animated.timing(this.state.offset, {
                        easing: Easing.linear,
                        duration: 200,
                        toValue: 1,
                    }),
                ]).start();
            },
        );
    };

    //隐藏动画
    slideDown = () => {
        Animated.parallel([
            Animated.timing(this.state.offset, {
                easing: Easing.linear,
                duration: 200,
                toValue: 0,
            }),
        ]).start(() => this.setState({ visible: false }));
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        try {
            // 更新comment
            if (nextProps.media !== this.props.media) {
                this.setState({ finished: false, count_comments: nextProps.media.count_comments });
            }
        } catch {
            console.log('componentWillReceiveProps error');
        }
    }

    hideCommentModal = () => {
        this.setState({ modalVisible: false });
    };

    showCommentModal = () => {
        if (TOKEN) {
            this.setState({ modalVisible: true });
        } else {
            this.props.navigation.navigate('Login');
        }
    };

    onCommented = () => {
        this._flatList &&
            this._flatList.scrollToOffset({
                offset: 0,
                animated: true,
            });
        this.setState(prev => {
            count_comments: ++prev.count_comments;
        });
    };

    _renderCommentHeader = comments => {
        let { count_comments } = this.state;
        return (
            <View style={styles.header}>
                <Text style={styles.headerText}>{count_comments > 0 && count_comments + ' 条'}评论</Text>
                <TouchFeedback style={styles.close} onPress={this.slideDown}>
                    <Iconfont name="chacha" size={PxDp(20)} color={Theme.defaultTextColor} />
                </TouchFeedback>
            </View>
        );
    };

    renderContent = (data, fetchMore, loading) => {
        const comments = Helper.syncGetter('comments.data', data);
        const hasMorePages = Helper.syncGetter('comments.paginatorInfo.hasMorePages', data);
        let currentPage = Helper.syncGetter('comments.paginatorInfo.currentPage', data);
        console.log('====================================');
        console.log(hasMorePages, currentPage);
        console.log('====================================');
        if (!comments) return <Placeholder type="comment" quantity={5} />;
        if (comments && comments.length === 0) return <StatusView.EmptyView />;
        return (
            <FlatList
                ref={ref => (this._flatList = ref)}
                style={{ flex: 1 }}
                data={comments}
                onScrollBeginDrag={() => {
                    Keyboard.dismiss();
                }}
                keyboardShouldPersistTaps="always"
                keyExtractor={(item, index) => item.id.toString()}
                renderItem={({ item, index }) => {
                    return (
                        <CommentItem
                            comment={item}
                            mediaId={this.props.media.id}
                            showCommentModal={this.showCommentModal}
                            replyComment={this.replyComment}
                        />
                    );
                }}
                ItemSeparatorComponent={() => (
                    <View
                        style={{
                            marginLeft: PxDp(Theme.itemSpace) + 42,
                            height: 0.6,
                            backgroundColor: Theme.lightGray,
                        }}
                    />
                )}
                ListFooterComponent={() => <Footer finished={this.state.finished} />}
                onEndReachedThreshold={0.3}
                onEndReached={() => {
                    if (hasMorePages) {
                        console.log('hasMorePages', hasMorePages);
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
                    } else {
                        this.setState({
                            finished: true,
                        });
                    }
                }}
            />
        );
    };

    replyComment = (comment, parent_comment_id) => {
        this.setState({
            reply: `回复 @${comment.user.name}：`,
            comment_id: comment.id,
            parent_comment_id: parent_comment_id,
        });
    };

    switchReplyType = () => {
        this.setState({
            reply: null,
            comment_id: null,
        });
    };

    render() {
        let { onHide, media, hideComment } = this.props;
        let { visible, offset, modalVisible, reply, comment_id, childLimit, parent_comment_id } = this.state;
        if (!visible || !media) {
            return <View />;
        }
        return (
            <View style={styles.overlayContainer}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={'always'}>
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={styles.modal} onPress={this.slideDown} activeOpacity={1} />
                        <Animated.View
                            style={{
                                transform: [
                                    {
                                        translateY: offset.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [(Device.HEIGHT * 2) / 3, 0],
                                            extrapolate: 'clamp',
                                        }),
                                    },
                                ],
                            }}>
                            <Query
                                query={GQL.commentsQuery}
                                variables={{ commentable_id: media.id, count: 10 }}
                                fetchPolicy="network-only">
                                {({ data, loading, error, refetch, fetchMore }) => {
                                    if (!(data && data.comments)) return null;
                                    let comments = Helper.syncGetter('comments.data', data);
                                    return (
                                        <View style={styles.commentContainer}>
                                            {this._renderCommentHeader(data)}
                                            <View style={{ flex: 1 }}>
                                                {this.renderContent(data, fetchMore, loading)}
                                            </View>
                                            <TouchableOpacity
                                                style={styles.inputContainer}
                                                onPress={this.showCommentModal}>
                                                <View style={styles.textInput}>
                                                    <Text style={{ fontSize: PxDp(14), color: Theme.subTextColor }}>
                                                        发表评论
                                                    </Text>
                                                </View>
                                                <View style={styles.touchItem}>
                                                    <Iconfont name="write" size={PxDp(24)} color={Theme.subTextColor} />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                }}
                            </Query>
                        </Animated.View>
                    </View>
                    <InputCommentModal
                        visible={modalVisible}
                        hideModal={this.hideCommentModal}
                        commentableId={media.id}
                        onCommented={this.onCommented}
                        reply={reply}
                        comment_id={comment_id}
                        parent_comment_id={parent_comment_id}
                        switchReplyType={this.switchReplyType}
                    />
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    overlayContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    commentContainer: {
        height: (Device.HEIGHT * 2) / 3,
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
        backgroundColor: '#fff',
        borderTopLeftRadius: PxDp(12),
        borderTopRightRadius: PxDp(12),
        overflow: 'hidden',
    },
    header: {
        height: PxDp(44),
        borderTopWidth: PxDp(0.5),
        borderBottomWidth: PxDp(0.5),
        borderColor: Theme.groundColour,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        fontSize: PxDp(15),
        color: Theme.secondaryTextColor,
    },
    close: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        width: PxDp(44),
        height: PxDp(44),
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        height: PxDp(50),
        flexDirection: 'row',
        alignItems: 'stretch',
        paddingHorizontal: PxDp(14),
        borderTopWidth: PxDp(1),
        borderTopColor: Theme.borderColor,
        backgroundColor: '#fff',
    },
    textInput: {
        flex: 1,
        paddingVertical: PxDp(10),
        paddingRight: PxDp(20),
    },
    touchItem: {
        width: PxDp(40),
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
});

export default CommentOverlay;
