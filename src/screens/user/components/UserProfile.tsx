import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { HxfButton, FollowButton, Row, Iconfont, Avatar } from '@src/components';
import { GQL, useQuery } from '@src/apollo';
import { useNavigation, useNavigationParam } from '@src/router';
import { userStore, observer } from '@src/store';

const UserProfile = observer(({ user }) => {
    const navigation = useNavigation();
    const me = Helper.syncGetter('me', userStore);
    const isSelf = me.id === user.id;
    let usData = user;
    const age = user.age;
    user = isSelf ? me : user;
    user.age = user.age || usData.age;

    let bgHeight = Device.HEIGHT * 0.55;
    let [allHeight, setAllHeight] = useState(bgHeight);
    // console.log('测试', user.count_followers);

    return (
        <View style={{ height: allHeight, backgroundColor: '#FFF' }}>
            <View style={{ height: bgHeight }}>
                <Image
                    style={{ flex: 1, width: '100%' }}
                    source={user.background || require('@src/assets/images/blue_purple.png')}
                />
                <Row
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        flex: 1,
                        backgroundColor: '#00000077',
                        width: '100%',
                        height: '100%',
                        alignItems: 'flex-end',
                        paddingBottom: 50,
                        paddingHorizontal: 15,
                    }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ width: 80 }}>
                            <View
                                style={{
                                    borderColor: '#FFF5',
                                    backgroundColor: '#FFF5',
                                    borderRadius: 90,
                                    borderWidth: 3,
                                    width: Font(22),
                                    height: Font(22),
                                    position: 'absolute',
                                    right: 0,
                                    bottom: 0,
                                }}
                            />
                            <Avatar
                                source={{
                                    uri: user.avatar,
                                }}
                                size={80}
                                style={{
                                    borderColor: '#FFF',
                                    borderRadius: 90,
                                    borderWidth: 3,
                                    padding: 3,
                                }}
                            />
                            <View
                                style={{
                                    borderColor: '#FFF0',
                                    borderRadius: 90,
                                    borderWidth: 3,
                                    width: Font(24),
                                    height: Font(24),
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    position: 'absolute',
                                    right: 0,
                                    bottom: 0,
                                }}>
                                <Iconfont
                                    name={user.gender === '男' ? 'boy' : 'girl'}
                                    size={Font(17)}
                                    color={user.gender === '男' ? Theme.boy : Theme.girl}
                                    style={{
                                        backgroundColor: '#FFF',
                                        borderRadius: Font(24),
                                        position: 'absolute',
                                        right: 0,
                                        left: 0,
                                        bottom: 0,
                                        top: 0,
                                    }}
                                />
                            </View>
                        </View>

                        <Text
                            style={{
                                color: '#FFF',
                                fontWeight: 'bold',
                                fontSize: 20,
                                marginTop: 15,
                            }}>
                            {user.name}
                        </Text>
                        <Row style={{ marginVertical: 8 }}>
                            <Text
                                style={{
                                    color: '#FFF',
                                    paddingHorizontal: 8,
                                    paddingVertical: 3,
                                    backgroundColor: '#FFF6',
                                    borderRadius: 5,
                                    marginRight: 5,
                                    textAlign: 'center',
                                }}>
                                {age ? age + '岁' : 'Ta 很神秘'}
                            </Text>
                        </Row>
                        <Text style={{ color: '#FFF', fontSize: 12 }}>
                            {user.introduction ? user.introduction : '这个人不是很勤快的亚子，啥也没留下…'}
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                paddingVertical: 8,
                                alignItems: 'center',
                            }}>
                            <TouchableOpacity
                                style={styles.metaItem}
                                onPress={() => navigation.navigate('Society', { user })}>
                                <Text
                                    style={{
                                        color: '#FFF',
                                        fontWeight: 'bold',
                                        fontSize: 20,
                                        marginRight: 5,
                                    }}>
                                    {user.count_followings || 0}
                                </Text>
                                <Text style={{ color: '#FFF', marginRight: 15 }}>关注</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.metaItem}
                                onPress={() => navigation.navigate('Society', { user, follower: true })}>
                                <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 20, marginRight: 5 }}>
                                    {user.count_followers || 0}
                                </Text>
                                <Text style={{ color: '#FFF' }}>粉丝</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View
                        style={{
                            alignContent: 'center',
                            justifyContent: 'center',
                            marginLeft: 55,
                            marginRight: 5,
                            marginBottom: 15,
                        }}>
                        {isSelf ? (
                            <HxfButton
                                size="small"
                                title="编辑资料"
                                plain={true}
                                titleStyle={{
                                    color: '#FFF',
                                }}
                                style={{
                                    backgroundColor: '#53A1F7',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 30,
                                    paddingHorizontal: 15,
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    borderWidth: 0,
                                }}
                                onPress={() => navigation.navigate('编辑个人资料')}
                            />
                        ) : (
                            <FollowButton
                                style={{
                                    backgroundColor: '#53A1F7',
                                    width: PxDp(80),
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 30,
                                    paddingHorizontal: 15,
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    marginTop: 15,
                                }}
                                activeColor={'#FFF'}
                                id={user.id}
                                followedStatus={user.followed_status}
                            />
                        )}
                    </View>
                </Row>
            </View>
            <View
                style={{
                    position: 'absolute',
                    top: bgHeight - bgHeight * 0.1,
                    flex: 1,
                    height: bgHeight * 0.1,
                    width: '100%',
                    backgroundColor: '#FFF',
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                }}
                onLayout={info => {
                    setAllHeight(allHeight + info.nativeEvent.layout.height - bgHeight * 0.1);
                    // 获取悬浮信息高度设置到头部总高度上
                }}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    alignItemBaseline: {
        alignItems: 'baseline',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    avatar: {
        borderColor: '#fff',
        borderRadius: PxDp(40),
        borderWidth: PxDp(2),
        height: PxDp(80),
        width: PxDp(80),
    },
    backdrop: {
        height: Device.WIDTH * 0.33,
        width: Device.WIDTH,
    },
    editButton: {
        borderRadius: PxDp(5),
        paddingHorizontal: PxDp(16),
        paddingVertical: PxDp(8),
    },
    followButton: {
        borderRadius: PxDp(5),
        paddingHorizontal: PxDp(16),
        paddingVertical: PxDp(8),
    },
    introduction: {
        color: Theme.secondaryTextColor,
        fontSize: Font(14),
        marginVertical: PxDp(15),
    },
    metaCountText: {
        color: Theme.defaultTextColor,
        fontSize: Font(15),
        fontWeight: 'bold',
        marginRight: PxDp(5),
    },
    metaItem: {
        alignItems: 'baseline',
        flexDirection: 'row',
        marginRight: PxDp(12),
    },
    metaList: {
        flexDirection: 'row',
    },
    metaText: {
        color: Theme.secondaryTextColor,
        fontSize: Font(13),
    },
    name: {
        color: Theme.defaultTextColor,
        fontSize: Font(18),
        marginRight: PxDp(10),
    },
    userProfileContainer: {
        borderBottomColor: Theme.borderColor,
        borderBottomWidth: PxDp(10),
        marginTop: PxDp(-40),
        paddingBottom: PxDp(10),
        paddingHorizontal: PxDp(Theme.itemSpace),
    },
});

export default UserProfile;
