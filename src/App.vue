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
        <ThemeColorPicker :translate="t" />
        <ThemeModeSwitcher :translate="t" />
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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--size-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
  line-height: var(--size-line-relaxed, 1.6);
  background: var(--color-bg-page, #f5f7fa);
  color: var(--color-text-primary, #1f2937);
}

#app {
  min-height: 100vh;
}

.fullscreen-page {
  min-height: 100vh;
}

/* 布局加载中状态 */
.layout-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: var(--color-text-secondary, #6b7280);
  font-size: var(--size-font-sm, 14px);
}

.app-logo {
  display: flex;
  align-items: center;
  gap: var(--size-space-xs, 0.5rem);
  padding: 0 var(--size-space-md, 16px);
  height: var(--size-size-15, 64px);
  font-weight: var(--size-font-weight-bold, 700);
  color: var(--color-text-primary, #2c3e50);
}

/* Lucide 图标样式 */
.app-logo .logo-icon {
  flex-shrink: 0;
  color: var(--color-primary, #3b82f6);
}

.app-logo .logo-text {
  font-size: var(--size-font-lg, 1.25rem);
  white-space: nowrap;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--size-space-md, 1rem);
}

.login-btn {
  display: flex;
  align-items: center;
  gap: var(--size-space-xs, 0.5rem);
  padding: var(--size-comp-paddingTB-xs, 8px) var(--size-comp-paddingLR-l, 16px);
  background: var(--color-primary, #3b82f6);
  color: #fff;
  border: none;
  border-radius: var(--size-radius-md, 6px);
  font-size: var(--size-font-sm, 14px);
  font-weight: var(--size-font-weight-medium, 500);
  cursor: pointer;
  transition: all var(--size-duration-fast, 0.2s);
}

.login-btn:hover {
  background: var(--color-primary-hover, #2563eb);
}

/* 下拉面板动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all var(--size-duration-fast, 0.2s) ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(calc(-1 * var(--size-space-xs, 8px)));
}

/* 面包屑导航样式 */
.page-breadcrumb {
  padding: var(--size-space-s, 12px) var(--size-space-md, 16px);
  background: var(--color-bg-container, #fff);
  border-bottom: var(--size-border-width-thin, 1px) solid var(--color-border, #e5e7eb);
  margin-bottom: 0;
}
</style>
