/*
 * @flow
 * created by wyk made in 2019-01-08 13:06:22
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Overlay } from 'teaset';
import SafeText from '../Basic/SafeText';
import TouchFeedback from '../Basic/TouchFeedback';

type args = {
    title?: string;
    content: any;
    onConfirm: Function;
    leftContent: string;
    rightContent: string;
    leftConfirm: Function;
};

function renderContent(content) {
    if (typeof content === 'string') {
        return <Text style={styles.messageText}>{content}</Text>;
    } else {
        return content;
    }
}

function PopOverlay(props: args) {
    let { title, content, onConfirm, leftContent, rightContent, leftConfirm } = props,
        popViewRef,
        overlayView;
    overlayView = (
        <Overlay.PopView
            style={{ alignItems: 'center', justifyContent: 'center' }}
            animated
            ref={(ref) => (popViewRef = ref)}>
            <View style={styles.overlayInner}>
                <SafeText style={styles.headerText}>{title || '提示'}</SafeText>
                {content && renderContent(content)}
                <View style={styles.control}>
                    <TouchFeedback
                        style={styles.cancel}
                        onPress={() => {
                            popViewRef.close();
                            leftConfirm && leftConfirm();
                        }}>
                        <Text style={styles.cancelText}>{leftContent || '取消'}</Text>
                    </TouchFeedback>
                    <TouchFeedback
                        style={styles.confirm}
                        onPress={() => {
                            onConfirm && onConfirm();
                            popViewRef.close();
                        }}>
                        <Text style={styles.confirmText}>{rightContent || '确定'}</Text>
                    </TouchFeedback>
                </View>
            </View>
        </Overlay.PopView>
    );
    Overlay.show(overlayView);
}

const styles = StyleSheet.create({
    cancel: {
        flex: 1,
        justifyContent: 'center',
    },
    cancelText: {
        textAlign: 'center',
        fontSize: pixel(16),
        color: Theme.subTextColor,
        borderRightWidth: pixel(1),
        borderRightColor: Theme.borderColor,
    },
    confirm: {
        flex: 1,
        justifyContent: 'center',
    },
    confirmText: {
        textAlign: 'center',
        fontSize: pixel(16),
        color: Theme.primaryColor,
    },
    control: {
        height: pixel(46),
        flexDirection: 'row',
        alignItems: 'stretch',
        borderTopWidth: pixel(1),
        borderTopColor: Theme.borderColor,
    },
    headerText: {
        fontSize: pixel(19),
        color: Theme.defaultTextColor,
        textAlign: 'center',
    },
    messageText: {
        fontSize: pixel(16),
        lineHeight: pixel(20),
        marginVertical: pixel(20),
        color: Theme.secondaryTextColor,
        textAlign: 'center',
    },
    overlayInner: {
        width: Helper.WPercent(80),
        paddingTop: pixel(20),
        paddingHorizontal: pixel(20),
        backgroundColor: '#fff',
        borderRadius: pixel(6),
    },
});

export default PopOverlay;
