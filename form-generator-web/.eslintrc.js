module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [],
  rules: {
    'indent': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 7,
    sourceType: 'module'
  },
  globals: {
    location: false
  }
};
