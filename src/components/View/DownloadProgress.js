import React, { Component } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Modal } from 'react-native';
import * as Progress from 'react-native-progress';

type State = {
    isVisible: boolean,
    progress: number,
    message?: string,
};

class DownloadProgress extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            progress: 0,
            message: null,
        };
    }

    show(message) {
        this.setState({ isVisible: true, message });
    }

    progress(progress) {
        this.setState({ progress });
    }

    hide() {
        this.setState({ progress: 0, isVisible: false, message: '' });
    }

    render() {
        const { isVisible, progress, message } = this.state;
        console.log('render');

        const view = isVisible ? (
            <View style={styles.container}>
                <View style={styles.wrap}>
                    <View style={styles.progress}>
                        <Progress.Circle
                            size={46}
                            progress={progress / 100}
                            color="#fff"
                            borderColor="rgba(255,255,255,0)"
                            showsText
                        />
                        {message && <Text style={styles.message}>{message}</Text>}
                    </View>
                </View>
            </View>
        ) : null;
        return view;
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    wrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    progress: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 120,
        minHeight: 90,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 10,
    },
    message: {
        marginTop: 6,
        fontSize: 13,
        color: '#fff',
        textAlign: 'center',
    },
});

export default DownloadProgress;
