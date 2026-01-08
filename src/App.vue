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
import { LMenu } from '@ldesign/menu-vue'
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

/** 图标组件映射 - 使用 markRaw 避免响应式警告 */
const HomeIcon = markRaw(Home)
const PaletteIcon = markRaw(Palette)
const RulerIcon = markRaw(Ruler)
const GlobeIcon = markRaw(Globe)
const SmartphoneIcon = markRaw(Smartphone)
const DatabaseIcon = markRaw(Database)
const LockIcon = markRaw(Lock)
const ArchiveIcon = markRaw(Archive)
const FileTextIcon = markRaw(FileText)
const BellIcon = markRaw(Bell)
const LayoutDashboardIconComp = markRaw(LayoutDashboardIcon)
const PackageIcon = markRaw(Package)

const iconComponents: Record<string, any> = {
  home: HomeIcon,
  palette: PaletteIcon,
  ruler: RulerIcon,
  globe: GlobeIcon,
  smartphone: SmartphoneIcon,
  database: DatabaseIcon,
  lock: LockIcon,
  archive: ArchiveIcon,
  fileText: FileTextIcon,
  bell: BellIcon,
  layoutDashboard: LayoutDashboardIconComp,
  package: PackageIcon,
}

/**
 * 根据图标名称获取组件
 * 支持 Lucide 图标名称或 iconComponents 中的 key
 */
function getIconComponent(iconName?: string): any {
  if (!iconName) return undefined
  // 尝试从映射中获取
  return iconComponents[iconName] || iconComponents[iconName.toLowerCase()] || undefined
}

/**
 * LMenu 菜单项接口
 * 符合 @ldesign/menu-vue 的 MenuItem 结构
 * 扩展 meta 字段用于存储路由注册所需信息
 */
interface LMenuItemData {
  key: string
  label: string
  type?: 'item' | 'submenu' | 'group' | 'divider'
  icon?: any
  disabled?: boolean
  children?: LMenuItemData[]
  /** 扩展元数据，用于路由注册 */
  meta?: {
    /** 菜单 ID */
    id?: string
    /** 路由名称 (PascalCase) */
    name?: string
    /** Vue 组件路径 */
    component?: string
    /** 组件名称 */
    componentName?: string
    /** 资源类型 */
    resourceType?: string
    /** 自定义配置 */
    props?: Record<string, unknown>
  }
}

/**
 * 本地默认菜单 - 工作空间功能展示
 * 未登录或 API 菜单为空时使用
 */
const defaultMenuItems: LMenuItemData[] = [
  { key: '/', label: '首页', icon: HomeIcon, type: 'item' },
  {
    key: 'appearance',
    label: '外观设置',
    icon: PaletteIcon,
    type: 'submenu',
    children: [
      { key: '/theme', label: '主题管理', type: 'item' },
      { key: '/size', label: '尺寸管理', type: 'item' },
    ],
  },
  {
    key: 'system',
    label: '系统功能',
    icon: SmartphoneIcon,
    type: 'submenu',
    children: [
      { key: '/http', label: 'HTTP 请求', type: 'item' },
      { key: '/device', label: '设备信息', type: 'item' },
      { key: '/cache', label: '缓存管理', type: 'item' },
      { key: '/crypto', label: '加密功能', type: 'item' },
      { key: '/logger', label: '日志系统', type: 'item' },
      { key: '/store', label: '状态管理', type: 'item' },
    ],
  },
  {
    key: 'components',
    label: '组件展示',
    icon: PackageIcon,
    type: 'submenu',
    children: [
      { key: '/menu', label: '菜单组件', type: 'item' },
      { key: '/breadcrumb', label: '面包屑组件', type: 'item' },
      { key: '/bookmark', label: '书签组件', type: 'item' },
      { key: '/notification', label: '通知组件', type: 'item' },
    ],
  },
  { key: '/leap', label: 'LEAP 接口', icon: GlobeIcon, type: 'item' },
]

/**
 * 将 API 返回的菜单数据转换为 LMenu 需要的格式
 */
function transformApiMenuToLMenu(apiMenus: any[]): LMenuItemData[] {
  if (!apiMenus || apiMenus.length === 0) return []
  
  return apiMenus.map(item => {
    const hasChildren = item.children && item.children.length > 0
    
    const menuItem: LMenuItemData = {
      key: item.path || item.id || '',
      label: item.title || item.name || '',
      type: hasChildren ? 'submenu' : 'item',
      icon: getIconComponent(item.icon),
      meta: {
        id: item.id,
        name: item.name,
        component: item.component,
        componentName: item.componentName,
        resourceType: item.resourceType,
        props: item.meta?.props,
      },
    }
    
    if (hasChildren) {
      menuItem.children = transformApiMenuToLMenu(item.children)
    }
    
    return menuItem
  })
}

/**
 * 菜单数据
 * - 已登录且有 API 菜单：使用 API 菜单
 * - 否则：使用本地默认菜单
 */
const menuItems = computed<LMenuItemData[]>(() => {
  if (auth.loggedIn.value && auth.menuList.value && auth.menuList.value.length > 0) {
    return transformApiMenuToLMenu(auth.menuList.value as any[])
  }
  return defaultMenuItems
})

/** 当前选中的菜单项 key */
const selectedMenuKey = computed(() => route.path)

/**
 * 根据路由路径查找父级菜单 key
 * @param path - 当前路由路径
 * @returns 父级菜单 key 数组
 */
