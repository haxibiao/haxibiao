import React, { useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeText } from '@src/components';
import { useNavigation } from '@src/router';

interface Props {
    comment: object;
}

const ReplyComments = (props: Props) => {
    const navigation = useNavigation();
    const { comment } = props;
    const replies = Helper.syncGetter('comments.data', comment);

    const CommentsView = useMemo(() => {
        if (replies && replies.length > 0) {
            return replies.map(item => {
                return (
                    <Text style={styles.text} key={item.id}>
                        <Text>{Helper.syncGetter('user.name', item)} : </Text>
                        <SafeText style={styles.bodyText}>{item.body}</SafeText>
                    </Text>
                );
            });
        } else {
            return null;
        }
    }, [replies]);
    if (CommentsView) {
        return (
            <TouchableOpacity
                style={{ marginTop: PxDp(10) }}
                activeOpacity={1}
                onPress={() => navigation.navigate('Comment', { comment })}>
                <View style={styles.container}>
                    {CommentsView}
                    {comment.count_replies > 3 && <Text style={styles.linkText}>共{comment.count_replies}条评论</Text>}
                </View>
            </TouchableOpacity>
        );
    } else {
        return null;
    }
};

const styles = StyleSheet.create({
    bodyText: {
        color: '#393939',
    },
    container: {
        backgroundColor: '#F8F9FB',
        borderRadius: PxDp(5),
        flex: 1,
        paddingHorizontal: PxDp(10),
        paddingVertical: PxDp(8),
    },
    linkText: {
        color: Theme.link,
        fontSize: PxDp(13),
        lineHeight: PxDp(20),
    },
    text: {
        color: Theme.subTextColor,
        fontSize: PxDp(13),
        lineHeight: PxDp(20),
    },
});

export default ReplyComments;
