/*
 * @flow
 * created by wyk made in 2019-01-16 16:06:13
 */

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, StatusBar } from 'react-native';
import { Overlay } from 'teaset';
import Iconfont from '../Iconfont';
import TouchFeedback from '../Basic/TouchFeedback';
import NavigatorBar from '../Header/NavigatorBar';

class OverlayViewer {
    static show(children) {
        const overlayView = (
            <Overlay.View animated>
                <View style={styles.container}>
                    <View style={styles.navBarStyle}>
                        <StatusBar translucent={true} backgroundColor={'rgba(0,0,0,0)'} barStyle={'dark-content'} />
                        <TouchableOpacity
                            onPress={() => OverlayViewer.hide()}
                            activeOpacity={1}
                            style={{
                                width: pixel(70),
                                height: pixel(30),
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Iconfont name="guanbi1" color={Theme.navBarMenuColor} size={pixel(24)} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }}>{children}</View>
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
        backgroundColor: '#000000',
        flex: 1,
        height: Device.HEIGHT,
        width: Device.WIDTH,
    },
    navBarStyle: {
        backgroundColor: Theme.navBarBackground,
        height: pixel(Theme.NAVBAR_HEIGHT + Theme.statusBarHeight),
        paddingTop: pixel(Theme.statusBarHeight),
        paddingLeft: pixel(Theme.itemSpace),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
});

export default OverlayViewer;
