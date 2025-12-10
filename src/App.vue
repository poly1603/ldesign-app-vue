<script setup lang="ts">
/**
 * 应用根组件
 *
 * 使用 useTemplate 动态加载布局模板，支持用户手动切换布局
 * - 自动检测设备类型（desktop/tablet/mobile）
 * - 集成 TemplateSelector 组件，支持用户手动选择布局模板
 * - 与 Login.vue 使用相同的模板管理方式
 */
import { computed, markRaw, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ThemeColorPicker, ThemeModeSwitcher } from '@ldesign/color-vue'
import { LanguageSwitcher, useI18n } from '@ldesign/i18n-vue'
import type { MenuSelectEventParams } from '@ldesign/menu-vue'
import { LMenu, LMenuItem, LSubMenu } from '@ldesign/menu-vue'
import '@ldesign/menu-vue/styles'
import { SizeSwitcher } from '@ldesign/size-vue'
import { TemplateSwitcher, useTemplate } from '@ldesign/template-vue'
import { ChromeTabs, useRouteTabs } from '@ldesign/bookmark-vue'
import { LBreadcrumb } from '@ldesign/breadcrumb-vue'
import '@ldesign/breadcrumb-vue/styles'

// 导入 Lucide 图标组件
import {
  Archive,
  Bell,
  Database,
  FileText,
  Globe,
  Home,
  KeyRound, // 用于登录按钮图标
  LayoutDashboard as LayoutDashboardIcon,
  Lock,
  Package,
  Palette,
  Ruler,
  Smartphone,
} from 'lucide-vue-next'

/** 登录按钮图标组件 */
const LoginIcon = markRaw(KeyRound)

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

/**
 * 路由页签管理
 * 自动监听路由变化，管理页签的添加、删除、切换
 */
const {
  tabs,
  activeKey,
  refreshKey,
  switchTab,
  removeTab,
  closeOthers,
  closeLeft,
  closeRight,
  closeAll,
  refreshTab,
  togglePin,
} = useRouteTabs({
  router,
  homePath: '/',
  homeTitle: '首页',
  excludes: ['/login', '/404', '/403', '/500'],
})

/** 判断是否为全屏页面 */
const isFullscreenPage = computed(() => route.path === '/login')

/**
 * 使用 useTemplate 动态加载布局模板组件
 *
 * 简化模式：只传分类名 'layout'，自动检测设备类型
 * - 自动检测当前设备类型（desktop/tablet/mobile）
 * - 窗口大小变化时自动切换到对应设备的模板
 * - 优先使用缓存中的用户选择
 */
const {
  component: LayoutComponent,
  loading: layoutLoading,
  template: currentTemplateMeta,
  deviceType,
} = useTemplate('layout', {
  immediate: true,
  onChange: (info) => {
    console.log('[App] 模板切换:', info)
  },
})

/** 图标组件映射 */
const iconMap = {
  home: markRaw(Home),
  palette: markRaw(Palette),
  ruler: markRaw(Ruler),
  globe: markRaw(Globe),
  smartphone: markRaw(Smartphone),
  database: markRaw(Database),
  lock: markRaw(Lock),
  archive: markRaw(Archive),
  fileText: markRaw(FileText),
  bell: markRaw(Bell),
  layoutDashboard: markRaw(LayoutDashboardIcon),
  package: markRaw(Package),
}

/** 菜单项接口 */
interface AppMenuItem {
  key: string
  label: string
  icon?: string
  disabled?: boolean
  children?: AppMenuItem[]
}

/**
 * 侧边栏导航菜单数据
 * 支持多层级菜单结构
 */
