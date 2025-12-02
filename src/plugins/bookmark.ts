/**
 * 书签插件配置
 * @module plugins/bookmark
 */

import type { App } from 'vue'
import { BookmarkPlugin } from '@ldesign/bookmark-vue'

/**
 * 安装书签插件
 * @param app - Vue 应用实例
 */
export function setupBookmark(app: App): void {
  app.use(BookmarkPlugin, {
    prefix: 'L',
  })
}

export default setupBookmark

