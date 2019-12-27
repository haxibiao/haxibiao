import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, ScrollView, Button, Alert } from 'react-native';
import { PageContainer } from '@src/components';
import { useNavigation } from '@src/router';

const Newuser = props => {
    const navigation = useNavigation();
    return (
        <PageContainer title="返回 ">
            <ScrollView>
                <View style={styles.Topshape}>
                    <Image
                        source={require('@app/assets/images/newuser.jpg')}
                        style={{ width: PxDp(400), height: PxDp(1300) }}
                    />
                </View>
                <View style={styles.but}>
                    <View style={styles.butbottom}>
                        {/* <Button title="完成" color="#A72DF3" onPress={() => navigate('浏览记录')} /> */}
                        <Button title="领取奖励" color="#A72DF3" onPress={() => navigation.navigate('TaskScreen')} />
                    </View>
                </View>
            </ScrollView>
        </PageContainer>
    );
};
const styles = StyleSheet.create({
    Topshape: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    but: {
        height: PxDp(60),
        backgroundColor: '#6A0BDF',
    },
    butbottom: {
        marginLeft: PxDp(40),
        width: PxDp(280),
        height: PxDp(250),
    },
});
export default Newuser;