const menuItems: AppMenuItem[] = [
  { key: '/', label: 'nav.home', icon: 'home' },
  {
    key: 'appearance',
    label: '外观设置',
    icon: 'palette',
    children: [
      { key: '/theme', label: '主题管理' },
      { key: '/size', label: '尺寸管理' },
    ],
  },
  {
    key: 'system',
    label: '系统功能',
    icon: 'smartphone',
    children: [
      { key: '/http', label: 'HTTP 请求' },
      { key: '/device', label: '设备信息' },
      { key: '/cache', label: '缓存管理' },
      { key: '/crypto', label: '加密功能' },
    ],
  },
  {
    key: 'data',
    label: '数据管理',
    icon: 'database',
    children: [
      { key: '/store', label: '状态管理' },
      { key: '/logger', label: '日志系统' },
      { key: '/notification', label: '通知系统' },
    ],
  },
  { key: '/layout', label: '布局系统', icon: 'layoutDashboard' },
  { key: '/breadcrumb', label: '面包屑组件', icon: 'fileText' },
]

/** 当前选中的菜单项 key */
const selectedMenuKey = computed(() => route.path)

/**
 * 根据路由路径查找父级菜单 key
 * @param path - 当前路由路径
 * @returns 父级菜单 key 数组
 */
function findParentKeys(path: string): string[] {
  const parentKeys: string[] = []

  for (const item of menuItems) {
    if (item.children) {
      const hasChild = item.children.some(child => child.key === path)
      if (hasChild) {
        parentKeys.push(item.key)
      }
    }
  }

  return parentKeys
}

/**
 * 根据当前路由生成面包屑数据
 * @param currentPath - 当前路由路径
 * @param currentRoute - 当前路由对象（用于获取 meta 信息）
 * @returns 面包屑项数组
 */
function buildBreadcrumbItems(currentPath: string, currentRoute: typeof route) {
  const items: Array<{ key: string, label: string, path?: string }> = []

  // 首页始终显示
  items.push({ key: '/', label: t('nav.home'), path: '/' })

  // 如果当前就是首页，直接返回
  if (currentPath === '/') {
    return items
  }

  // 查找当前路由对应的菜单项
  for (const item of menuItems) {
    if (item.children) {
      const child = item.children.find(c => c.key === currentPath)
      if (child) {
        // 添加父级菜单
        items.push({ key: item.key, label: getMenuLabel(item.label) })
        // 添加当前页
        items.push({ key: child.key, label: getMenuLabel(child.label), path: child.key })
        return items
      }
    }
    else if (item.key === currentPath) {
      // 一级菜单
      items.push({ key: item.key, label: getMenuLabel(item.label), path: item.key })
      return items
    }
  }

  // 如果没找到匹配的菜单，显示路由的 meta.title
  if (currentRoute.meta?.title) {
    items.push({ key: currentPath, label: String(currentRoute.meta.title), path: currentPath })
  }

  return items
}

/** 面包屑项列表（响应路由变化） */
const breadcrumbItems = ref(buildBreadcrumbItems(route.path, route))

// 监听路由变化更新面包屑
watch(
  () => route.path,
  (newPath) => {
    breadcrumbItems.value = buildBreadcrumbItems(newPath, route)
  },
  { immediate: true },
)

/**
 * 当前展开的菜单项 key 列表
 * 在组件创建时立即根据当前路由初始化展开状态
 */
const openKeys = ref<string[]>(findParentKeys(route.path))

/**
 * 监听路由变化，自动展开当前路由对应的父级菜单
 * 这确保了页面刷新后父菜单能正确展开
 */
watch(
  () => route.path,
  (newPath) => {
    const parentKeys = findParentKeys(newPath)
    // 合并新的父级 key，避免关闭用户手动展开的其他菜单
    for (const key of parentKeys) {
      if (!openKeys.value.includes(key)) {
        openKeys.value.push(key)
      }
    }
  },
  { immediate: true }
)

/**
 * 处理菜单选择事件
 */
function handleMenuSelect(params: MenuSelectEventParams) {
  router.push(params.key)
}

/**
 * 处理菜单展开/收起变化
 */
function handleOpenChange(keys: string[]) {
  openKeys.value = keys
}

