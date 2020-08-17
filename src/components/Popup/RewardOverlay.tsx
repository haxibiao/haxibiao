import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { ad } from 'react-native-ad';
import Iconfont from '../Iconfont';

export default (props) => {
    const { gold } = props;
    return (
        <View style={styles.container}>
            <Image source={require('!/assets/images/shine.png')} />
            <View style={styles.content}>
                <Image source={require('!/assets/images/reward_coin.png')} />
                <Text>{`恭喜获得100${Config.goldAlias}`}</Text>
                <TouchableOpacity>
                    <Text>{`${Config.goldAlias}翻倍`}</Text>
                </TouchableOpacity>
                <View>
                    <Text>{`我的${Config.goldAlias}：`}</Text>
                    <Image source={require('!/assets/images/icon_wallet_dmb.png')} />
                    <Text>900</Text>
                    <Text>≈1.5元</Text>
                </View>
                <TouchableOpacity style={styles.closeButton}>
                    <Iconfont name="close" size={pixel(18)} color="#f0f0f0" />
                </TouchableOpacity>
            </View>
            <View style={styles.adverse}>
                <ad.FeedAd adWidth={ADWidth} />
            </View>
        </View>
    );
};

const OverlayWidth = Device.WIDTH * 0.8;
const ADWidth = OverlayWidth > pixel(360) ? pixel(360) : OverlayWidth > pixel(300) ? OverlayWidth : pixel(300);

const styles = StyleSheet.create({
    adverse: {
        backgroundColor: '#f0f0f0',
        marginTop: pixel(20),
        minHeight: ADWidth * 0.5,
        width: ADWidth,
    },
    container: {
        backgroundColor: '#ffffff',
        borderRadius: pixel(10),
        maxWidth: pixel(360),
        minWidth: pixel(300),
        width: OverlayWidth,
    },
    content: {
        padding: pixel(20),
        paddingVertical: pixel(30),
    },
});
