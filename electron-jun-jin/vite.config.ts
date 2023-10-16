/*
 * @Author: lipengcheng
 * @Date: 2023-10-16 14:41:52
 * @LastEditTime: 2023-10-16 17:37:55
 * @Description: 
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { devPlugin, getReplacer } from './plugins/devPlugin'
import optimizer from "vite-plugin-optimizer"

// const devPlugin = require('./plugins/devPlugin')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [optimizer(getReplacer()), devPlugin(), vue()],
})
