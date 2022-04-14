
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtactPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

let mode = 'development'
const isProd = process.env.NODE_ENV === 'production'
if (isProd) {
  mode = 'production';
}

let langs = ['en'];
let multipleHtmlPlugins = langs.map(lang => {
  return new HtmlWebpackPlugin({
    template: `./lang/${lang}/index.html`,
    filename: `${lang}/index.html`,
  })
});

module.exports = {
  mode: mode,
  entry: [
    './assets/index.js',
  ],
  output: {
    filename: '[name][contenthash].js',
    assetModuleFilename: 'assets/[hash][ext][query]',
    clean: true,
  },
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
    }
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "assets/images/content/*.avif",
        },
      ],
    }),
    new MiniCssExtactPlugin({
      filename: 'styles.[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ]
  .concat(multipleHtmlPlugins),
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          (!isProd) ? 'style-loader' : MiniCssExtactPlugin.loader,
          "css-loader",
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                  ]
                ]
              }
            }
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|avif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eof|tft|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.m?js$/i,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          }
        },
      }
    ],
  },
}