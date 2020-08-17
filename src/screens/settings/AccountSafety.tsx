import React, { Component, useState } from 'react';
import { StyleSheet, Text, ScrollView, View, TextInput, TouchableOpacity } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, HxfButton, HxfTextInput } from '~/components';
import { userStore } from '~/store';
import { GQL, useQuery, useMutation } from '~/apollo';
import { useNavigation } from '~/router';

export default function AccountSafety() {
    const navigation = useNavigation();
    const [phone, onChangeNumber] = useState('');
    const [password, onPasswordChange] = useState('');
    const me = userStore.me;

    const [updateUserInfoSecurity] = useMutation(GQL.updateUserInfoSecurity, {
        variables: { id: me.id, phone, password },
        onError: (error) => {
            Toast.show({
                content: error.message.replace('GraphQL error: ', '') || '手机号绑定失败',
            });
        },
        onCompleted: (mutationResult) => {
            Toast.show({
                content: '手机号绑定成功',
            });
            navigation.goBack();
            userStore.changePhone(phone);
        },
    });

    return (
        <PageContainer title="设置账号" white>
            <View style={styles.container}>
                <View style={styles.itemWrapper}>
                    <Text style={styles.title}>设置账号与密码</Text>
                </View>
                <View style={styles.inputWrapper}>
                    <HxfTextInput
                        style={styles.inputStyle}
                        placeholderTextColor={Theme.slateGray1}
                        onChangeText={onChangeNumber}
                        maxLength={11}
                        placeholder="请输入手机号"
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <HxfTextInput
                        style={styles.inputStyle}
                        placeholderTextColor={Theme.slateGray1}
                        onChangeText={onPasswordChange}
                        maxLength={16}
                        placeholder="请设置密码"
                        secureTextEntry={true}
                    />
                </View>
                <View style={styles.btnWrap}>
                    <HxfButton
                        title={'提交'}
                        gradient={true}
                        style={{ height: pixel(40) }}
                        disabled={!(password && phone)}
                        onPress={updateUserInfoSecurity}
                    />
                </View>
            </View>
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
    },
    itemWrapper: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'flex-start',
        height: 43,
        marginTop: 50,
        marginStart: 26,
        marginBottom: 28,
    },
    inputStyle: {
        fontSize: pixel(16),
        height: pixel(40),
        borderBottomWidth: Theme.minimumPixel,
        borderBottomColor: Theme.borderColor,
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    title: {
        color: Theme.defaultTextColor,
        fontSize: 26,
        fontWeight: '400',
    },
    inputWrapper: {
        marginHorizontal: pixel(Theme.itemSpace * 2),
        marginBottom: pixel(Theme.itemSpace),
    },
    btnWrap: {
        marginTop: pixel(Theme.itemSpace),
        marginHorizontal: pixel(Theme.itemSpace * 2),
    },
});
