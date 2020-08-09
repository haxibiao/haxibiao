import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { PageContainer } from '~/components';

const SpiderVideoTask = () => {
    const WIDTH = Device.WIDTH - 30;

    return (
        <PageContainer title="任务介绍" white>
            <ScrollView style={{ flex: 1, paddingHorizontal: PxDp(15) }}>
                <Image
                    source={require('~/assets/images/spider_video_task1.png')}
                    style={{ width: WIDTH, height: (WIDTH * 724) / 892, marginTop: PxDp(15) }}
                />
                <Image
                    source={require('~/assets/images/spider_video_task2.png')}
                    style={{ width: WIDTH, height: (WIDTH * 1598) / 989 }}
                />
                <Image
                    source={require('~/assets/images/spider_video_task3.png')}
                    style={{ width: WIDTH, height: (WIDTH * 1670) / 989 }}
                />
            </ScrollView>
        </PageContainer>
    );
};

export default SpiderVideoTask;
