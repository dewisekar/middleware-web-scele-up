module.exports = {
  extends: 'airbnb-base',
  env: {
    node: true
  },
  globals: {
    describe: true,
    it: true,
    true: true
  },
  rules: {
    'no-underscore-dangle': 0,
    'comma-dangle': ['error', 'never'],
    'class-methods-use-this': 'off',
    'linebreak-style': 0,
    'no-console': 'off'
  }
};
