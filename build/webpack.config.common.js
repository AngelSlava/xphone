const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const libraryName = 'XPhone';

module.exports = {
  entry: './src/Stack.js',
  plugins: [
    new CleanWebpackPlugin(['dist'])
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
          },
        },
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: `${libraryName.toLowerCase()}.js`,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
    libraryExport: 'default',
  },
};
