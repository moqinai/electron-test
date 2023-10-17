/*
 * @Description: 功能：
 * @Date: 2023-05-23 15:33:09
 * @LastEditTime: 2023-09-26 14:55:32
 */
// eslint-define-config可以帮助我们做语法提示
const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  // ESLint 一旦发现配置文件中有 "root": true，它就会停止在父级目录中寻找。
  root: true, // 指定脚本的运行环境。每种环境都有一组特定的预定义全局变量。
  env: {
    browser: true,
    es2021: true,
  }, // 启用的规则
  extends: ['plugin:vue/vue3-recommended', 'standard', 'plugin:prettier/recommended', './.eslintrc-auto-import.json'],
  parserOptions: {
    // js的版本
    ecmaVersion: 13, // 解析器
    parser: '@typescript-eslint/parser', // 模块化方案
    sourceType: 'module',
  }, // 引用的插件  下载的插件去掉eslint-plugin-前缀引入
  plugins: ['vue', '@typescript-eslint', 'prettier', 'import', 'node', 'promise', '@zonst/fed'], // 自定义规则
  rules: {
    '@zonst/fed/file-header-annotation': 0,
    'vue/multi-word-component-names': 0,
    '@typescript-eslint/no-unused-vars': 1,
  },
})
