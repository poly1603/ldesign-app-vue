<script setup lang="ts">
/**
 * 应用根组件
 *
 * 使用 useTemplate 动态加载布局模板，支持用户手动切换布局
 * - 自动检测设备类型（desktop/tablet/mobile）
 * - 集成 TemplateSelector 组件，支持用户手动选择布局模板
 * - 与 Login.vue 使用相同的模板管理方式
 */
import { computed, markRaw, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ThemeColorPicker, ThemeModeSwitcher } from '@ldesign/color-vue'
import { LanguageSwitcher, useI18n } from '@ldesign/i18n-vue'
import type { MenuSelectEventParams } from '@ldesign/menu-vue'
import { LMenu, LMenuItem, LSubMenu } from '@ldesign/menu-vue'
import '@ldesign/menu-vue/styles'
import { SizeSwitcher } from '@ldesign/size-vue'
import { TemplateSelector, useTemplate } from '@ldesign/template-vue'
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
  LayoutTemplate, // 用于模板选择器图标
  Lock,
  Package,
  Palette,
  Ruler,
  Smartphone,
} from 'lucide-vue-next'

/** 登录按钮图标组件 */
const LoginIcon = markRaw(KeyRound)
/** 模板选择器图标组件 */
const TemplateIcon = markRaw(LayoutTemplate)

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

/** 是否显示模板选择器面板 */
const showTemplateSelector = ref(false)

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
  load: loadTemplate,
  template: currentTemplateMeta,
  deviceType,
} = useTemplate('layout', {
  immediate: true,
  onChange: (info) => {
    console.log('[App] 模板切换:', info)
  },
})

/** 获取当前模板 ID（用于选择器高亮） */
const currentTemplateId = computed(() => currentTemplateMeta.value?.id)

/**
 * 处理用户手动选择模板
 * 使用 'user' 来源标记，这样会写入缓存
 */
function handleTemplateChange(templateId: string): void {
  loadTemplate(templateId, 'user')
  showTemplateSelector.value = false
}

/** 切换模板选择器显示状态 */
function toggleTemplateSelector(): void {
  showTemplateSelector.value = !showTemplateSelector.value
}

/**
 * 处理点击外部关闭模板选择器
 * 使用事件委托方式监听文档点击
 */
function handleDocumentClick(event: MouseEvent): void {
  const target = event.target as HTMLElement
  // 如果点击的不是模板选择器区域，则关闭
  if (!target.closest('.template-selector-wrapper')) {
    showTemplateSelector.value = false
  }
}

// 监听文档点击事件（关闭模板选择器）
onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
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
  { key: '/dependencies', label: '依赖管理', icon: 'package' },
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
 * @returns 面包屑项数组
 */
function buildBreadcrumbItems(currentPath: string) {
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
  if (route.meta?.title) {
    items.push({ key: currentPath, label: String(route.meta.title), path: currentPath })
  }

  return items
}

/** 面包屑项列表（响应路由变化） */
const breadcrumbItems = ref(buildBreadcrumbItems(route.path))

// 监听路由变化更新面包屑
watch(
  () => route.path,
  (newPath) => {
    breadcrumbItems.value = buildBreadcrumbItems(newPath)
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

        <!-- 模板选择器触发按钮 -->
        <div class="template-selector-wrapper">
          <button class="template-btn" :class="{ active: showTemplateSelector }" :title="t('template.selectLayout')"
            @click="toggleTemplateSelector">
            <component :is="TemplateIcon" :size="18" />
          </button>

          <!-- 模板选择器下拉面板 -->
          <Transition name="dropdown">
            <div v-if="showTemplateSelector" class="template-dropdown">
              <div class="dropdown-header">
                <span>{{ t('template.selectLayout') }}</span>
                <button class="close-btn" @click="showTemplateSelector = false">×</button>
              </div>
              <div class="dropdown-content">
                <TemplateSelector category="layout" :model-value="currentTemplateId" :show-preview="false"
                  :show-description="true" @update:model-value="handleTemplateChange" />
              </div>
            </div>
          </Transition>
        </div>

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
        <LBreadcrumb
          :items="breadcrumbItems"
          separator="/"
          :show-home="false"
          @click="handleBreadcrumbClick"
        />
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
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
  font-size: 14px;
}

.app-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 16px;
  height: 64px;
  font-weight: 700;
  color: var(--color-text-primary, #2c3e50);
}

/* Lucide 图标样式 */
.app-logo .logo-icon {
  flex-shrink: 0;
  color: var(--color-primary, #3b82f6);
}

.app-logo .logo-text {
  font-size: 1.25rem;
  white-space: nowrap;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.login-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 8px 16px;
  background: var(--color-primary, #3b82f6);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.login-btn:hover {
  background: var(--color-primary-hover, #2563eb);
}

/* 模板选择器样式 */
.template-selector-wrapper {
  position: relative;
}

.template-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  background: transparent;
  color: var(--color-text-secondary, #6b7280);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.template-btn:hover {
  color: var(--color-primary, #3b82f6);
  border-color: var(--color-primary, #3b82f6);
  background: var(--color-primary-bg, #eff6ff);
}

.template-btn.active {
  color: var(--color-primary, #3b82f6);
  border-color: var(--color-primary, #3b82f6);
  background: var(--color-primary-bg, #eff6ff);
}

.template-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 320px;
  background: var(--color-bg-container, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
}

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  font-weight: 500;
  color: var(--color-text-primary, #1f2937);
}

.dropdown-header .close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  color: var(--color-text-tertiary, #9ca3af);
  cursor: pointer;
  transition: all 0.2s;
}

.dropdown-header .close-btn:hover {
  background: var(--color-bg-hover, #f3f4f6);
  color: var(--color-text-secondary, #6b7280);
}

.dropdown-content {
  padding: 12px;
  max-height: 400px;
  overflow-y: auto;
}

/* 模板选择器容器 */
.template-selector-wrapper {
  position: relative;
}

/* 下拉面板动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* 面包屑导航样式 */
.page-breadcrumb {
  padding: 12px 16px;
  background: var(--color-bg-container, #fff);
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  margin-bottom: 0;
}
</style>
