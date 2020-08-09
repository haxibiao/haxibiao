module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        [
            '@babel/plugin-proposal-decorators',
            {
                legacy: true,
            },
        ],
        'import-graphql',
        [
            'module-resolver',
            {
                root: ['./src'],
                alias: {
                    '!': './',
                    '~': './src',
                },
            },
        ],
    ],
};
