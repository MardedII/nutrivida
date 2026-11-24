module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      { pattern: 'tests/karma.entry.js', watched: false }
    ],
    preprocessors: {
      'tests/karma.entry.js': ['webpack']
    },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: { browsers: ['last 2 Chrome versions'] } }],
                  ['@babel/preset-react', { runtime: 'automatic' }]
                ]
              }
            }
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          }
        ]
      },
      resolve: {
        extensions: ['.js', '.jsx']
      }
    },
    reporters: ['progress'],
    browsers: ['ChromeHeadless'],
    singleRun: true,
    browserNoActivityTimeout: 30000,
    client: {
      clearContext: false,
      jasmine: { random: false }
    },
    restartOnFileChange: false
  });
};
