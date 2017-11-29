const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')

// const extractSass = new ExtractTextPlugin({
//     filename: "[name].[contenthash].css",
//     disable: false //process.env.NODE_ENV === "development"
// });

module.exports = {
  context: path.join(__dirname, './client'),

  entry: {
    javascript: './index.jsx',
    // jsx: './index.jsx',
    // vendor: ['react', 'core-js']
  },

  output: {
    path: path.join(__dirname, './dist'),
    filename: 'app.js'
  },

  module: {
    // rules: [{
    //   test: /\.scss$/,
    //   use: extractSass.extract({
    //     use: [{
    //       loader: "css-loader"
    //     }, {
    //       loader: "sass-loader"
    //     }],
    //     fallback: "style-loader"
    //   })
    // }],
    loaders: [
      // {
      //   test: /\.html$/,
      //   exclude: /node_modules/,
      //   loader: 'file-loader?name=[name].[ext]'
      // },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: [
          'react-hot-loader',
          'babel-loader?presets[]=react,presets[]=es2015&presets[]=es2017&presets[]=stage-0'
        ],
      },
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, '/client/index.html'),
    }),
    // extractSass,
  ],

  // devServer: {
  //   contentBase: './client',
  //   hot: true
  // }
}
