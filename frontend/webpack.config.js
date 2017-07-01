var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require("path");

module.exports = {
  devServer: {
	  port: 1337,
	  watch: true,
          contentBase: './dist'
  },
  
  entry: {
	  'main': './src/app.js'
  },
  output: {
    path: path.resolve(__dirname, ""),
	publicPath: "",
    filename: 'dist/static/js/[name].js',
    chunkFilename: '[id].chunk.js'
  },
  module: {
     loaders: [
    {
      test: /\.js?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel', 
      query: {
    
      }
    }
  ]
  },
  plugins: [
      new CopyWebpackPlugin([
      { from: './src/static', to: './dist/static' },
      { from: './src/index.html', to: './dist' },
      ])
  ],
  resolve: {
    alias: {
         "jquery": path.join(__dirname, "./jquery-stub.js")
    }
  }
}
