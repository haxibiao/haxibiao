import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { ad } from '@src/native';
import Iconfont from '../Iconfont';

export default props => {
    const { gold } = props;
    return (
        <View style={styles.container}>
            <Image source={require('@app/assets/images/shine.png')} />
            <View style={styles.content}>
                <Image source={require('@app/assets/images/reward_coin.png')} />
                <Text>{`恭喜获得100${Config.goldAlias}`}</Text>
                <TouchableOpacity>
                    <Text>{`${Config.goldAlias}翻倍`}</Text>
                </TouchableOpacity>
                <View>
                    <Text>{`我的${Config.goldAlias}：`}</Text>
                    <Image source={require('@app/assets/images/icon_wallet_dmb.png')} />
                    <Text>900</Text>
                    <Text>≈1.5元</Text>
                </View>
                <TouchableOpacity style={styles.closeButton}>
                    <Iconfont name="close" size={PxDp(18)} color="#f0f0f0" />
                </TouchableOpacity>
            </View>
            <View style={styles.adverse}>
                <ad.FeedAd adWidth={ADWidth} />
            </View>
        </View>
    );
};

const OverlayWidth = Device.WIDTH * 0.8;
const ADWidth = OverlayWidth > PxDp(360) ? PxDp(360) : OverlayWidth > PxDp(300) ? OverlayWidth : PxDp(300);

const styles = StyleSheet.create({
    adverse: {
        backgroundColor: '#f0f0f0',
        marginTop: PxDp(20),
        minHeight: ADWidth * 0.5,
        width: ADWidth,
    },
    container: {
        backgroundColor: '#ffffff',
        borderRadius: PxDp(10),
        maxWidth: PxDp(360),
        minWidth: PxDp(300),
        width: OverlayWidth,
    },
    content: {
        padding: PxDp(20),
        paddingVertical: PxDp(30),
    },
});
