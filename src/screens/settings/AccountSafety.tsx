import React, { Component, useState } from 'react';
import { StyleSheet, Text, ScrollView, View,TextInput, TouchableOpacity } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, ListItem, ItemSeparator, PopOverlay } from 'components';
import { userStore } from '@src/store';
import { GQL, useQuery, useApolloClient,withApollo } from '@src/apollo';
import { useNavigation } from '@src/router';

export default function AccountSafety(){

    const [phone,onChangeText] = useState('');
    const [password,onPasswordChange] = useState('');

    const [valid, setValide] = useState(false);
    const [activeOpacity,setActiveOpacity] = useState(1);

    const client = useApolloClient();
    const me = {...userStore.me};
    let {id} = me;
    console.log("me from accountsafety  Phone NUmber : ",me.phone);

    const navigation = useNavigation();

    return (
        <PageContainer title="设置账号" white>
            <View style={styles.container}>
                <View style={styles.itemWrapper}>
                    <Text style={styles.title}>设置账号与密码</Text>
                </View>
                <View style={styles.inputWrapper}>
                    <TextInput 
                        style={styles.input} 
                        onChangeText = { text => onChangeText(text)}
                        value={phone}
                        maxLength={11}
                        placeholder={"请输入手机号"}
                        placeholderTextColor="#c1c4cb"
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <TextInput 
                        style={styles.input} 
                        onChangeText = { text => {
                            onPasswordChange(text)
                            if(phone === '' || password === ''){

                            }else{
                                setValide(true);
                                setActiveOpacity(0.5);
                            }
                        }}
                        value={password}
                        maxLength={16}
                        placeholder={"请设置密码"}
                        placeholderTextColor="#c1c4cb"
                    />
                </View>
                <TouchableOpacity 
                onPress={() => {
                    // TODO: 调用更新数据接口
                    client.mutate({
                        mutation: GQL.updateUserInfoSecurity,
                        variables: {id: id,phone:phone,password: password}
                    }).then( result => {
                        console.log("更新用户数据后返回的用户信息: ",result);
                        Toast.show({content: '绑定成功'});
                        navigation.goBack();
                        userStore.changePhone(phone);
                    })
                    .catch(error => {
                        console.log("绑定静默注册用户账号密码接口错误  error : ",error);
                        PopOverlay({
                            content: '网络错误，绑定失败，请稍后重试',
                            onConfirm: async () => {

                            }
                        })
                    });
                }} 
                activeOpacity={activeOpacity}
                style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                    <View style={{width:'90%',height:40,marginTop:30,backgroundColor: Theme.primaryColor,flexDirection:'column',justifyContent:'center',alignItems:'center',borderRadius:PxDp(5)}}>
                        <Text style={{color: '#fff',fontSize:15}}>完成</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </PageContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        width:'100%',
        height:'100%',
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:"center",
        backgroundColor:"#fff",
    },
    itemWrapper: {
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'center',
        alignSelf:'flex-start',
        height:43,
        marginTop: 50,
        marginStart: 26,
        marginBottom: 28
    },
    
    input: {
        
        width:'90%',
        height: 30,
        color: '#444',
        fontSize: 17,
        paddingStart: 14,
        paddingVertical:0,
        borderBottomWidth: Theme.minimumPixel,
        borderBottomColor: Theme.borderColor
    },
    card: {
        width: '100%',
        backgroundColor:'#fff',
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'flex-start'
    },
    title: {
        color:Theme.black,
        fontSize: 26,
        fontWeight: '400'
    },
    inputWrapper: {
        height: 46,
        width:'100%',
        marginTop: 12,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
    }
});