/**
 * 获取菜单项显示文本
 */
function getMenuLabel(label: string): string {
  return label.startsWith('nav.') ? t(label) : label
}

/** 跳转到登录页 */
function goToLogin() {
  router.push('/login')
}

/**
 * 处理面包屑点击事件
 */
function handleBreadcrumbClick(item: { key: string, path?: string }) {
  if (item.path) {
    router.push(item.path)
  }
}
</script>

<template>
  <!-- 全屏页面（如登录页）直接渲染 -->
  <div v-if="isFullscreenPage" class="fullscreen-page">
    <router-view />
  </div>

  <!-- 布局加载中 -->
  <div v-else-if="layoutLoading" class="layout-loading">
    <span>加载布局中...</span>
  </div>

  <!-- 动态渲染布局模板组件 -->
  <component v-else-if="LayoutComponent" :is="LayoutComponent" :show-tabs="true" :show-footer="false"
    :category="'layout'" :device="deviceType">
    <!-- Logo 插槽 -->
    <template #logo="{ collapsed }">
      <div class="app-logo">
        <Palette class="logo-icon" :size="24" />
        <span v-if="!collapsed" class="logo-text">LDesign</span>
      </div>
    </template>

    <!-- 侧边栏菜单 - 使用 @ldesign/menu-vue 组件，深色主题 -->
    <template #sider="{ collapsed }">
      <LMenu theme="dark" :collapsed="collapsed" :selected-key="selectedMenuKey" :open-keys="openKeys"
        @select="handleMenuSelect" @open-change="handleOpenChange">
        <template v-for="item in menuItems" :key="item.key">
          <!-- 有子菜单的项 -->
          <LSubMenu v-if="item.children" :item-key="item.key" :label="getMenuLabel(item.label)">
            <template #icon>
              <component v-if="item.icon" :is="iconMap[item.icon as keyof typeof iconMap]" :size="20" />
            </template>
            <LMenuItem v-for="child in item.children" :key="child.key" :item-key="child.key" :disabled="child.disabled">
              {{ getMenuLabel(child.label) }}
            </LMenuItem>
          </LSubMenu>
          <!-- 无子菜单的项 -->
          <LMenuItem v-else :item-key="item.key" :disabled="item.disabled">
            <template #icon>
              <component v-if="item.icon" :is="iconMap[item.icon as keyof typeof iconMap]" :size="20" />
            </template>
            {{ getMenuLabel(item.label) }}
          </LMenuItem>
        </template>
      </LMenu>
    </template>

    <!-- 页签栏插槽 - 使用 @ldesign/bookmark-vue 的 ChromeTabs 组件 -->
    <template #tabs>
      <ChromeTabs :tabs="tabs" :active-key="activeKey" variant="chrome" @change="switchTab" @close="removeTab"
        @toggle-pin="togglePin" @refresh="refreshTab" @close-left="closeLeft" @close-right="closeRight"
        @close-others="closeOthers" @close-all="closeAll" />
    </template>

    <!-- 顶栏右侧操作区 -->
    <template #header-right>
      <div class="header-actions">
        <LanguageSwitcher />
        <ThemeColorPicker :translate="t" :locale="locale" />
        <ThemeModeSwitcher :translate="t" :locale="locale" />
        <SizeSwitcher :translate="t" :locale="locale" />
        <TemplateSwitcher category="layout" :translate="t" />

        <button class="login-btn" @click="goToLogin">
          <component :is="LoginIcon" :size="16" />
          {{ t('nav.login') }}
        </button>
      </div>
    </template>

    <!-- 主内容区 -->
    <template #default>
      <!-- 面包屑导航 -->
      <div class="page-breadcrumb">
        <LBreadcrumb :items="breadcrumbItems" separator="/" :show-home="false" @click="handleBreadcrumbClick" />
      </div>
      <!-- 页面内容 -->
      <router-view :key="`${route.fullPath}-${refreshKey}`" />
    </template>
  </component>
