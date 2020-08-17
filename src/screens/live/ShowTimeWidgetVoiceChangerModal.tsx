import React, { useState } from 'react';
import { View, Slider, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Overlay } from 'teaset';
import { LivePushManager, VOICETYPE } from 'react-native-live';
import { observer } from 'mobx-react';
import LiveBeautyStore from './LiveBeautyStore';
import { Avatar } from 'react-native-widgets';

const sw: number = Dimensions.get('window').width,
    sh: number = Dimensions.get('window').height;

const ItemWidth = sw * 0.12;
const ItemGap = (sw - ItemWidth * 4) / 5;

const FakeVoices = [
    {
        type: VOICETYPE.lolita,
        file: require('./res/luoli.png'),
        name: '萝莉',
    },
    {
        type: VOICETYPE.fat_ass,
        file: require('./res/feizai.png'),
        name: '肥仔',
    },
    {
        type: VOICETYPE.electric,
        file: require('./res/shandian.png'),
        name: '强电流',
    },
    {
        type: VOICETYPE.wild_kids,
        file: require('./res/xiong.png'),
        name: '熊孩子',
    },
    {
        type: VOICETYPE.uncle,
        file: require('./res/ajaxi.png'),
        name: '大叔',
    },
];
const ContentView = () => {
    const [selected, setselected] = useState(-1);
    const [applied, setapplied] = useState(false);

    return (
        <View style={styles.content}>
            <Text style={{ fontSize: 17, marginTop: 6, marginBottom: 8, color: '#666' }}>变声</Text>
            <View style={{ width: sw, paddingStart: ItemGap, flexDirection: 'row', flexWrap: 'wrap' }}>
                {FakeVoices.map((item: { type: VOICETYPE; name: string; file: any }, index) => {
                    return (
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                setselected(index);
                                setapplied(false);
                            }}
                            style={{
                                width: ItemWidth,
                                marginEnd: ItemGap,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 15,
                            }}>
                            <Avatar
                                file={item.file}
                                size={ItemWidth * 0.8}
                                borderWidth={selected == index ? 2 : 0}
                                borderColor={'#FFC543'}
                                frameStyle={{ justifyContent: 'center', alignItems: 'center' }}
                            />
                            <Text style={{ color: 'gray', fontSize: 13, marginTop: 5 }}>{item.name}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
            <TouchableOpacity
                onPress={() => {
                    if (!applied) {
                        //显示确定状态
                        if (selected != -1) {
                            let type: any;
                            if (selected == 0) {
                                type = VOICETYPE.lolita;
                            } else if (selected == 1) {
                                type = VOICETYPE.fat_ass;
                            } else if (selected == 2) {
                                type = VOICETYPE.electric;
                            } else if (selected == 3) {
                                type = VOICETYPE.wild_kids;
                            } else if (selected == 4) {
                                type = VOICETYPE.uncle;
                            }
                            LivePushManager.setFakeVoice(type);
                            setapplied(true);
                        }
                    } else {
                        //关闭浮层
                        console.log('applied为true,关闭浮层');
                        hideVoiceChangerModal();
                    }
                }}
                activeOpacity={0.85}
                style={{
                    width: sw * 0.4,
                    height: 30,
                    backgroundColor: applied ? 'green' : '#FFC543',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    overflow: 'hidden',
                }}>
                <Text style={{ color: '#fff', fontSize: 18 }}>{applied ? '应用成功' : '确定'}</Text>
            </TouchableOpacity>
        </View>
    );
};

let Overlaykey: any = null;
const showVoiceChangerModal = () => {
    const view = (
        <Overlay.PullView overlayOpacity={0} side="bottom" containerStyle={{ backgroundColor: 'transparent' }}>
            <ContentView />
        </Overlay.PullView>
    );
    Overlaykey = Overlay.show(view);
};

const hideVoiceChangerModal = () => {
    Overlay.hide(Overlaykey);
};

export { showVoiceChangerModal, hideVoiceChangerModal };

const styles = StyleSheet.create({
    content: {
        width: sw,
        height: sh * 0.32,
        backgroundColor: '#ffffff',
        borderTopRightRadius: 13,
        borderTopLeftRadius: 13,
        overflow: 'hidden',
        alignItems: 'center',
    },
});
