import React, { Component, useState } from 'react';

import { Text, View, StyleSheet, Animated, Image } from 'react-native';
import { Player, PageContainer, Row, Avatar, TouchFeedback, Like } from '@src/components';

import Comment from '@src/assets/images/pinglun.svg';

import { GQL, useMutation } from '@src/apollo';

interface Props {
    post: any;
    navigation: any;
}

const PostBottom = (props: Props) => {
    const { navigation, post } = props;

    return (
        <View>
            <View style={styles.bottomPartWrapper}>
                <Row style={styles.metaList}>
                    <Like
                        media={post}
                        type="icon"
                        iconSize={PxDp(22)}
                        containerStyle={{ flexDirection: 'row', alignItems: 'center' }}
                        textStyle={{ color: '#CCD5E0', fontSize: 14, marginStart: 15, marginEnd: 23 }}
                    />
                    <TouchFeedback
                        style={styles.commentWrap}
                        activeOpacity={0.6}
                        onPress={() => {
                            //TODO 添加评论事件
                        }}>
                        <Comment width={22} height={22} />
                        <Text style={styles.commentText}>{post.count_replies || '评论'}</Text>
                    </TouchFeedback>
                </Row>
            </View>
            <View>
                <View style={styles.commentsHeader}>
                    <Text style={{ color: '#CBD8E1' }}>{`所有评论(${post.count_replies || 0})`}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    toolItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottomPartWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: PxDp(15),
    },
    metaList: {
        justifyContent: 'flex-start',
    },
    commentWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: PxDp(50),
    },
    commentText: {
        color: '#CBD8E1',
        fontSize: 14,
        marginLeft: PxDp(8),
        width: PxDp(30),
    },
    commentsHeader: {
        borderBottomColor: Theme.borderColor,
        borderBottomWidth: PxDp(0.5),
        paddingVertical: PxDp(15),
    },
});

export default PostBottom;
