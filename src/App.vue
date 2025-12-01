<script setup lang="ts">
/**
 * 应用根组件
 *
 * 使用 useTemplate 动态加载布局模板，支持用户手动切换布局
 * - 自动检测设备类型（desktop/tablet/mobile）
 * - 集成 TemplateSelector 组件，支持用户手动选择布局模板
 * - 与 Login.vue 使用相同的模板管理方式
 */
import { computed, markRaw, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ThemeColorPicker, ThemeModeSwitcher } from '@ldesign/color-vue'
import { LanguageSwitcher, useI18n } from '@ldesign/i18n-vue'
import { SizeSwitcher } from '@ldesign/size-vue'
import { TemplateSelector, useTemplate } from '@ldesign/template-vue'

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

/** 菜单项类型定义 */
interface MenuItem {
  /** 路由路径 */
  path: string
  /** 菜单标签（支持 i18n key） */
  label: string
  /** Lucide 图标组件 */
  icon: ReturnType<typeof markRaw>
}

/**
 * 侧边栏导航菜单数据
 * 使用 markRaw 包装图标组件，避免 Vue 响应式系统追踪
 */
const menuItems: MenuItem[] = [
  { path: '/', label: 'nav.home', icon: markRaw(Home) },
  { path: '/theme', label: '主题管理', icon: markRaw(Palette) },
  { path: '/size', label: '尺寸管理', icon: markRaw(Ruler) },
  { path: '/http', label: 'HTTP 请求', icon: markRaw(Globe) },
  { path: '/device', label: '设备信息', icon: markRaw(Smartphone) },
  { path: '/cache', label: '缓存管理', icon: markRaw(Database) },
  { path: '/crypto', label: '加密功能', icon: markRaw(Lock) },
  { path: '/store', label: '状态管理', icon: markRaw(Archive) },
  { path: '/logger', label: '日志系统', icon: markRaw(FileText) },
  { path: '/notification', label: '通知系统', icon: markRaw(Bell) },
  { path: '/layout', label: '布局系统', icon: markRaw(LayoutDashboardIcon) },
  { path: '/dependencies', label: '依赖管理', icon: markRaw(Package) },
]

/** 跳转到登录页 */
function goToLogin() {
  router.push('/login')
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
  <component v-else-if="LayoutComponent" :is="LayoutComponent" :show-tabs="false" :show-footer="false"
    :category="'layout'" :device="deviceType">
    <!-- Logo 插槽 -->
    <template #logo="{ collapsed }">
      <div class="app-logo">
        <Palette class="logo-icon" :size="24" />
        <span v-if="!collapsed" class="logo-text">LDesign</span>
      </div>
    </template>

    <!-- 侧边栏菜单 -->
    <template #sider="{ collapsed }">
      <nav class="sider-menu">
        <router-link v-for="item in menuItems" :key="item.path" :to="item.path" class="menu-item"
          :title="collapsed ? (item.label.startsWith('nav.') ? t(item.label) : item.label) : undefined">
          <!-- 使用动态组件渲染 Lucide 图标 -->
          <component :is="item.icon" class="menu-icon" :size="20" />
          <span v-if="!collapsed" class="menu-label">
            {{ item.label.startsWith('nav.') ? t(item.label) : item.label }}
          </span>
        </router-link>
      </nav>
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
          <button class="template-btn" :class="{ active: showTemplateSelector }" title="选择布局模板"
            @click="toggleTemplateSelector">
            <component :is="TemplateIcon" :size="18" />
          </button>

          <!-- 模板选择器下拉面板 -->
          <Transition name="dropdown">
            <div v-if="showTemplateSelector" class="template-dropdown">
              <div class="dropdown-header">
                <span>选择布局模板</span>
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
      <router-view />
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

.sider-menu {
  display: flex;
  flex-direction: column;
  padding: 8px;
}

.sider-menu .menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--color-text-secondary, #6b7280);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
  margin-bottom: 4px;
}

.sider-menu .menu-item:hover {
  color: var(--color-primary-hover, #3b82f6);
  background: var(--color-bg-hover, #f3f4f6);
}

.sider-menu .menu-item.router-link-active {
  color: var(--color-primary, #3b82f6);
  background: var(--color-primary-bg, #eff6ff);
  font-weight: 500;
}

/* 菜单图标样式 - 适配 Lucide SVG 图标 */
.sider-menu .menu-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.sider-menu .menu-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
</style>
