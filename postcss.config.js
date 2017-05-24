module.exports = {
  plugins: [
    /* eslint-disable global-require */
    require('autoprefixer')(),
    require('postcss-class-prefix')('crowdsorcerer-'),
    /* eslint-enable global-require */
  ],
};
