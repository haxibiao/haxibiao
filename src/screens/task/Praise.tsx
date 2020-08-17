import React, { useState, useMemo, useCallback } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    Dimensions,
    Keyboard,
    Linking,
    TextInput,
    Button,
} from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, MediaUploader, ItemSeparator } from '~/components';

import ModalDropdown from './components/ModalDropdown';
import { GQL, useQuery, useMutation, useApolloClient } from '~/apollo';
import { appStore } from '~/store';
import { locatedError } from 'graphql';

const { width, height } = Dimensions.get('window');

export default (props) => {
    const [formData, setFormData] = useState({ content: '', images: [] });
    const uploadResponse = useCallback((response) => {
        setFormData((prevFormData) => {
            return { ...prevFormData, images: response };
        });
    }, []);
    const [phone, onChangeNumber] = useState('');

    const user = props.route.params?.user ?? {};
    console.log('user.id', user);
    console.log('Token', TOKEN);

    const client = useApolloClient();

    const highPraiseTask = () => {
        client
            .mutate({
                mutation: GQL.highPraiseTaskMutation,
                variables: { id: 19, content: phone },
                refetchQueries: () => [
                    {
                        query: GQL.tasksQuery,
                    },
                ],
            })
            .then((result) => {
                Toast.show({ content: '好评通过审核后，奖励会自动发放，可在账单明细中查看' });
                props.navigation.goBack();
            })
            .catch((err) => {
                console.log('err', err, client);
            });
    };

    const appstores = ['OPPO', 'VIVO', '小米', '华为', '魅族', '百度', '豌豆荚', '应用宝'];

    return (
        <PageContainer title="好评任务">
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={{ fontSize: PxDp(15) }}>去应用商店好评</Text>
                    <TouchFeedback
                        style={styles.row}
                        onPress={() =>
                            Linking.openURL(Device.IOS ? Config.iosAppStoreUrl : 'market://details?id=' + Config.AppID)
                        }>
                        <Text style={{ fontSize: font(12), color: Theme.grey }}>去应用商店评价</Text>
                        <Iconfont name="right" size={PxDp(14)} color={Theme.grey} />
                    </TouchFeedback>
                </View>

                <View
                    style={{
                        paddingVertical: PxDp(4),
                        borderBottomWidth: PxDp(0.5),
                        borderColor: Theme.borderColor,
                    }}>
                    <TextInput
                        // style={styles.input}
                        placeholder={'应用商店账号(手机号)'}
                        maxLength={11}
                        onChangeText={onChangeNumber}
                        keyboardType="numeric"
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: PxDp(15) }}>
                    <Text style={{ marginVertical: PxDp(10) }}>应用商店</Text>
                    <ModalDropdown
                        defaultValue={'请选择应用商店'}
                        options={appstores} //下拉内容数组
                        showsVerticalScrollIndicator={false}
                        style={{
                            textAlign: 'center',
                            borderRadius: 100,
                            backgroundColor: '#F6DB4A55',
                            paddingVertical: PxDp(10),
                            paddingHorizontal: PxDp(10),
                            // marginHorizontal: PxDp(15),
                        }} //按钮样式
                        dropdownStyle={{
                            height: 32 * 4.8,
                            marginRight: -PxDp(10),
                            alignItems: 'center',
                        }} //下拉框样式
                        dropdownTextStyle={{
                            backgroundColor: '#F6DB4A55',
                            justifyContent: 'center',
                            borderRadius: 20,
                            alignItems: 'center',
                        }}
                    />
                </View>

                <View style={[styles.formTitleWrap, { marginVertical: PxDp(15) }]}>
                    <Text style={{ fontSize: font(16), color: Theme.primaryFont }}>
                        好评内容截图 ({formData.images.length}/3)
                    </Text>
                </View>
                <View style={styles.mediaWrap}>
                    <MediaUploader
                        type="image"
                        maximum={3}
                        onResponse={uploadResponse}
                        maxWidth={Device.WIDTH / 2}
                        style={styles.mediaItem}
                    />
                </View>
                <View style={styles.button}>
                    <Button title={'提交'} disabled={!(phone && formData.images.length > 0)} onPress={highPraiseTask} />
                </View>
            </View>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.white || '#FFF',
        marginHorizontal: PxDp(10),
        padding: PxDp(Theme.itemSpace),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    button: {
        marginTop: PxDp(40),
        marginHorizontal: PxDp(7),
        borderRadius: PxDp(5),
        justifyContent: 'center',
        height: 40,
        width: width * 0.82,
    },
});
