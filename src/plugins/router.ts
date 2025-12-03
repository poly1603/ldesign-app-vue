/**
 * 路由插件配置
 */
import { createRouterEnginePlugin } from '@ldesign/router-vue/plugins'
import { routes } from '../router'

/**
 * 创建路由插件
 */
export function createRouterPlugin() {
  return createRouterEnginePlugin({
    routes,
    mode: 'hash',
  })
}

