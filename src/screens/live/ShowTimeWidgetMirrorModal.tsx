import React from 'react';
import { View, Slider, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { observer } from 'mobx-react';
import { LivePushManager } from 'react-native-live';
import { Overlay } from 'teaset';
import LiveBeautyStore from './LiveBeautyStore';

const sw: number = Dimensions.get('window').width,
    sh: number = Dimensions.get('window').height;

const ContentView = observer(() => {
    return (
        <View style={styles.content}>
            <Text style={{ fontSize: 17, marginTop: 6, marginBottom: 8, color: '#666' }}>镜像</Text>
            <Text style={{ fontSize: 14, color: 'gray', marginHorizontal: 15 }}>
                开启镜像后，观众端看到的画面将和主播端看到的画面一致。如果不开启的话，因为镜像原因，观众观看到的画面和主播端看到的是相反的哦。
            </Text>
            <Text style={{ color: '#555', marginBottom: 6, marginTop: 12 }}>
                当前已：
                <Text style={{ color: LiveBeautyStore.mirrored ? 'green' : '#333' }}>
                    {LiveBeautyStore.mirrored ? '开启' : '关闭'}
                </Text>
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => {
                        //开启镜像
                        LivePushManager.setMirrorEnabled(true);
                        LiveBeautyStore.setmirrored(true);
                    }}
                    style={{
                        height: 28,
                        width: 70,
                        backgroundColor: '#FFC543',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderTopLeftRadius: 6,
                        borderBottomLeftRadius: 6,
                    }}>
                    <Text style={{ color: 'white' }}>开启</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        //关闭镜像
                        LivePushManager.setMirrorEnabled(false);
                        LiveBeautyStore.setmirrored(false);
                    }}
                    style={{
                        height: 28,
                        width: 70,
                        backgroundColor: 'lightgray',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderTopRightRadius: 6,
                        borderBottomRightRadius: 6,
                    }}>
                    <Text style={{ color: 'white' }}>关闭</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
});

let Overlaykey: any = null;
const showMirrorModal = () => {
    const view = (
        <Overlay.PullView overlayOpacity={0} side="bottom" containerStyle={{ backgroundColor: 'transparent' }}>
            <ContentView />
        </Overlay.PullView>
    );
    Overlaykey = Overlay.show(view);
};

const hideMirrorModal = () => {
    Overlay.hide(Overlaykey);
};

export { showMirrorModal, hideMirrorModal };

const styles = StyleSheet.create({
    content: {
        width: sw,
        height: sh * 0.26,
        backgroundColor: '#ffffff',
        borderTopRightRadius: 13,
        borderTopLeftRadius: 13,
        overflow: 'hidden',
        alignItems: 'center',
    },
    option_title: {
        color: '#aaa',
    },
});
