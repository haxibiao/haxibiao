/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
    resolver: {
        assetExts: ['graphql', 'gql', 'json', 'png', 'jpg', 'gif', 'ttf', 'svg'],
        sourceExts: ['ts', 'tsx', 'js', 'jsx', 'json', 'svg', 'graphql', 'gql'],
    },
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: false,
            },
        }),
    },
};
