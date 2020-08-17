import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Easing, TextInput, Keyboard, TouchableOpacity, Image, Dimensions } from 'react-native';
import { ApolloClient } from 'apollo-boost';
import { Overlay } from 'teaset';
import { observer, appStore } from '@src/store';
import { GQL } from '@src/apollo';

import LiveStore from './LiveStore';

const sw: number = Dimensions.get('window').width,
    sh: number = Dimensions.get('window').height;

const BOTTOM_BUTTON_SIZE = 28;
let client: ApolloClient<unknown>;

const Content = observer((props: any) => {
    client = appStore.client;

    const inputRef = useRef<any>(null);

    const [text, settext] = useState('');
    const [h, seth] = useState(0);

    useEffect(() => {
        if (inputRef) {
            inputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        let show = Keyboard.addListener('keyboardDidShow', e => {
            console.log(e.endCoordinates.screenY);
            seth(15);
        });
        let hide = Keyboard.addListener('keyboardDidHide', e => {
            seth(0);
        });
        return () => {
            show.remove();
            hide.remove();
        };
    }, []);

    // console.log("h高度",h);

    return (
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <View
                style={{
                    width: sw,
                    minHeight: 38,
                    borderRadius: 5,
                    backgroundColor: 'white',
                    overflow: 'hidden',
                    position: 'absolute',
                }}>
                <View style={{ width: sw, minHeight: 38, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TextInput
                        ref={inputRef}
                        style={{
                            width: sw - BOTTOM_BUTTON_SIZE - 10,
                            minHeight: 38,
                            paddingTop: 5,
                            paddingBottom: h,
                            paddingStart: 10,
                        }}
                        multiline={true}
                        maxLength={50}
                        placeholder={'输入消息'}
                        onChangeText={t => {
                            settext(t);
                        }}
                        value={text}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            console.log('roomid: ', LiveStore.roomidForOnlinePeople);
                            if (client && text != '' && LiveStore.roomidForOnlinePeople) {
                                client
                                    .mutate({
                                        mutation: GQL.CommentLive,
                                        variables: { id: LiveStore.roomidForOnlinePeople, message: text },
                                    })
                                    .then(rs => {
                                        console.log('弹幕发送成功,', rs);
                                        settext('');
                                        hideInput();
                                    })
                                    .catch(err => {
                                        console.log('弹幕发送接口错误:', err);
                                    });
                            }
                        }}
                        style={{
                            marginTop: 5,
                            marginEnd: 10,
                            height: BOTTOM_BUTTON_SIZE,
                            width: BOTTOM_BUTTON_SIZE,
                            borderRadius: BOTTOM_BUTTON_SIZE / 2,
                            overflow: 'hidden',
                            backgroundColor: '#FFC543',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Image
                            source={require('./res/sendtop.png')}
                            resizeMode="contain"
                            style={{ height: BOTTOM_BUTTON_SIZE * 0.66, width: BOTTOM_BUTTON_SIZE * 0.66 }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
});

let overlaykey: any = null;
const showInput = () => {
    const view = (
        <Overlay.View overlayOpacity={0}>
            <Content />
        </Overlay.View>
    );
    overlaykey = Overlay.show(view);
};

const hideInput = () => {
    Overlay.hide(overlaykey);
};

export { showInput, hideInput };
