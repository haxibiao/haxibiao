import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, NativeModules } from 'react-native';

import { appStore } from '@src/store';

import { Overlay } from 'teaset';

class UpdateOverlay {
    static show(versionData, serverVersion) {
        let overlayView = (
            <Overlay.View animated>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <Text style={styles.modalRemindContent}>检测到新版本</Text>
                        </View>
                        <View style={styles.center}>
                            <Text style={styles.centerTitle}>建议在WLAN环境下进行升级</Text>
                            <Text style={styles.centerTitle}>版本：{serverVersion}</Text>
                            <Text style={styles.centerTitle}>大小：{versionData.size}</Text>
                            <Text style={styles.centerTitle}>更新说明：</Text>
                            <Text style={styles.centerInfo}>{versionData.description}</Text>
                        </View>

                        <View style={styles.modalFooter}>
                            {!versionData.is_force && (
                                <TouchableOpacity
                                    style={styles.operation}
                                    onPress={() => {
                                        UpdateOverlay.hide();
                                        appStore.updateViewedVesion(serverVersion);
                                    }}>
                                    <Text style={styles.operationText}>以后再说</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                style={[
                                    styles.operation,
                                    versionData.is_force
                                        ? null
                                        : { borderLeftColor: Theme.lightBorder, borderLeftWidth: 0.5 },
                                ]}
                                onPress={() => {
                                    if (versionData.apk) {
                                        NativeModules.DownloadApk.downloading(
                                            versionData.apk || '',
                                            'haxibiao.apk',
                                            Config.DisplayName,
                                        );
                                        // UpdateOverlay.hide();
                                    } else {
                                        UpdateOverlay.hide();
                                        Toast.show({
                                            content: '更新失败，请稍后重试！',
                                            layout: 'bottom',
                                        });
                                    }
                                }}>
                                <Text style={[styles.operationText, { color: Theme.primaryColor }]}>立即更新</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Overlay.View>
        );
        this.OverlayKey = Overlay.show(overlayView);
    }

    static hide() {
        Overlay.hide(this.OverlayKey);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Device.WIDTH,
        height: Device.HEIGHT,
        backgroundColor: 'rgba(255,255,255,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: Device.WIDTH - PxDp(60),
        borderRadius: PxDp(15),
        backgroundColor: '#FFF',
        padding: 0,
    },
    header: {
        justifyContent: 'center',
        paddingTop: PxDp(25),
    },
    headerText: {
        color: Theme.tintTextColor,
        fontSize: PxDp(13),
        textAlign: 'center',
        paddingTop: PxDp(3),
    },
    center: {
        paddingTop: PxDp(15),
        paddingBottom: PxDp(20),
        paddingHorizontal: PxDp(20),
    },
    centerTitle: {
        fontSize: PxDp(14),
        color: Theme.navBarMenuColor,
        paddingTop: PxDp(10),
        lineHeight: PxDp(22),
    },
    centerInfo: {
        fontSize: PxDp(14),
        color: Theme.navBarMenuColor,
        lineHeight: PxDp(22),
    },
    modalRemindContent: {
        fontSize: PxDp(18),
        color: '#000',
        paddingHorizontal: PxDp(15),
        textAlign: 'center',
        lineHeight: PxDp(20),
        fontWeight: '500',
    },
    modalFooter: {
        borderTopWidth: PxDp(0.5),
        borderTopColor: Theme.borderColor,
        flexDirection: 'row',
    },
    operation: {
        paddingVertical: PxDp(15),
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    operationText: {
        fontSize: PxDp(15),
        fontWeight: '400',
        color: Theme.navBarMenuColor,
    },
});

export default UpdateOverlay;
