var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: [
		'babel-polyfill',
		'./src/index'
	],
	output: {
		path: path.join(__dirname, '..', 'dist', 'client', 'static'),
		filename: 'bundle.js',
		publicPath: '/static/'
	},
	plugins: [
		// moment is a dependency to joi-browser and includes alot of locales not needed
		new webpack.IgnorePlugin(/locale/, /moment$/),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				warnings: false
			}
		})
	],
	resolve: {
		alias: {
			'joi': 'joi-browser'
		}
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loaders: ['babel'],
				include: [
					path.join(__dirname, '..', 'client'),
					path.join(__dirname, '..', 'validators')
				]
			},
			{ test: /\.css$/, loader: 'style-loader!css-loader' },
			{ test: /\.png$/, loader: 'url-loader?limit=100000' },
			{ test: /\.jpg$/, loader: 'file-loader' },
			{ test: /\.json$/, loader: 'json-loader' }
		]
	},
	node: {
		net: 'empty',
		tls: 'empty',
		dns: 'empty'
	}
};
