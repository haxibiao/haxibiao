import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeText, Row, Badge, Avatar } from '~/components';
import { middlewareNavigate } from '~/router';

interface Props {
    chats: any;
}

const Chats = (props: Props) => {
    const { chats } = props;
    return (
        <View style={{ marginHorizontal: PxDp(10), borderRadius: PxDp(6) }}>
            {chats.length > 0 &&
                chats.map((chat, index) => {
                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.notifyItem}
                            onPress={() => middlewareNavigate('Chat', { chat })}>
                            <TouchableOpacity
                                onPress={() =>
                                    middlewareNavigate('User', { user: Helper.syncGetter('withUser', chat) })
                                }>
                                <Avatar source={Helper.syncGetter('withUser.avatar', chat)} size={PxDp(50)} />
                            </TouchableOpacity>
                            <View style={styles.itemContent}>
                                <Row style={styles.itemContentTop}>
                                    <SafeText style={styles.itemName}>
                                        {Helper.syncGetter('withUser.name', chat)}
                                    </SafeText>
                                    <SafeText style={styles.timeAgo}>{Helper.syncGetter('updated_at', chat)}</SafeText>
                                </Row>
                                <Row style={styles.itemContentBottom}>
                                    <SafeText style={styles.lastMessage} numberOfLines={1}>
                                        {Helper.syncGetter('lastMessage.message', chat)}
                                    </SafeText>
                                    <Badge count={chat.unreads} />
                                </Row>
                            </View>
                        </TouchableOpacity>
                    );
                })}
        </View>
    );
};

const styles = StyleSheet.create({
    itemContent: {
        flex: 1,
        marginLeft: PxDp(10),
    },
    itemContentBottom: {
        justifyContent: 'space-between',
        marginTop: PxDp(4),
    },
    itemContentTop: {
        justifyContent: 'space-between',
    },
    itemName: {
        color: Theme.defaultTextColor,
        fontSize: Font(15),
        fontWeight: 'bold',
    },
    lastMessage: {
        color: Theme.subTextColor,
        fontSize: Font(12),
        marginTop: PxDp(4),
        paddingRight: PxDp(20),
    },
    notifyItem: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: Theme.borderColor,
        borderBottomWidth: Theme.minimumPixel,
        flexDirection: 'row',
        padding: PxDp(Theme.itemSpace),
    },
    notifyType: {
        backgroundColor: '#fff',
        borderRadius: PxDp(6),
        margin: PxDp(10),
        overflow: 'hidden',
    },
    timeAgo: {
        color: Theme.subTextColor,
        fontSize: Font(12),
    },
});

export default Chats;
