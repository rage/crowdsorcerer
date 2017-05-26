module.exports = {
  plugins: [
    /* eslint-disable global-require */
    require('autoprefixer')(),
    require('postcss-class-prefix')('crowdsorcerer-', { ignore: [/cm/, /CodeMirror/] }),
    /* eslint-enable global-require */
  ],
};
