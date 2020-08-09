import React, { useMemo, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, BackHandler, View, Text, TouchableOpacity, NativeEventSubscription } from 'react-native';
import { Overlay } from 'teaset';
import { ad } from 'react-native-ad';
import { userStore } from '~/store';

const OverlayWidth = Device.WIDTH * 0.6;
const ADWidth =
    Device.WIDTH * 0.6 > PxDp(400) ? PxDp(360) : Device.WIDTH * 0.6 > PxDp(300) ? Device.WIDTH * 0.6 : PxDp(260);

export const useDetainment = (navigation: any, isEntry: boolean) => {
    const continuous = useRef(true);
    const firstExecute = useRef(isEntry);
    const entryListener = useRef<NativeEventSubscription>();
    const overlayKey = useRef();
    // const navigation: any = useRef(Tools.rootNavigation);
    const OverlayContent = useMemo(() => {
        return (
            <View style={styles.overlayInner}>
                <View style={styles.overlayContent}>
                    <Text style={styles.contentText}>还差一点就能提现了，确定要离开吗？🤔</Text>
                    <View style={styles.strategy}>
                        <Text style={styles.strategyText}>
                            查看赚钱攻略💰{Helper.syncGetter('wallet.total_withdraw_amount', userStore)}
                        </Text>
                    </View>
                </View>
                <View style={styles.overlayFooter}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            BackHandler.exitApp();
                        }}>
                        <Text style={styles.buttonText}>遗憾离开</Text>
                    </TouchableOpacity>
                    <View style={styles.verticalLine} />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            Overlay.hide(overlayKey.current);
                            return true;
                        }}>
                        <Text style={[styles.buttonText, { color: Theme.primaryColor }]}>继续赚钱</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }, []);

    const handle = useCallback(() => {
        if (continuous.current) {
            // 确保在1.5s内连续点击两次
            continuous.current = false;
            Toast.show({ content: '再次点击退出', layout: 'bottom' });
            setTimeout(() => {
                continuous.current = true;
            }, 1500);
            return true;
        }
        // 直接退出
        return false;
        // 挽留弹窗
        // if (true) {
        //     overlayKey.current = Overlay.show(
        //         <Overlay.PopView modal={true} style={styles.overlay}>
        //             {OverlayContent}
        //         </Overlay.PopView>,
        //     );
        //     return true;
        // }
    }, []);

    useEffect(() => {
        // App启动，首页navigation没有立马收到监听，需要自己挂载监听
        if (firstExecute.current && !entryListener.current) {
            entryListener.current = BackHandler.addEventListener('hardwareBackPress', handle);
        }
        let hardwareBackPressListener: any;
        navigation.addListener('willFocus', () => {
            if (firstExecute.current && entryListener.current) {
                entryListener.current.remove();
                firstExecute.current = false;
            }
            hardwareBackPressListener = BackHandler.addEventListener('hardwareBackPress', handle);
        });
        navigation.addListener('willBlur', () => {
            if (firstExecute.current && entryListener.current) {
                entryListener.current.remove();
                firstExecute.current = false;
            }
            if (hardwareBackPressListener) {
                hardwareBackPressListener.remove();
                hardwareBackPressListener = null;
            }
        });
        return () => {
            if (firstExecute.current && entryListener.current) {
                entryListener.current.remove();
                firstExecute.current = false;
            }
            if (hardwareBackPressListener) {
                hardwareBackPressListener.remove();
                hardwareBackPressListener = null;
            }
        };
    }, []);
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    buttonText: {
        color: '#969696',
        fontSize: PxDp(15),
    },
    contentText: {
        color: '#202020',
        fontSize: PxDp(16),
    },
    strategy: {
        alignItems: 'flex-end',
        marginTop: PxDp(5),
    },
    strategyText: {
        fontSize: PxDp(15),
        color: '#FFCC01',
    },
    overlay: { alignItems: 'center', justifyContent: 'center' },
    overlayAd: {
        backgroundColor: '#f0f0f0',
        marginTop: PxDp(20),
        minHeight: ADWidth * 0.5,
        width: ADWidth,
    },
    overlayContent: {
        padding: PxDp(20),
        paddingVertical: PxDp(30),
    },
    overlayFooter: {
        alignItems: 'stretch',
        borderColor: '#f0f0f0',
        borderTopWidth: PxDp(1),
        flexDirection: 'row',
        height: PxDp(50),
    },
    overlayInner: {
        backgroundColor: '#ffffff',
        borderRadius: PxDp(10),
        maxWidth: PxDp(400),
        minWidth: PxDp(300),
        width: OverlayWidth,
    },
    verticalLine: {
        backgroundColor: '#f0f0f0',
        width: PxDp(1),
    },
});
