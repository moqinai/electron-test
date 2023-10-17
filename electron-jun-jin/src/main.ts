/*
 * @Author: lipengcheng
 * @Date: 2023-10-17 11:06:31
 * @LastEditTime: 2023-10-17 16:34:22
 * @Description: 
 */
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import '@/assets/scss/base.scss'
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { ElCollapseTransition } from 'element-plus'

const app = createApp(App)
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//   app.component(key, component)
// }
app.component(ElCollapseTransition.name, ElCollapseTransition)

// createApp(App).mount('#app')

app.mount('#app')