</template>

<style>
/* ==================== 全局重置 ==================== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ==================== Body 样式 ==================== */
body {
  font-family: var(--size-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif);
  line-height: var(--size-line-relaxed, 1.6);
  background: var(--color-gray-50, #f9fafb);
  color: var(--color-gray-900, #111827);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
}

.fullscreen-page {
  min-height: 100vh;
}

/* ==================== 布局加载状态 ==================== */
.layout-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: var(--size-space-m, 16px);
  color: var(--color-gray-500, #6b7280);
  font-size: var(--size-font-sm, 14px);
}

.layout-loading::before {
  content: '';
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-gray-200, #e5e7eb);
  border-top-color: var(--color-primary-500, #3b82f6);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ==================== Logo 样式 ==================== */
.app-logo {
  display: flex;
  align-items: center;
  gap: var(--size-space-s, 10px);
  padding: 0 var(--size-space-m, 16px);
  height: var(--size-15, 64px);
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* 侧边栏中的 Logo - 白色主题 */
.layout-sider .app-logo,
[class*="layout-sider"] .app-logo {
  color: #ffffff;
}

.layout-sider .app-logo .logo-icon,
[class*="layout-sider"] .app-logo .logo-icon {
  color: #ffffff;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.layout-sider .app-logo .logo-text,
[class*="layout-sider"] .app-logo .logo-text {
  color: #ffffff;
  background: none;
  -webkit-text-fill-color: #ffffff;
}

/* 头部中的 Logo - 保持原样式 */
.app-logo .logo-icon {
  flex-shrink: 0;
  color: var(--color-primary-500, #3b82f6);
  filter: drop-shadow(0 1px 2px rgba(59, 130, 246, 0.2));
}

.app-logo .logo-text {
  font-size: var(--size-font-lg, 1.25rem);
  white-space: nowrap;
  background: linear-gradient(135deg, var(--color-gray-900, #111827) 0%, var(--color-gray-600, #4b5563) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ==================== 头部操作区 ==================== */
.header-actions {
  display: flex;
  align-items: center;
  gap: var(--size-space-xs, 6px);
}

/* 统一的头部按钮样式 */
.header-actions .color-button,
.header-actions .mode-button,
.header-actions .size-button,
.header-actions .language-button,
.header-actions .template-button,
.header-actions button[class*="-button"] {
  width: 36px;
  height: 36px;
  border: none !important;
  background: transparent !important;
  border-radius: 8px;
  color: var(--color-gray-500, #6b7280);
  transition: all 0.15s ease;
}

.header-actions .color-button:hover,
.header-actions .mode-button:hover,
.header-actions .size-button:hover,
.header-actions .language-button:hover,
.header-actions .template-button:hover,
.header-actions button[class*="-button"]:hover {
  background: var(--color-gray-100, #f3f4f6) !important;
  color: var(--color-gray-700, #374151);
}

/* ==================== 登录按钮 ==================== */
.login-btn {
  display: flex;
  align-items: center;
  gap: var(--size-space-xs, 6px);
  padding: var(--size-space-xs, 8px) var(--size-space-m, 16px);
  background: linear-gradient(135deg, var(--color-primary-500, #3b82f6) 0%, var(--color-primary-600, #2563eb) 100%);
  color: #fff;
  border: none;
  border-radius: var(--size-radius-lg, 10px);
  font-size: var(--size-font-sm, 14px);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--size-duration-fast, 150ms) cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 1px 2px rgba(59, 130, 246, 0.2),
    0 1px 3px rgba(0, 0, 0, 0.1);
}

.login-btn:hover {
  background: linear-gradient(135deg, var(--color-primary-600, #2563eb) 0%, var(--color-primary-700, #1d4ed8) 100%);
  transform: translateY(-1px);
  box-shadow:
    0 4px 6px rgba(59, 130, 246, 0.25),
    0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-btn:active {
  transform: translateY(0);
}

/* ==================== 下拉动画 ==================== */
.dropdown-enter-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-leave-active {
  transition: all 0.15s cubic-bezier(0.4, 0, 1, 1);
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

/* ==================== 面包屑导航 ==================== */
.page-breadcrumb {
  padding: var(--size-space-s, 12px) var(--size-space-l, 20px);
  background: var(--color-bg-container, #ffffff);
  border-bottom: 1px solid var(--color-gray-100, #f3f4f6);
}

/* ==================== 暗色主题支持 ==================== */
[data-theme-mode="dark"],
[data-theme="dark"] {
  body {
    background: var(--color-gray-900, #111827);
    color: var(--color-gray-100, #f3f4f6);
  }

  .app-logo {
    color: var(--color-gray-100, #f3f4f6);
  }

  .app-logo .logo-text {
    background: linear-gradient(135deg, var(--color-gray-100, #f3f4f6) 0%, var(--color-gray-400, #9ca3af) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .page-breadcrumb {
    background: var(--color-gray-800, #1f2937);
    border-bottom-color: var(--color-gray-700, #374151);
  }

  /* 暗色模式头部按钮 */
  .header-actions .color-button:hover,
  .header-actions .mode-button:hover,
  .header-actions .size-button:hover,
  .header-actions .language-button:hover,
  .header-actions .template-button:hover,
  .header-actions button[class*="-button"]:hover {
    background: rgba(255, 255, 255, 0.1) !important;
    color: #ffffff;
  }
}

/* ==================== 侧边栏主题色背景 ==================== */
.layout-sider,
.l-layout__sider,
[class*="layout-sider"] {
  /* 使用主题色的深色渐变 */
  background: linear-gradient(180deg,
      color-mix(in srgb, var(--color-primary-900, #1e3a5f) 90%, #000) 0%,
      color-mix(in srgb, var(--color-primary-950, #0f172a) 95%, #000) 100%) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.06) !important;
  box-shadow:
    1px 0 0 rgba(255, 255, 255, 0.02),
    4px 0 16px rgba(0, 0, 0, 0.25) !important;
}

/* 侧边栏 Logo 区域 */
.layout-sider__logo {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

/* 菜单在侧边栏中的样式增强 */
.layout-sider .l-menu--dark,
.l-layout__sider .l-menu--dark {
  padding: 6px 8px;
}

.layout-sider .l-menu--dark .l-menu-item,
.layout-sider .l-menu--dark .l-submenu {
  margin-bottom: 2px;
}

.layout-sider .l-menu--dark .l-menu-item__content,
.layout-sider .l-menu--dark .l-submenu__title {
  border-radius: 6px;
  font-size: 14px;
  height: 40px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 菜单选中项高亮 - 使用主题色 */
.layout-sider .l-menu--dark .l-menu-item--selected .l-menu-item__content,
.layout-sider .l-menu--dark .l-submenu--active>.l-submenu__title {
  background: var(--color-primary-500, rgba(59, 130, 246, 0.25)) !important;
}

/* 菜单图标样式 - 统一粗细 */
.layout-sider .l-menu-item__icon,
.layout-sider .l-submenu__icon {
  opacity: 0.85;
  stroke-width: 1.5px;
}

.layout-sider .l-menu-item:hover .l-menu-item__icon,
.layout-sider .l-submenu:hover .l-submenu__icon,
.layout-sider .l-menu-item--selected .l-menu-item__icon {
  opacity: 1;
}

/* 折叠状态时图标居中 */
.layout-sider--collapsed .l-menu--dark .l-menu-item__content,
.layout-sider--collapsed .l-menu--dark .l-submenu__title {
  justify-content: center;
  padding: 0 !important;
}

.layout-sider--collapsed .l-menu-item__icon,
.layout-sider--collapsed .l-submenu__icon {
  margin: 0 !important;
}
</style>
