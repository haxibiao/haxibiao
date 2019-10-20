/*
 * @flow
 * created by wyk made in 2019-04-01 21:22:39
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, Keyboard, DeviceEventEmitter } from 'react-native';
import { TouchFeedback, Iconfont, HxfTextInput, SafeText, Avatar, Row } from '@src/components';
import { Mutation, compose, withApollo, graphql, GQL } from '@src/apollo';
import { userStore } from '@src/store';

class CommentInput extends Component {
    constructor(props) {
        super(props);
        this.state = { body: null };
    }

    update = (cache, { data: { addComment } }) => {
        let { commentableId } = this.props;
        let prev = cache.readQuery({
            query: GQL.commentsQuery,
            variables: {
                commentable_id: commentableId,
                count: 10,
            },
        });
        console.log('====================================');
        console.log('addComment', addComment);
        console.log('====================================');
        cache.writeQuery({
            query: GQL.commentsQuery,
            variables: {
                commentable_id: commentableId,
                count: 10,
            },
            data: {
                comments: Object.assign({}, prev.comments, {
                    data: [...prev.comments.data, addComment],
                }),
            },
        });
    };

    onCompleted = comment => {
        this.props.onCommented();
        Toast.show({ body: '评论成功', layout: 'top' });
    };

    onError = error => {
        let str = error.toString().replace(/Error: GraphQL error: /, '');
        Toast.show({ body: str || '评论失败' });
    };

    onChangeText = text => {
        this.setState({ body: text });
    };

    onCommentedRefetchQueries = result => [
        {
            query: GQL.commentsQuery,
            variables: {
                commentable_id: this.props.commentableId,
                count: 10,
            },
        },
    ];

    render() {
        const {
            commentableId,
            style,
            user,
            textInputRef,
            hideModal,
            reply,
            comment_id,
            addComment,
            createChildComment,
            parent_comment_id,
        } = this.props;
        let { body } = this.state;
        let disabled = !body || !body.trim();

        console.log('parent_comment_id', parent_comment_id);
        return (
            <View style={[styles.footerBar, style]}>
                <HxfTextInput
                    textInputRef={textInputRef}
                    placeholder={reply ? reply : '发表评论'}
                    style={styles.textInput}
                    value={body}
                    onChangeText={this.onChangeText}
                />
                <TouchFeedback
                    disabled={disabled}
                    style={styles.touchItem}
                    onPress={() => {
                        this.onCompleted(null);
                        addComment({
                            variables: {
                                user_id: userStore.me.id,
                                commentable_id: commentableId,
                                body: body && body.trim(),
                                commentable_type: comment_id ? 'comments' : 'articles',
                                comment_id: comment_id,
                            },
                            update: this.update,
                            optimisticResponse: {
                                __typename: 'Mutation',
                                addComment: {
                                    __typename: 'Comment',
                                    id: -1,
                                    commentable_id: commentableId,
                                    body,
                                    time_ago: '刚刚',
                                    user: userStore.me,
                                    liked: null,
                                    likes: 0,
                                    replies: [],
                                },
                            },
                            // refetchQueries: () => [
                            //     {
                            //         query: GQL.commentsQuery,
                            //         variables: {
                            //             commentable_id: commentableId,
                            //             count: 10,
                            //         },
                            //     },
                            // ],
                        });
                        this.setState({ body: '' });
                        Keyboard.dismiss();
                        hideModal();
                    }}>
                    <Iconfont
                        name="write"
                        size={PxDp(24)}
                        color={!disabled ? Theme.secondaryColor : Theme.subTextColor}
                    />
                </TouchFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    footerBar: {
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

export default compose(
    withApollo,
    graphql(GQL.addCommentMutation, { name: 'addComment' }),
)(CommentInput);
