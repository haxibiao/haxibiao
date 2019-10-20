/*
 * @flow
 * created by wyk made in 2019-05-10 22:42:25
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { KeyboardSpacer } from '@src/components';
import Modal from 'react-native-modal';
import CommentInput from './CommentInput';

class InputModal extends Component {
    render() {
        const {
            visible,
            hideModal,
            onCommented,
            comment_id,
            commentableId,
            reply,
            switchReplyType,
            parent_comment_id,
        } = this.props;
        return (
            <Modal
                isVisible={visible}
                onBackdropPress={hideModal}
                backdropOpacity={0}
                style={{ justifyContent: 'flex-end', width: Device.WIDTH, margin: 0 }}
                onShow={() => {
                    this.textInput.focus();
                }}
                onDismiss={switchReplyType}>
                <View>
                    <CommentInput
                        commentableId={commentableId}
                        onCommented={onCommented}
                        comment_id={comment_id}
                        parent_comment_id={parent_comment_id}
                        textInputRef={input => {
                            this.textInput = input;
                        }}
                        reply={reply}
                        hideModal={hideModal}
                        switchReplyType={switchReplyType}
                    />
                    {Device.IOS && <KeyboardSpacer />}
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({});

export default InputModal;
