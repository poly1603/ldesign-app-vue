/**
 * Template 模板插件配置
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
          mobile: false,
        },
        disabledMessage: (device: DeviceType, category: string) =>
          `${category} 功能暂不支持在${device === 'mobile' ? '移动设备' : '平板设备'}上使用，请使用桌面浏览器访问`,
        disabledIcon: '🖥️',
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
      console.log('[App] 模板切换:', {
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
  })
}

