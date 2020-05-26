let path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: './demo/main.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',
  mode: 'development',
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js']
  },

  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif|mp3|mp4)$/,
        use: [
          {
            loader:'file-loader',
            options: {
              limit: 10000,
              name:  'img/[name].[hash:7].[ext]'
            }
          }
        ],

      },
      {
        test: /\.ts$/,
        enforce: 'pre',
        use: [
          {
            loader: 'eslint-loader',
            options: { /* Loader options go here */ }
          }
        ]
      },
      {test: /\.map$/, enforce: 'pre', loader: 'source-map-loader'},
      {test: /\.tsx?$/, loader: 'ts-loader'}
    ]
  },
  plugins: [

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './demo/index.html'),
      filename:  'index.html',
    }),
    // 提供全局变量
    // new webpack.ProvidePlugin({
    //     join: ['lodash', 'join']
    // })
  ],
  // Other options...
};
