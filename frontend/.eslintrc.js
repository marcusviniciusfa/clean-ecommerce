module.exports = {
  env: {
    commonjs: true,
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:vue/vue3-essential',
  ],
  overrides: [],
  parserOptions: {
    // ecmaVersion: 'latest',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'prettier',
    'vue',
  ],
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'vue/multi-word-component-names': 'off',
  },
}
