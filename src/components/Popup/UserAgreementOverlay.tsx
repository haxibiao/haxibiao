'use strict';

import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { appStore, Keys, Storage } from '@src/store';
import Row from '../Basic/Row';

import { Overlay } from 'teaset';

import UserAgreementView from '@src/screens/settings/UserAgreementView';
import PrivacyPolicyView from '@src/screens/settings/PrivacyPolicyView';

const UserAgreementOverlay = (isAgr = true) => {
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
                        style={styles.buttonView}
                        onPress={() => {
                            overlayRef.close();
                            UserAgreementOverlay(!isAgr);
                        }}>
                        <Text>{isAgr ? '《隐私政策》' : '《用户协议》'}</Text>
                    </TouchableOpacity>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity
                        style={styles.buttonView}
                        onPress={() => {
                            appStore.createUserAgreement = false;
                            Storage.setItem(Keys.createUserAgreement, true);
                            overlayRef.close();
                        }}>
                        <Text style={styles.buttonTitle}>我已了解并同意</Text>
                    </TouchableOpacity>
                </Row>
            </View>
        </Overlay.View>,
    );
};

const styles = StyleSheet.create({
    overlay: { alignItems: 'center', justifyContent: 'center' },
    buttonView: { padding: 10 },
    buttonTitle: { color: '#259' },
    overlayView: {
        marginHorizontal: '10%',
        minHeight: '65%',
        padding: 10,
        borderRadius: 15,
        backgroundColor: '#FFF',
    },
});

export default UserAgreementOverlay;
