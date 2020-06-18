'use strict';

import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { appStore, Keys, Storage } from '@src/store';
import Row from '../Basic/Row';

import { Overlay } from 'teaset';

import UserAgreementView from '@src/screens/settings/UserAgreementView';
import PrivacyPolicyView from '@src/screens/settings/PrivacyPolicyView';

const UserAgreementOverlay = (isAgr = true, way = true) => {
    let overlayRef: any;
    return Overlay.show(
        <Overlay.View
            style={styles.overlay}
            ref={(ref: any) => {
                overlayRef = ref;
            }}>
            <View style={styles.overlayView}>
                {isAgr ? <UserAgreementView /> : <PrivacyPolicyView />}

                <Row>
                    <TouchableOpacity
                        onPress={() => {
                            overlayRef.close();
                            UserAgreementOverlay(isAgr, !way);
                        }}>
                        {way ? (
                            <Image
                                source={require('@app/assets/images/gou1.png')}
                                resizeMode="contain"
                                style={{ height: 13, width: 13, marginHorizontal: PxDp(5) }}
                            />
                        ) : (
                            <Image
                                source={require('@app/assets/images/gou2.png')}
                                resizeMode="contain"
                                style={{ height: 12, width: 12, marginHorizontal: PxDp(5) }}
                            />
                        )}
                    </TouchableOpacity>

                    <Text style={{ fontSize: 11, color: '#878787' }}>我已阅读并同意</Text>

                    <TouchableOpacity
                        style={styles.buttonView}
                        onPress={() => {
                            overlayRef.close();
                            UserAgreementOverlay(true);
                        }}>
                        <Text style={{ fontSize: 11, color: '#125BA4FF' }}>《用户协议》</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 11, color: '#878787' }}>和</Text>
                    <TouchableOpacity
                        style={styles.buttonView}
                        onPress={() => {
                            overlayRef.close();
                            UserAgreementOverlay(false);
                        }}>
                        <Text style={{ fontSize: 11, color: '#125BA4FF' }}>《隐私政策》</Text>
                    </TouchableOpacity>
                </Row>
                <TouchableOpacity
                    disabled={!way}
                    style={[styles.buttonwall,{backgroundColor: way ? '#1777FF':'#F5F5F5'}]}
                    onPress={() => {
                        appStore.createUserAgreement = false;
                        Storage.setItem(Keys.createUserAgreement, true);
                        overlayRef.close();
                    }}>
                    <Text style={{color: way ? '#fff':'#A3A3A3'}}>知道了</Text>
                </TouchableOpacity>
            </View>
        </Overlay.View>,
    );
};

const styles = StyleSheet.create({
    overlay: { alignItems: 'center', justifyContent: 'center' },
    buttonView: { padding: 10 },
    buttonwall:{
        height:40,
        width:200,
        borderRadius:20,
        alignItems:'center',
        justifyContent:'center',
        marginVertical:15,
    },
    buttonTitle: { color: '#259' },
    overlayView: {
        marginHorizontal: '10%',
        minHeight: '65%',
        padding: 10,
        borderRadius: 15,
        backgroundColor: '#FFF',
        alignItems:'center',
    },
});

export default UserAgreementOverlay;
