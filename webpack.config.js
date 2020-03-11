const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');


const isDev = process.env.NODE_ENV === 'development'; // определяем в каком режиме сборки мы находимся (если 'development', то значение равно true, если продакшн, то false)
// console.log( 'IS DEV', isDev );
const isProd = !isDev;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsPlugin(),
      new TerserWebpackPlugin(),
    ];
  }

  return config;
};

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

const cssLoaders = (extra) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev, // можем изменять сущности без перезагрузки страницы
        reloadAll: true,
      },
    },
    'css-loader',
  ];

  if (extra) {
    loaders.push(extra);
  }

  return loaders;
};

const babelOptions = (preset) => {
  const options = {
    presets: [
      '@babel/preset-env',
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
    ],
  };

  if (preset) {
    options.presets.push(preset);
  }

  return options;
};

const jsLoaders = () => {
  const loaders = [{
    loader: 'babel-loader',
    options: babelOptions(),
  }];

  if (isDev) {
    loaders.push('eslint-loader');
  }

  return loaders;
};

const plugins = () => {
  const base = [
    new HTMLWebpackPlugin({
      // 'title': 'Webpack Borovik', если есть template, то параметр title не работает
      template: './index.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    /*new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'src/favicon.ico'),
        to: path.resolve(__dirname, 'dist'),
      },
    ]),*/
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
  ];

  if (isProd) {
    base.push(new BundleAnalyzerPlugin());
  }

  return base;
};


module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: ['@babel/polyfill', './js/index.js'],
    // main: ['@babel/polyfill', './index.jsx'],
    // analytics: './analytics.js',
    // analytics: './analytics.ts',
  },
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.json', '.png'],
    alias: {
      // ключи для установки абсолютного пути (например в импортах)
      '@models': path.resolve(__dirname, 'src/models'),
      '@': path.resolve(__dirname, 'src'),
    }, // массив с расширениями файлов, которые webpack должен понимать "по умолчанию". То есть в импортах можно не писать эти расширения файлов
  },
  optimization: optimization(),
  devServer: {
    port: 4200,
    hot: isDev,
  },
  devtool: isDev ? 'source-map' : '', // исходные карты
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.css$/, // если webpack встречает файлы с этими расширениями, то
        use: cssLoaders(), // позволит нам выносить css в отдельный файл
        // use: ['style-loader', 'css-loader'], // он начинает использовать определенный тип лоадеров (пропускает справа на лево, то есть сначала через 'css-loader', потом через 'style-loader'
      },
      {
        test: /\.less$/, // если webpack встречает файлы с этими расширениями, то
        use: cssLoaders('less-loader'), // позволит нам выносить css в отдельный файл
        // use: ['style-loader', 'css-loader'], // он начинает использовать определенный тип лоадеров (пропускает справа на лево, то есть сначала через 'css-loader', потом через 'style-loader'
      },
      {
        test: /\.s[ac]ss$/, // если webpack встречает файлы с этими расширениями, то
        use: cssLoaders('sass-loader'), // позволит нам выносить css в отдельный файл
        // use: ['style-loader', 'css-loader'], // он начинает использовать определенный тип лоадеров (пропускает справа на лево, то есть сначала через 'css-loader', потом через 'style-loader'
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader'],
      },
      {
        test: /\.xml$/,
        use: ['xml-loader'],
      },
      {
        test: /\.csv$/,
        use: ['csv-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-typescript'),
        },
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-react'),
        },
      },
    ],
  },
};
