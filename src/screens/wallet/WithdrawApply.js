import React from 'react';
import { StyleSheet, View, Image, Text, Dimensions, Button, TouchableOpacity } from 'react-native';
import { PageContainer, HxfButton } from '@src/components';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function WithdrawApply(props) {
    const created_at = props.navigation.getParam('created_at'); // 提现记录创建时间
    const amount = props.navigation.getParam('amount'); //单次提现额度
    return (
        <PageContainer title="提现申请">
            <View style={styles.container}>
                <Image source={require('../../assets/images/money.png')} style={styles.image} resizeMode={'contain'} />
                <View style={styles.content}>
                    <Text style={styles.header}>提现申请已提交</Text>
                    <View style={styles.center}>
                        <Text style={styles.money}>{amount}.00</Text>
                        <Text style={{ fontSize: Font(10), color: Theme.secondaryColor, paddingTop: PxDp(32) }}>
                            {' '}
                            元
                        </Text>
                    </View>
                    <View
                        style={{
                            width: SCREEN_WIDTH,
                            height: 60,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text style={styles.text}>预计3~5个工作日内到账支付宝</Text>
                    </View>
                    <HxfButton
                        title={'知道了'}
                        gradient={true}
                        style={styles.button}
                        onPress={() => props.navigation.goBack()}
                    />
                </View>
            </View>
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 90,
        height: 36,
        borderRadius: 12,
        backgroundColor: Theme.themeRed,
    },
    center: {
        flexDirection: 'row',
        marginTop: PxDp(20),
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,1)',
    },
    content: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 23,
    },
    header: {
        color: Theme.defaultTextColor,
        fontSize: Font(22),
    },
    image: {
        width: SCREEN_WIDTH * 0.35,
        height: SCREEN_WIDTH * 0.5,
        marginTop: 40,
    },
    money: {
        color: Theme.secondaryColor,
        fontSize: Font(43),
    },
    text: {
        color: '#363636',
        fontSize: Font(13),
    },
    button: {
        margin: PxDp(20),
    },
});
