/*
 * @flow
 * created by wyk made in 2019-01-09 10:11:47
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { StackActions } from '@react-navigation/native';

import Iconfont from '../Iconfont';
import Row from '../Basic/Row';
import Avatar from '../Basic/Avatar';
import SafeText from '../Basic/SafeText';
import FollowButton from './FollowButton';

type User = {
    id: number;
    avatar: any;
    name: string;
    followed_status: number;
    introduction?: string;
};

class UserItem extends Component {
    render() {
        const { user, style, navigation } = this.props;
        const { id = 1, avatar, name, followed_status, introduction } = user;
        return (
            <TouchableOpacity style={[styles.item, style]} onPress={() => navigation.navigate('User', { user })}>
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
                    <FollowButton
                        id={id}
                        followedStatus={followed_status}
                        style={{
                            width: pixel(70),
                            height: pixel(30),
                            borderRadius: pixel(15),
                        }}
                    />
                </View>
            </TouchableOpacity>
        );
    }
}

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
});

export default UserItem;
