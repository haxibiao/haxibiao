/*
 * @flow
 * created by wyk made in 2019-03-21 14:13:47
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, Image } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row, ListItem } from '@src/components';

class AboutUs extends Component {
    render() {
        return (
            <PageContainer title={'关于' + Config.AppName} white>
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'space-between' }}>
                        <View style={{ marginTop: PxDp(30) }}>
                            <View style={{ alignItems: 'center', paddingVertical: PxDp(15) }}>
                                <Image
                                    source={require('@app/icon.png')}
                                    style={{
                                        width: Device.WIDTH / 4,
                                        height: Device.WIDTH / 4,
                                        borderRadius: PxDp(10),
                                    }}
                                />
                                <Text style={styles.AppVersion}>
                                    {Config.AppName} {Config.AppVersion}
                                </Text>
                            </View>
                            <View style={{ paddingHorizontal: PxDp(20) }}>
                                <Text style={styles.sectionTitle}>关于{Config.AppName}</Text>
                                <Text style={styles.appIntro}>
                                    {Config.AppName}
                                    是一款手机休闲益智短视频学习软件。
                                    视频内容将不断更新，让您随时学到新的知识。成功答题的您还能获得收益哦！在等朋友,等公交,等吃饭或其他碎片时间。
                                    玩{Config.AppName}
                                    学知识拿金钱，是您killtime的最佳搭档。如果你觉得你掌握的知识够全面就快来
                                    {Config.AppName}吧，各国趣味知识，涵盖天文、地理、历史科学应有尽有。
                                </Text>
                            </View>

                            <View style={{ marginTop: PxDp(30) }}>
                                <View style={{ paddingHorizontal: PxDp(20) }}>
                                    <Text style={styles.sectionTitle}>联系我们</Text>
                                    {/*<Text style={{ fontSize: 13, color: Theme.subTextColor, marginTop: 15 }}>QQ交流群: 4337413</Text>*/}
                                    <Text style={styles.officialText}>官网地址： haxibiao.com</Text>
                                    <Text style={styles.officialText}>商务合作： db@haxibiao.com</Text>
                                    <Text style={styles.officialText}>新浪微博： 哈希表</Text>
                                    <Text style={styles.officialText}>官方QQ群： 735220029</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.copyright}>
                            <Text>近邻乐(深圳)有限责任公司</Text>
                            <Text>www.haxibiao.com</Text>
                        </View>
                    </View>
                </ScrollView>
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: Theme.white,
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT || PxDp(15),
    },
    AppVersion: { color: Theme.defaultTextColor, fontSize: PxDp(15), margin: PxDp(20) },
    sectionTitle: { fontSize: 15, color: Theme.defaultTextColor },
    appIntro: {
        fontSize: PxDp(13),
        color: Theme.subTextColor,
        marginTop: PxDp(15),
        lineHeight: PxDp(18),
        fontWeight: '300',
    },
    officialText: { fontSize: PxDp(13), color: Theme.subTextColor, marginTop: PxDp(10) },
    copyright: {
        paddingTop: PxDp(15),
        alignItems: 'center',
    },
});

export default AboutUs;
