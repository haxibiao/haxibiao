/*
 * @flow
 * created by wyk made in 2019-01-09 10:11:47
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
// import {  StackActions } from 'react-navigation;
import { Avatar, SafeText, FollowButton } from '~/components';

import { userStore } from '~/store';
import { GQL, useMutation } from '~/apollo';

// type User = {
//     id: number;
//     avatar: any;
//     name: string;
//     followed_status: number;
//     introduction?: string;
// };

type Props = {
    user: any;
    style?: any;
    navigation?: any;
};

const UserBlockItem = (props: Props) => {
    const { user, style, navigation } = props;
    const { me } = userStore;
    const { id = 1, avatar, name, followed_status, introduction } = user;
    const pushAction = StackActions.push({
        routeName: 'User',
        params: {
            user,
        },
    });

    const [removeUserBlock, { error, data: callBackData }] = useMutation(GQL.removeUserBlockMutation, {
        variables: {
            id: user.id,
        },
        errorPolicy: 'all',
        refetchQueries: () => [
            {
                query: GQL.showUserBlockQuery,
                variables: { user_id: me.id },
            },
        ],
    });

    if (error || callBackData) {
        // console.log('quxiao拉黑结果', callBackData);
        Toast.show({
            content: error
                ? '服务器响应失败！'
                : callBackData.removeUserBlock === 1
                ? '移除黑名单成功！'
                : '移除黑名单失败！',
        });
    }

    return (
        <View style={[styles.item, style]}>
            <Avatar source={avatar} size={pixel(50)} />
            <View style={styles.right}>
                <View style={styles.info}>
                    <SafeText style={styles.nameText}>{name}</SafeText>
                    {!!introduction && (
                        <View style={{ flex: 1 }}>
                            <SafeText style={styles.introduction} numberOfLines={1}>
                                {introduction}
                            </SafeText>
                        </View>
                    )}
                </View>
                <TouchableOpacity style={styles.buttonsStyle} onPress={() => removeUserBlock()}>
                    <Text style={styles.titleStyle} numberOfLines={1}>
                        取消拉黑
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    info: {
        flex: 1,
        marginRight: pixel(Theme.itemSpace),
    },
    introduction: {
        marginTop: pixel(8),
        fontSize: pixel(12),
        color: '#696482',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: pixel(Theme.itemSpace),
    },
    labelText: { fontSize: pixel(12), color: '#fff', marginLeft: pixel(2), lineHeight: pixel(14) },
    nameText: {
        fontSize: pixel(16),
        color: Theme.defaultTextColor,
        marginRight: pixel(2),
    },
    right: {
        flex: 1,
        paddingHorizontal: pixel(Theme.itemSpace),
        paddingVertical: pixel(20),
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: pixel(1),
        borderBottomColor: Theme.borderColor,
    },
    buttonsStyle: {
        backgroundColor: Theme.subTextColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: pixel(70),
        height: pixel(30),
        borderRadius: pixel(15),
    },
    titleStyle: {
        fontSize: pixel(13),
        overflow: 'hidden',
        color: '#FFF',
    },
});

export default UserBlockItem;