function findParentKeys(path: string): string[] {
  const parentKeys: string[] = []

  for (const item of menuItems.value) {
    if (item.children) {
      const hasChild = item.children.some(child => child.key === path)
      if (hasChild && item.key) {
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
  for (const item of menuItems.value) {
    if (item.children) {
      const child = item.children.find(c => c.key === currentPath)
      if (child) {
        // 添加父级菜单
        items.push({ key: item.key, label: item.label })
        // 添加当前页
        items.push({ key: child.key, label: child.label, path: child.key })
        return items
      }
    }
    else if (item.key === currentPath) {
      // 一级菜单
      items.push({ key: item.key, label: item.label, path: item.key })
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
 * Mix 布局 - 当前选中的一级菜单 key
 * 用于在 Mix 布局中展示对应的子菜单
 */
const selectedRootKey = ref<string>('')

/**
 * Mix 布局 / DualColumn 布局 - 处理顶部一级菜单点击
 */
function handleRootSelect(params: { key: string }) {
  const key = params.key
  selectedRootKey.value = key
  // 如果是路由项（以 / 开头），直接导航
  if (key.startsWith('/')) {
    router.push(key)
  }
}

/**
 * 根据当前路由自动设置选中的一级菜单
 */
function updateSelectedRootKey() {
  const path = route.path
  // 查找当前路由属于哪个一级菜单
  for (const item of menuItems.value) {
    if (item.key === path) {
      selectedRootKey.value = item.key
      return
    }
    if (item.children) {
      if (item.children.some(child => child.key === path)) {
        selectedRootKey.value = item.key
        return
      }
    }
  }
}

// 监听路由变化更新选中的一级菜单
watch(() => route.path, updateSelectedRootKey, { immediate: true })

/**
 * 判断当前模板类型
 * 用于根据不同模板渲染不同的菜单配置
 */
const templateType = computed(() => {
  const name = currentTemplateMeta.value?.name || ''
  console.log('[App] 当前模板名称:', name)
  if (name.includes('mix')) return 'mix'
  if (name.includes('top-menu')) return 'top-menu'
  if (name.includes('dual-column')) return 'dual-column'
  return 'sidebar' // 默认侧边栏模式
})


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

    <!-- ============ 顶部横向菜单 (top-menu 布局) ============ -->
    <template #menu>
      <LMenu
        v-if="templateType === 'top-menu'"
        mode="horizontal"
        :items="menuItems"
        :selected-key="selectedMenuKey"
        :open-keys="openKeys"
        :inherit-color="true"
        @select="handleMenuSelect"
        @open-change="handleOpenChange"
      />
    </template>

    <!-- ============ Mix 布局顶部一级菜单 ============ -->
    <template #top-menu>
      <LMenu
        v-if="templateType === 'mix'"
        mode="horizontal"
        render-mode="rootOnly"
        :items="menuItems"
        :selected-key="selectedRootKey"
        :inherit-color="true"
        @select="handleRootSelect"
      />
    </template>

    <!-- ============ 图标栏 (dual-column 布局) ============ -->
    <template #icon-bar>
      <LMenu
        v-if="templateType === 'dual-column'"
        mode="vertical"
        render-mode="rootOnly"
        :items="menuItems"
        :selected-key="selectedRootKey"
        :collapsed="true"
        :collapsed-width="60"
        :inherit-color="true"
        @select="handleRootSelect"
      />
    </template>

    <!-- ============ 侧边栏菜单 ============ -->
    <template #sider="{ collapsed }">
      <LMenu
        v-if="menuItems.length > 0"
        :items="menuItems"
        :collapsed="collapsed"
        :selected-key="selectedMenuKey"
        :open-keys="collapsed ? [] : openKeys"
        :expand-mode="collapsed ? 'popup' : 'inline'"
        :inherit-color="false"
        theme="dark"
        @select="handleMenuSelect"
        @open-change="handleOpenChange"
      />
    </template>

    <!-- ============ 移动端抽屉菜单 ============ -->
    <template #drawer>
      <LMenu
        :items="menuItems"
        :selected-key="selectedMenuKey"
        :open-keys="openKeys"
        theme="dark"
        @select="handleMenuSelect"
        @open-change="handleOpenChange"
      />
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

/* ==================== Logo 样式 ==================== */
.app-logo {
  display: flex;
  align-items: center;
  gap: var(--size-space-sm, 8px);
  color: inherit;
  text-decoration: none;
}

.app-logo .logo-icon {
  flex-shrink: 0;
}

.app-logo .logo-text {
  font-size: var(--size-font-lg, 18px);
  font-weight: 600;
  white-space: nowrap;
}

/* ==================== 登录按钮样式 ==================== */
.login-btn {
  display: flex;
  align-items: center;
  gap: var(--size-space-xs, 4px);
  padding: var(--size-space-xs, 4px) var(--size-space-sm, 8px);
  border: 1px solid var(--color-primary-500, #3b82f6);
  border-radius: var(--size-radius-sm, 4px);
  background: var(--color-primary-500, #3b82f6);
  color: #fff;
  font-size: var(--size-font-sm, 14px);
  cursor: pointer;
  transition: all 0.2s ease;
}

.login-btn:hover {
  background: var(--color-primary-600, #2563eb);
  border-color: var(--color-primary-600, #2563eb);
}

/* ==================== 面包屑样式 ==================== */
.page-breadcrumb {
  padding: var(--size-space-md, 12px) var(--size-space-lg, 16px);
  margin-bottom: var(--size-space-md, 12px);
}

/* ==================== 布局加载中 ==================== */
.layout-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: var(--size-font-lg, 18px);
  color: var(--color-text-secondary, #666);
}

/* ==================== 全屏页面 ==================== */
.fullscreen-page {
  min-height: 100vh;
}
</style>
