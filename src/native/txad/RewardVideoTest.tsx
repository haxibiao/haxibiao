import React, { Component, useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Platform, TouchableOpacity } from 'react-native';
import RewardVideo from './RewardVideo';
import { Query, GQL, useQuery } from '@src/apollo';
import { appStore } from '@src/store';

function App() {
    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <TouchableOpacity
                    style={{
                        width: PxDp(80),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 100,
                        backgroundColor: '#F6DB4A',
                        paddingVertical: PxDp(10),
                        paddingHorizontal: PxDp(15),
                    }}
                    onPress={() => {
                        RewardVideo.startAd().then(result => {
                            console.log('激励视频回调：', result);

                            if (JSON.parse(result).ad_click) {
                                // 点击了激励视频
                                console.log('点击了激励视频！');
                            } else if (JSON.parse(result).video_play) {
                                // 广告播放完成
                                console.log('播放完成！');
                            } else {
                                console.log('视频出错！');
                            }
                        });
                    }}>
                    <Text style={{ color: '#000', fontWeight: 'bold' }}>测试</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default App;
