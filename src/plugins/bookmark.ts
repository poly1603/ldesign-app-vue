/**
 * 书签插件配置
 * @module plugins/bookmark
 *
 * 已升级为标准引擎插件模式，通过 definePlugin 封装
 */
import { definePlugin } from '@ldesign/engine-vue3'
import { BookmarkPlugin } from '@ldesign/bookmark-vue'

/**
 * 创建书签引擎插件
 */
export function createBookmarkPlugin() {
  return definePlugin({
    name: 'bookmark',
    version: '1.0.0',

    async install(context) {
      const { app } = context as any
      if (!app) return

      app.use(BookmarkPlugin, {
        prefix: 'L',
      })

      if (import.meta.env.DEV) {
        console.log('[Bookmark Plugin] 书签插件已安装')
      }
    },
  })
}

