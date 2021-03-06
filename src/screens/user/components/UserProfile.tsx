import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Image, Animated } from 'react-native';
import { HxfButton, FollowButton, Row, Iconfont, NavigatorBar, MoreOperation, GenderLabel } from '~/components';
import { GQL, useApolloClient, ApolloProvider } from '~/apollo';
import { useNavigation } from '~/router';
import { userStore, observer } from '~/store';
import { Overlay } from 'teaset';

export default observer(({ user, titleStyle, contentStyle }) => {
    const navigation = useNavigation();
    const client = useApolloClient();
    const me = Helper.syncGetter('me', userStore);
    const isSelf = me.id === user.id;
    const usData = user;
    const age = user.age;
    user = isSelf ? me : user;
    user.age = user.age || usData.age;

    const showMoreOperation = useCallback(() => {
        let overlayRef;
        const MoreOperationOverlay = (
            <Overlay.PullView
                style={{ flexDirection: 'column', justifyContent: 'flex-end' }}
                containerStyle={{ backgroundColor: 'transparent' }}
                animated={true}
                ref={(ref) => (overlayRef = ref)}>
                <ApolloProvider client={client}>
                    <MoreOperation
                        onPressIn={() => overlayRef.close()}
                        navigation={navigation}
                        target={user}
                        options={['举报', '拉黑']}
                        type="user"
                        deleteCallback={() => startAnimation(1, 0)}
                    />
                </ApolloProvider>
            </Overlay.PullView>
        );
        Overlay.show(MoreOperationOverlay);
    }, [client, user]);
    return (
        <View style={styles.profileContainer}>
            <ImageBackground source={require('!/assets/images/blue_purple.png')} style={styles.userProfileBg}>
                <View style={styles.mask} />
                <View style={styles.content}>
                    <Animated.View style={[styles.contentTop, contentStyle]}>
                        <Image
                            source={{
                                uri: user.avatar,
                            }}
                            style={styles.avatar}
                        />
                        <View style={{ flexDirection: 'row' }}>
                            {isSelf && (
                                <HxfButton
                                    size="small"
                                    title="编辑资料"
                                    plain={true}
                                    theme={'#fff'}
                                    onPress={() => navigation.navigate('编辑个人资料')}
                                />
                            )}
                        </View>
                    </Animated.View>
                    <View style={styles.contentBottom}>
                        <Row>
                            <Text style={styles.userName} numberOfLines={1}>
                                {user.name}
                            </Text>
                            <GenderLabel user={user} />
                        </Row>
                        <Text style={styles.introduction} numberOfLines={1}>
                            {user.introduction ? user.introduction : '这个人不是很勤快的亚子，啥也没留下…'}
                        </Text>
                        <View style={styles.metaList}>
                            <TouchableOpacity
                                style={styles.metaItem}
                                onPress={() => navigation.navigate('Society', { user })}>
                                <Text style={styles.metaCountText}>{user.count_followings || 0}</Text>
                                <Text style={styles.metaText}>关注</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.metaItem}
                                onPress={() => navigation.navigate('Society', { user, follower: true })}>
                                <Text style={styles.metaCountText}>{user.count_followers || 0}</Text>
                                <Text style={styles.metaText}>粉丝</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ImageBackground>
            <View style={styles.navBarStyle}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        navigation.goBack();
                    }}
                    style={styles.navBarButton}>
                    <Iconfont name="zuojiantou" color={'#fff'} size={pixel(22)} />
                </TouchableOpacity>
                <Animated.View style={[styles.navBarTitle, titleStyle]}>
                    <Text style={styles.titleText} numberOfLines={1}>
                        {user.name}
                    </Text>
                </Animated.View>
                {isSelf ? (
                    <View activeOpacity={1} style={[styles.navBarButton, { opacity: 0 }]}>
                        <Iconfont name="qita1" size={pixel(22)} color={'#fff'} />
                    </View>
                ) : (
                    <TouchableOpacity activeOpacity={1} onPress={showMoreOperation} style={styles.navBarButton}>
                        <Iconfont name="qita1" size={pixel(22)} color={'#fff'} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
});

{
    /* <Iconfont
    name={user.gender === '男' ? 'nan1' : 'nv'}
    size={font(17)}
    color={user.gender === '男' ? Theme.boy : Theme.girl}
    style={{
        backgroundColor: '#FFF',
        borderRadius: font(24),
        position: 'absolute',
        right: 0,
        left: 0,
        bottom: 0,
        top: 0,
    }}
/> */
}

const styles = StyleSheet.create({
    profileContainer: {
        flex: 1,
    },
    mask: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    userProfileBg: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    content: {
        flex: 1,
        paddingHorizontal: pixel(Theme.itemSpace),
        paddingTop: pixel(Theme.NAVBAR_HEIGHT + Theme.statusBarHeight),
    },
    contentTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    contentBottom: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: pixel(Theme.itemSpace),
    },
    navBarStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: pixel(Theme.NAVBAR_HEIGHT + Theme.statusBarHeight),
        paddingTop: pixel(Theme.statusBarHeight),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    navBarButton: {
        alignSelf: 'stretch',
        paddingHorizontal: pixel(Theme.itemSpace),
        justifyContent: 'center',
    },
    avatar: {
        width: pixel(80),
        height: pixel(80),
        borderColor: '#FFF',
        borderRadius: pixel(84),
        borderWidth: pixel(2),
    },
    editButton: {
        borderRadius: pixel(5),
        paddingHorizontal: pixel(16),
        paddingVertical: pixel(8),
    },
    followButton: {
        borderRadius: pixel(5),
        paddingHorizontal: pixel(16),
        paddingVertical: pixel(8),
    },
    introduction: {
        color: '#fff',
        fontSize: pixel(14),
    },
    metaCountText: {
        color: '#fff',
        fontSize: pixel(16),
        fontWeight: 'bold',
        marginRight: pixel(5),
    },
    metaItem: {
        alignItems: 'baseline',
        flexDirection: 'row',
        marginRight: pixel(Theme.itemSpace),
    },
    metaList: {
        flexDirection: 'row',
    },
    metaText: {
        color: '#fff',
        fontSize: pixel(12),
    },
    userName: {
        color: '#fff',
        fontSize: pixel(20),
        marginRight: pixel(10),
        fontWeight: 'bold',
    },
    navBarTitle: {
        alignSelf: 'center',
    },
    titleText: {
        color: '#fff',
        fontSize: pixel(15),
    },
});
