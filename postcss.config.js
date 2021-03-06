module.exports = {
  plugins: [
    /* eslint-disable global-require */
    require('autoprefixer')(),
    require('postcss-class-prefix')('crowdsorcerer-',
      { ignore: [/cm/, /CodeMirror/, /likert-react/, 'modelsolution-lines', /react-tags/, 'is-active', 'is-disabled'],
      }),
    /* eslint-enable global-require */
  ],
};
