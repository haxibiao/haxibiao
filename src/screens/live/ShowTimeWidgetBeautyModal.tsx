import React from 'react';
import { View, Slider, Text, StyleSheet, Dimensions } from 'react-native';
import { observer } from 'mobx-react';
import { LivePushManager } from 'hxf-tencent-live';
import { Overlay } from 'teaset';
import LiveBeautyStore from './LiveBeautyStore';

const sw: number = Dimensions.get('window').width,
    sh: number = Dimensions.get('window').height;

const ContentView = observer(() => {
    const BlurHandler = (value: number) => {
        let rs = Math.round(value) * 10;
        LivePushManager.liveSetBeautyLevel(rs);
        LiveBeautyStore.setBlur(rs);
    };

    const WhiteHandler = (value: number) => {
        let rs = Math.round(value) * 10;
        LivePushManager.liveSetWhitenessLevel(rs);
        LiveBeautyStore.setWhiteness(rs);
    };

    return (
        <View style={styles.content}>
            <Text style={styles.option_title}>磨皮</Text>
            <View style={styles.slider_wrapper}>
                <Slider
                    value={LiveBeautyStore.blur}
                    thumbTintColor="#ffffffdd"
                    minimumTrackTintColor="#fff"
                    onValueChange={BlurHandler}
                />
            </View>
            <Text style={[styles.option_title, { marginTop: 15 }]}>美白</Text>
            <View style={styles.slider_wrapper}>
                <Slider
                    value={LiveBeautyStore.whiteness}
                    thumbTintColor="#ffffffdd"
                    minimumTrackTintColor="#fff"
                    onValueChange={WhiteHandler}
                />
            </View>
        </View>
    );
});

let Overlaykey: any = null;
const showBeautyModal = () => {
    const view = (
        <Overlay.PullView overlayOpacity={0} side="bottom" containerStyle={{ backgroundColor: 'transparent' }}>
            <ContentView />
        </Overlay.PullView>
    );
    Overlaykey = Overlay.show(view);
};

const hideBeautyModal = () => {
    Overlay.hide(Overlaykey);
};

export { showBeautyModal, hideBeautyModal };

const styles = StyleSheet.create({
    content: {
        width: sw,
        height: sh * 0.23,
        backgroundColor: '#ffffff',
        borderTopRightRadius: 13,
        borderTopLeftRadius: 13,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    option_title: {
        color: '#aaa',
        marginBottom: 5,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginStart: sw * 0.1,
    },
    slider_wrapper: {
        width: sw * 0.8,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#00000033',
        justifyContent: 'center',
    },
});
