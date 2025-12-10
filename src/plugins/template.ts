/**
 * Template 模板插件配置
 * 
 * 支持的功能：
 * - 多模板预设切换和持久化
 * - 模板变化回调 (onTemplateChange)
 * - 初始化完成钩子 (onReady)
 * - 模板选择器配置 (selector)
 */
import { createTemplateEnginePlugin } from '@ldesign/template-vue/plugins'
import type { DeviceType, TemplateMetadata } from '@ldesign/template-vue'

/**
 * 创建模板插件
 */
export function createTemplatePlugin() {
  return createTemplateEnginePlugin({
    autoScan: true,
    debug: import.meta.env.DEV,

    // 分类模板配置
    categories: {
      login: {
        defaults: {
          desktop: 'default',
          tablet: 'default',
          mobile: 'default',
        },
      },
      dashboard: {
        defaults: {
          desktop: 'full',
          tablet: 'compact',
          mobile: 'minimal',
        },
      },
      layout: {
        defaults: {
          desktop: 'sidebar',
          tablet: 'sidebar',
          mobile: 'tab-bar',
        },
      },
    },

    // 模板选择器配置
    selector: {
      enabled: true,
      position: 'top-right',
      showPreview: true,
      showDescription: true,
      showTags: true,
      filter: (templates: TemplateMetadata[], _category: string, _device: DeviceType) => {
        return templates.filter(t => !t.tags?.includes('deprecated'))
      },
      props: {
        maxHeight: '400px',
      },
    },

    // 缓存配置
    cache: {
      enabled: true,
      storage: 'localStorage',
      keyPrefix: 'ldesign-app:template:',
      ttl: 7 * 24 * 60 * 60 * 1000,
      perUser: false,
    },

    // 设备断点配置
    breakpoints: {
      mobile: 768,
      tablet: 1024,
    },

    // 模板切换回调
    onTemplateChange: async (info) => {
      console.log('[Template Plugin] 模板切换:', {
        category: info.category,
        device: info.device,
        templateName: info.templateName,
        templateId: info.templateId,
        source: info.source,
      })

      // 示例: 将用户偏好保存到服务器
      // if (info.source === 'user') {
      //   await saveUserPreference({
      //     userId: userStore.userId,
      //     category: info.category,
      //     device: info.device,
      //     templateName: info.templateName,
      //   })
      // }
    },

    // 初始化完成回调
    onReady: (context) => {
      console.log('[Template Plugin] 初始化完成')
      console.log('[Template Plugin] 已注册模板数量:', context.getTemplateCount())
      console.log('[Template Plugin] layout 模板:', context.getTemplatesByCategory('layout').map(t => t.id))
      console.log('[Template Plugin] login 模板:', context.getTemplatesByCategory('login').map(t => t.id))

      // 示例: 从服务器加载用户模板偏好
      // const userPreferences = await api.getUserTemplatePreferences()
      // if (userPreferences?.layout) {
      //   // 应用用户保存的布局模板
      // }
    },
  })
}

