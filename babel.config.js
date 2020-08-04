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
					'@app': './',
					'~router': './src/router',
					'~screens': './src/screens',
					'~assets': './src/assets',
					'~apollo': './src/apollo',
					'~store': './src/store',
					'~utils': './src/utils',
					'~hooks': './src/hooks',
					'~gqls': './src/gqls',
					'~components': './src/components',
					'~theme': './src/theme',
				},
			},
		],
	],
};
