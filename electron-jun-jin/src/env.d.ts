/*
 * @Author: lipengcheng
 * @Date: 2023-10-17 15:33:26
 * @LastEditTime: 2023-10-17 16:24:51
 * @Description: 
 */
// declare module '*.vue' {
//   import { ComponentOptions } from 'vue'
//   const componentOptions: ComponentOptions
//   export default componentOptions
// }
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
