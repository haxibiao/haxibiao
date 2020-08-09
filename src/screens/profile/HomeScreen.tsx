import React, { Component, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-root-toast';

import { Avatar, PageContainer, SettingItem, WriteModal, Iconfont, WheelPicker } from '~/components';

import { Mutation, GQL, useApolloClient, useQuery } from '~/apollo';

import { observer } from 'mobx-react';
import { userStore } from '~/store';

const EditProfileScreen = (props: any) => {
    // const setNameModal = setNameModal.bind(this);

    const client = useApolloClient();
    const { navigation } = props;

    let nickname = '';
    let nickintroduction = '';
    let { me: user } = userStore;
    const qianM = user.introduction || '这个人不是很勤快的亚子，啥也没留下…';

    const { data: walletData } = useQuery(GQL.userProfileQuery, {
        variables: { id: user.id },
        fetchPolicy: 'network-only',
    });
    const userData = Helper.syncGetter('user', walletData) || {};
    user = Object.assign({}, user, { ...userData });

    const [nameModalVisible, setNameModalVisible] = useState(false),
        [qianModalVisible, setQianModalVisible] = useState(false),
        [userGender, setUserGender] = useState(user.gender || '女'),
        [userBirthday, setUserBirthday] = useState(user.birthday_msg || '2000-01-01');

    console.log(user.birthday_msg);

    const setNameModal = () => {
        setNameModalVisible(!nameModalVisible);
    };
    const setQianModal = () => {
        setQianModalVisible(!qianModalVisible);
    };

    const saveAvatar = (imagePath: any) => {
        const { token } = userStore.me;
        var data = new FormData();
        data.append('avatar', {
            uri: imagePath,
            name: 'avatar.jpg',
            type: 'image/jpg',
        });
        const config = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: data,
        };

        fetch(Config.ServerRoot + '/api/user/save-avatar?api_token=' + token, config)
            .then((response) => response.text())
            .then((res) => {
                // console.log('avataraaaa：', res);
                userStore.changeAvatar(res);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const _changeAvatar = () => {
        ImagePicker.openPicker({
            width: 400,
            height: 400,
            cropping: true,
        })
            .then((image) => {
                saveAvatar(image.path);
                console.log('image.path', image.path);
            })
            .catch((error) => {});
    };

    const parseBirthday = () => {
        if (userBirthday) {
            // 兼容时间选择器去除个位数的0开头
            const date = userBirthday.split('-');
            for (let i = date.length - 1; i > 0; i--) {
                date[i] = parseInt(date[i]);
            }
            return date;
        }
        return [2000, 1, 1];
    };

    const onDatePickerConfirm = (value, index) => {
        let date = value
            .join('')
            .replace(/(年)|(月)/gi, '-')
            .replace(/(日)/gi, '');
        setUserBirthday(date);
        console.log('onDatePickerConfirm', date);

        client
            .mutate({
                mutation: GQL.updateUserBirthday,
                variables: {
                    id: user.id,
                    input: {
                        birthday: date,
                    },
                    refetchQueries: () => [
                        {
                            query: GQL.userQuery,
                            variables: { id: user.id },
                        },
                    ],
                },
            })
            .then((result) => {
                console.log('更改生日接口返回结果 :', result);
                setUserBirthday(date);
                // 更新 store 里的 me
                userStore.changeBirthday(date);
            })
            .catch((error) => {
                console.log('Error: [profile/HomeScreen] 更改生日接口返回错误 ', error);
                Toast.show('生日修改失败,服务器内部错误');
            });
    };
    const showDatePicker = () => {
        let Picker = new WheelPicker({
            onPickerConfirm: onDatePickerConfirm,
        });
        Picker._showDatePicker(parseBirthday());
    };

    function setGender() {
        let Gender = '';
        if (userGender === '女') {
            //用户性别是女 ，改成男
            // setUserGender('男');
            Gender = '男';
            console.log('setUserGender为男后 : gender', userGender);
        } else {
            //用户性别是男 ，改成女
            // setUserGender('女');
            Gender = '女';
        }
        client
            .mutate({
                mutation: GQL.updateUserGender,
                variables: { id: user.id, gender: Gender },
            })
            .then((result) => {
                console.log('更改性别接口返回结果 :', result);

                let res = Helper.syncGetter('data.updateUserInfo', result);
                let updatedGender = res.gender;
                setUserGender(updatedGender);

                //更新store里的me
                userStore.changeGender(updatedGender);
            })
            .catch((error) => {
                console.log('Error: [profile/HomeScreen] 更改性别接口返回错误 ', error);
                Toast.show('性别修改失败,服务器内部错误');
                if (userGender === '女') {
                    //用户性别是女 ，改成男
                    setUserGender('男');
                } else {
                    //用户性别是男 ，改成女
                    setUserGender('女');
                }
            });
    }

    return (
        <PageContainer title="修改资料">
            <View style={styles.container}>
                <ScrollView style={styles.container} bounces={false} removeClippedSubviews={true}>
                    <View style={styles.settingType}>
                        <View>
                            <Text style={styles.settingTypeText}>常规设置</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={_changeAvatar}>
                        <SettingItem itemName="更改头像" rightComponent={<Avatar source={user.avatar} size={34} />} />
                    </TouchableOpacity>

                    {/* <TouchableOpacity onPress={_changeAvatar}>
                        <SettingItem
                            itemName="主页背景图"
                            rightComponent={
                                <Image
                                    source={
                                        user.background
                                            ? { uri: user.background }
                                            : require('~/assets/images/blue_purple.png')
                                    }
                                    style={{ width: 60, height: 40, borderRadius: 5 }}
                                />
                            }
                        />
                    </TouchableOpacity> */}

                    <TouchableOpacity onPress={setNameModal}>
                        <View style={styles.settingItem}>
                            <SettingItem itemName="修改昵称" rightContent={user.name} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={setGender}>
                        <View style={styles.settingItem}>
                            <SettingItem itemName="性别" rightContent={user.gender || userGender} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={showDatePicker}>
                        <View style={styles.settingItem}>
                            <SettingItem itemName="生日" rightContent={userBirthday} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={setQianModal}>
                        <View style={styles.settingItem}>
                            <SettingItem itemName="签名" rightContent={qianM} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('AccountSecurity', { user });
                        }}>
                        <SettingItem
                            itemName="账号绑定"
                            rightComponent={<Iconfont name="right" size={18} color="#6666" />}
                        />
                    </TouchableOpacity>
                </ScrollView>
            </View>
            <Mutation mutation={GQL.updateUserName}>
                {(updateUserName: any) => {
                    return (
                        <WriteModal
                            modalName="修改昵称"
                            placeholder={user.name}
                            visible={nameModalVisible}
                            value={nickname}
                            handleVisible={setNameModal}
                            changeVaule={(val: any) => {
                                nickname = val;
                            }}
                            submit={() => {
                                if (nickname.length < 1) {
                                    setNameModal();
                                    return;
                                }
                                setNameModal();
                                updateUserName({
                                    variables: {
                                        input: {
                                            name: nickname,
                                        },
                                        id: user.id,
                                    },
                                });
                                userStore.changeName(nickname);
                            }}
                        />
                    );
                }}
            </Mutation>
            <Mutation mutation={GQL.updateUserIntroduction}>
                {(updateUserIntroduction: any) => {
                    return (
                        <WriteModal
                            modalName="修改签名"
                            placeholder={qianM}
                            visible={qianModalVisible}
                            value={nickintroduction}
                            handleVisible={setQianModal}
                            changeVaule={(val: any) => {
                                nickintroduction = val;
                            }}
                            submit={() => {
                                if (nickintroduction.length < 1) {
                                    setQianModal();
                                    return;
                                }
                                setQianModal();
                                updateUserIntroduction({
                                    variables: {
                                        input: {
                                            introduction: nickintroduction,
                                        },
                                        id: user.id,
                                    },
                                });
                                userStore.changeIntroduction(nickintroduction);
                            }}
                        />
                    );
                }}
            </Mutation>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.skinColor || '#FFF',
    },
    settingItem: {
        flex: 1,
    },
    settingType: {
        paddingBottom: 8,
        paddingTop: 16,
        paddingLeft: 15,
        backgroundColor: Theme.lightGray,
        borderBottomWidth: 10,
        borderColor: '#FAFAFA',
        justifyContent: 'flex-end',
    },
    settingTypeText: {
        fontSize: 13,
        color: Theme.themeColor,
    },
    settingItemContent: {
        fontSize: 17,
        color: Theme.tintFontColor,
    },
});

export default observer(EditProfileScreen);
