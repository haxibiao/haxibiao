import React from 'react';
import { View, Text, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { PxDp } from '!/src/utils';

export default function ArticleBodyView(props: { body: string }) {
    const [webHeight, setwebHeight] = React.useState(0);
    const { body } = props;
    const scalesPageToFit = Platform.OS === 'android';

    return (
        <WebView
            style={{ width: '100%', height: webHeight }}
            // textZoom={100}
            source={{
                html: `
                <!DOCTYPE html>
                <html>
                    <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
                        <style type="text/css">
                        html,
                        body {
                            font-size: large;
                            margin: 0;
                            padding: 0;
                        }

                        img {
                            border-radius: 6px;
                            max-width: 100%;
                        }

                        video {
                            width: 100%;
                        }

                        a {
                            pointer-events: none;
                        }

                        </style>
                        
                    </head>
                    <body>
                        ${body || ''}
                    </body>

                </html>
                `,
            }}
            overScrollMode={'never'}
            scrollEnabled={false}
            directionalLockEnabled={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            originWhitelist={['*']}
            scalesPageToFit={scalesPageToFit}
            bounces={false}
            injectedJavaScript={'window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight)'}
            onMessage={(event: any) => {
                let h = Number(event.nativeEvent.data);
                // console.log('文章内容原高度', h);
                setwebHeight(h);
                // console.log('文章内容高度', h);
            }}
        />
    );
}
