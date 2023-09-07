'use strict'

module.exports = karma => karma.set({
  basePath: './src',
  frameworks: [
    'browserify',
    'source-map-support',
    'mocha'
  ],
  files: [
    'index.js',
    '!(analytics)**/**/*.js'
  ],
  plugins: [
    'karma-mocha',
    'karma-browserify',
    'karma-chrome-launcher',
    'karma-mocha-reporter',
    'karma-source-map-support'
  ],
  browserify: {
    debug: true, // Gets us source-maps, which in turn gets us human-readable error stacks in tests
    transform: [['babelify']]
  },
  preprocessors: {
    '**/*.js': [ 'browserify' ]
  },
  reporters: ['mocha'],
  browsers: ['ChromiumNoSandbox'],
  customLaunchers: {
    ChromiumNoSandbox: {
      base: 'ChromiumHeadless',
      flags: ['--no-sandbox']
    }
  },
  singleRun: true
})
