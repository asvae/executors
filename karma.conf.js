// Karma configuration
var webpackConfig = require('./src/build/webpack-config-test')

module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    client: {
      captureConsole: true,
    },

    frameworks: ['jasmine', 'requirejs'],

    reporters: [
      // 'progress',
      // 'coverage',
      'dots',
    ],

    // list of files / patterns to load in the browser
    files: [
      'src/build/test-main.js',
      'src/**/*.spec.js',
    ],

    // list of files to exclude
    exclude: [],

    // Preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.spec.js': [
        'webpack',
        // 'coverage',
      ],
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true,
      stats: 'errors-only',
    },

    coverageReporter: {
      type: 'html',
      dir: 'coverage/',
    },

    karmaTypescriptConfig: {
      compilerOptions: {
        allowJs: true,
      },
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
  })
}
