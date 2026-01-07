<script setup lang="ts">
/**
 * 应用根组件
 *
 * 使用 useTemplate 动态加载布局模板，支持用户手动切换布局
 * - 自动检测设备类型（desktop/tablet/mobile）
 * - 集成 TemplateSelector 组件，支持用户手动选择布局模板
 * - 与 Login.vue 使用相同的模板管理方式
 * - 集成 LEAP 系统认证和菜单
 */
import { computed, markRaw, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ThemeColorPicker, ThemeModeSwitcher } from '@ldesign/color-vue'
import { LanguageSwitcher, useI18n } from '@ldesign/i18n-vue'
import { LMenu, LMenuItem, LSubMenu } from '@ldesign/menu-vue'
import '@ldesign/menu-vue/styles'
import { SizeSwitcher } from '@ldesign/size-vue'
import { TemplateSwitcher, useTemplate } from '@ldesign/template-vue'
import { ChromeTabs, useRouteTabs } from '@ldesign/bookmark-vue'
import { LBreadcrumb } from '@ldesign/breadcrumb-vue'
import '@ldesign/breadcrumb-vue/styles'
import { useNotification, LNotification, LToast, LMessage } from '@ldesign/notification-vue'
import LogoutModal from './components/LogoutModal.vue'

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
  LogOut, // 用于登出按钮图标
  Package,
  Palette,
  Ruler,
  Smartphone,
  User, // 用于用户头像图标
} from 'lucide-vue-next'

import { provideApiManager } from '@ldesign/api-vue'
import { servers, apis } from './api'
import httpClient from './api/http'
import { useAuth } from './composables/useAuth'

/** 登录按钮图标组件 */
const LoginIcon = markRaw(KeyRound)
/** 登出按钮图标组件 */
const LogoutIcon = markRaw(LogOut)
/** 用户图标组件 */
const UserIcon = markRaw(User)

// 认证状态管理
const auth = useAuth()
const notification = useNotification()

provideApiManager({
  servers,
  apis,
  httpClientFactory: async () => httpClient,
})

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
function handleMenuSelect(params: any) {
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

/** 退出登录确认弹窗状态 */
const showLogoutModal = ref(false)
const logoutLoading = ref(false)

/** 打开退出确认弹窗 */
function openLogoutModal() {
  showLogoutModal.value = true
}

/** 关闭退出确认弹窗 */
function closeLogoutModal() {
  showLogoutModal.value = false
}

/** 确认退出登录 */
async function confirmLogout() {
  logoutLoading.value = true
  try {
    await auth.logout()
    showLogoutModal.value = false
    router.push('/login')
  } catch (e) {
    console.error('[App] 退出登录失败:', e)
  } finally {
    logoutLoading.value = false
  }
}

/**
 * 页面加载时初始化认证状态
 * 如果已登录，获取用户信息和菜单
 * 如果获取失败（登录过期等），提示用户并跳转到登录页
 */
onMounted(async () => {
  if (!isFullscreenPage.value) {
    const result = await auth.initAuth()
    console.log('[App] 认证初始化完成:', result)

    // 如果登录已过期或获取用户信息失败，提示用户并跳转到登录页
    if (!result.success && result.message) {
      notification.warning('登录过期', {
        content: result.message,
        duration: 3000,
      })
      // 稍微延迟跳转，让用户看到提示
      setTimeout(() => {
        router.push('/login')
      }, 500)
    }
  }
})

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

    <!-- 侧边栏菜单 - 使用 @ldesign/menu-vue 组件，自动继承布局颜色 -->
    <template #sider="{ collapsed }">
      <LMenu :collapsed="collapsed" :selected-key="selectedMenuKey" :open-keys="openKeys"
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
      <ChromeTabs v-model:tabs="tabs" :active-key="activeKey" variant="chrome" @change="switchTab" @close="removeTab"
        @toggle-pin="togglePin" @refresh="refreshTab" @close-left="closeLeft" @close-right="closeRight"
        @close-others="closeOthers" @close-all="closeAll" />
    </template>

    <!-- 顶栏右侧操作区 -->
    <template #header-right="{ variant }">
      <div class="header-actions" :data-variant="variant">
        <LanguageSwitcher :variant="variant" />
        <ThemeColorPicker :variant="variant" :translate="t" :locale="locale" />
        <ThemeModeSwitcher :variant="variant" :translate="t" :locale="locale" />
        <SizeSwitcher :variant="variant" :translate="t" :locale="locale" />
        <TemplateSwitcher :variant="variant" category="layout" :translate="t" />

        <!-- 已登录时显示用户信息和登出按钮 -->
        <template v-if="auth.loggedIn.value">
          <div class="user-info">
            <component :is="UserIcon" :size="16" />
            <span class="username">{{ auth.displayName.value || '用户' }}</span>
          </div>
          <button class="logout-btn" @click="openLogoutModal">
            <component :is="LogoutIcon" :size="16" />
            退出
          </button>
        </template>

        <!-- 未登录时显示登录按钮 -->
        <button v-else class="login-btn" @click="goToLogin">
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

  <!-- 退出登录确认弹窗 -->
  <LogoutModal 
    :visible="showLogoutModal" 
    :loading="logoutLoading"
    @confirm="confirmLogout" 
    @cancel="closeLogoutModal" 
  />

  <!-- 全局通知组件容器 -->
  <LNotification />
  <LToast />
  <LMessage />
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

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--size-spacing-large);
}

/* 用户信息样式 */
.user-info {
  display: flex;
  align-items: center;
  gap: var(--size-space-xs, 4px);
  padding: var(--size-space-xs, 4px) var(--size-space-sm, 8px);
  border-radius: var(--size-radius-sm, 4px);
  background: var(--color-bg-container-secondary, #f5f5f5);
  color: var(--color-text-secondary, #666);
  font-size: var(--size-font-sm, 14px);
}

.user-info .username {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 登出按钮样式 */
.logout-btn {
  display: flex;
  align-items: center;
  gap: var(--size-space-xs, 4px);
  padding: var(--size-space-xs, 4px) var(--size-space-sm, 8px);
  border: 1px solid var(--color-border, #e0e0e0);
  border-radius: var(--size-radius-sm, 4px);
  background: var(--color-bg-container, #fff);
  color: var(--color-text-secondary, #666);
  font-size: var(--size-font-sm, 14px);
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  border-color: var(--color-error-500, #ef4444);
  color: var(--color-error-500, #ef4444);
  background: var(--color-error-50, #fef2f2);
}
</style>
