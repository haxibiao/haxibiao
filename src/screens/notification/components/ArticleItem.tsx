import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Avatar } from '~/components';
import { middlewareNavigate } from '~/router';
// import {userStore} from '~/store';

export default (data: any) => {
    const { item } = data;
    console.log(Helper.syncGetter('article', item));

    let cover = Helper.syncGetter('article.cover', item);
    let cover_url = cover ? { uri: cover } : require('~/assets/images/default_avatar.png');

    return (
        <View style={{ flexDirection: 'row', paddingHorizontal: PxDp(20), marginVertical: PxDp(15) }}>
            <TouchableOpacity
                onPress={() => {
                    const user = Helper.syncGetter('user', item);
                    if (user) {
                        middlewareNavigate('User', { user });
                    } else {
                        Toast.show({ content: '该用户已经消失了！' });
                    }
                }}>
                <Avatar
                    source={
                        { uri: Helper.syncGetter('user.avatar', item) } || require('~/assets/images/default_avatar.png')
                    }
                />
            </TouchableOpacity>
            <View style={{ flex: 1, marginHorizontal: 15 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                    {Helper.syncGetter('user.name', item) || '匿名用户'}
                </Text>
                <Text style={{ fontSize: 15 }}>{Helper.syncGetter('type', item) || '赞了你的作品'}</Text>
                <Text style={{ marginTop: PxDp(10), color: '#AAA' }}>
                    {Helper.syncGetter('time_ago', item) || '1分钟前'}
                </Text>
            </View>
            <TouchableOpacity
                onPress={() => {
                    const post = Helper.syncGetter('article', item);
                    if (post) {
                        middlewareNavigate('PostDetail', { post });
                    } else {
                        Toast.show({ content: '该动态或视频已经不存在了！' });
                    }
                }}>
                <Image style={{ width: PxDp(90), height: PxDp(60), borderRadius: PxDp(6) }} source={cover_url} />
            </TouchableOpacity>
        </View>
    );
};
