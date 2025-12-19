<script setup lang="ts">
/**
 * 布局系统演示页面
 *
 * 展示 @ldesign/template-vue 中的布局组件使用
 */
import { ref, h } from 'vue'
import {
  Palette,
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  Pin,
  Menu,
  User,
  Maximize,
  TrendingUp,
  TrendingDown,
  Folder,
  X,
  CreditCard,
  LogIn
} from 'lucide-vue-next'

interface TabItem {
  key: string
  title: string
  pinned?: boolean
}

// 布局模式选择
const layoutModes = ['admin', 'portal', 'dashboard', 'blank'] as const
const currentMode = ref<typeof layoutModes[number]>('admin')

// 侧边栏折叠状态（仅用于演示）
const siderCollapsed = ref(false)
const showTabs = ref(true)
const showFooter = ref(true)

// 模拟菜单数据
const menuItems = [
  { key: 'dashboard', label: '仪表盘', icon: h(LayoutDashboard) },
  { key: 'users', label: '用户管理', icon: h(Users) },
  { key: 'settings', label: '系统设置', icon: h(Settings) },
  { key: 'logs', label: '操作日志', icon: h(FileText) },
]

// 模拟标签页数据
const tabs = ref<TabItem[]>([
  { key: 'home', title: '首页', pinned: true },
  { key: 'users', title: '用户管理' },
  { key: 'settings', title: '系统设置' },
])
const activeTab = ref('home')

/** 切换布局模式 */
function switchMode(mode: typeof layoutModes[number]) {
  currentMode.value = mode
}

/** 切换侧边栏 */
function toggleSider() {
  siderCollapsed.value = !siderCollapsed.value
}

/** 处理标签切换 */
function handleTabChange(key: string) {
  activeTab.value = key
}

/** 处理标签关闭 */
function handleTabClose(key: string) {
  const index = tabs.value.findIndex(t => t.key === key)
  if (index > -1) {
    tabs.value.splice(index, 1)
    if (activeTab.value === key && tabs.value.length > 0) {
      activeTab.value = tabs.value[Math.max(0, index - 1)].key
    }
  }
}
</script>

<template>
  <div class="layout-demo page-container">
    <!-- 布局模式选择器 -->
    <div class="section-card">
      <h2 class="section-title">
        <Palette class="section-icon" />
        布局系统演示
      </h2>
      <p class="section-desc">选择布局模式查看不同布局效果：</p>
      <div class="mode-buttons">
        <button v-for="mode in layoutModes" :key="mode" :class="['mode-btn', { active: currentMode === mode }]"
          @click="switchMode(mode)">
          {{ mode }}
        </button>
      </div>
    </div>

    <!-- 布局预览区域 -->
    <div class="preview-card">
      <!-- Admin 布局 -->
      <div v-if="currentMode === 'admin'" class="preview-frame">
        <div class="admin-layout">
          <!-- 侧边栏 -->
          <aside class="admin-sider" :class="{ collapsed: siderCollapsed }">
            <div class="sider-logo">
              <Palette class="logo-icon" />
              <span v-if="!siderCollapsed">LDesign</span>
            </div>
            <nav class="sider-menu">
              <div v-for="item in menuItems" :key="item.key" class="menu-item">
                <component :is="item.icon" class="menu-icon" />
                <span v-if="!siderCollapsed" class="menu-text">{{ item.label }}</span>
              </div>
            </nav>
          </aside>

          <!-- 主区域 -->
          <div class="admin-main">
            <!-- 顶栏 -->
            <header class="admin-header">
              <button class="toggle-btn" @click="toggleSider">
                <Menu />
              </button>
              <span class="header-title">Admin Layout</span>
              <span class="header-user">
                <User class="inline-icon" />
                用户
              </span>
            </header>

            <!-- 标签栏 -->
            <div v-if="showTabs" class="admin-tabs">
              <div v-for="tab in tabs" :key="tab.key" :class="['tab-item', { active: activeTab === tab.key }]"
                @click="handleTabChange(tab.key)">
                <Pin v-if="tab.pinned" class="pin-icon" />
                {{ tab.title }}
                <X v-if="!tab.pinned" class="close-icon" @click.stop="handleTabClose(tab.key)" />
              </div>
            </div>

            <!-- 内容区 -->
            <main class="admin-content">
              <div class="content-card">
                <h3>内容区域</h3>
                <p>这是 Admin 布局的内容区域，包含侧边栏、顶栏、标签栏和页脚。</p>
                <div class="controls">
                  <label class="checkbox-label"><input v-model="showTabs" type="checkbox"> 显示标签栏</label>
                  <label class="checkbox-label"><input v-model="showFooter" type="checkbox"> 显示页脚</label>
                </div>
              </div>
            </main>

            <!-- 页脚 -->
            <footer v-if="showFooter" class="admin-footer">
              Copyright © 2024 LDesign
            </footer>
          </div>
        </div>
      </div>

      <!-- Portal 布局 -->
      <div v-else-if="currentMode === 'portal'" class="preview-frame">
        <div class="portal-layout">
          <header class="portal-header">
            <span class="portal-logo">
              <Palette class="inline-icon" />
              LDesign Portal
            </span>
            <nav class="portal-nav">
              <span>首页</span>
              <span>产品</span>
              <span>文档</span>
              <span>关于</span>
            </nav>
            <span class="portal-login">登录</span>
          </header>
          <main class="portal-content">
            <CreditCard class="large-icon" />
            <h3>Portal 门户布局</h3>
            <p>适合官网、博客、门户网站等顶部导航的场景。</p>
          </main>
          <footer class="portal-footer">
            © 2024 LDesign. All rights reserved.
          </footer>
        </div>
      </div>

      <!-- Dashboard 布局 -->
      <div v-else-if="currentMode === 'dashboard'" class="preview-frame">
        <div class="dashboard-layout">
          <header class="dashboard-header">
            <span class="flex-center">
              <LayoutDashboard class="inline-icon" />
              数据监控中心
            </span>
            <span>2024-01-01 12:00:00</span>
            <span class="flex-center">
              <Maximize class="inline-icon" />
              全屏
            </span>
          </header>
          <main class="dashboard-content">
            <div class="dashboard-grid">
              <div class="dashboard-card">
                <TrendingUp class="card-icon up" />
                图表 1
              </div>
              <div class="dashboard-card">
                <LayoutDashboard class="card-icon" />
                图表 2
              </div>
              <div class="dashboard-card">
                <TrendingDown class="card-icon down" />
                图表 3
              </div>
              <div class="dashboard-card">
                <Folder class="card-icon" />
                图表 4
              </div>
            </div>
          </main>
        </div>
      </div>

      <!-- Blank 布局 -->
      <div v-else-if="currentMode === 'blank'" class="preview-frame">
        <div class="blank-layout">
          <div class="blank-content">
            <h3>Blank 空白布局</h3>
            <p>无任何装饰的空白布局，适合登录页、错误页等。</p>
            <div class="login-card">
              <h4>
                <LogIn class="inline-icon" />
                登录
              </h4>
              <input type="text" placeholder="用户名" class="input">
              <input type="password" placeholder="密码" class="input">
              <button class="login-btn">登录</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-demo {
  padding: var(--size-space-lg);
  max-width: 1200px;
  margin: 0 auto;
}

.section-card {
  margin-bottom: var(--size-space-lg);
  padding: var(--size-space-lg);
  background: var(--color-bg-container);
  border-radius: var(--size-radius-lg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-border-secondary);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--size-space-sm);
  margin: 0 0 var(--size-space-sm);
  font-size: var(--size-font-lg);
  color: var(--color-text-primary);
  font-weight: 600;
}

.section-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary-500);
}

.section-desc {
  margin: 0 0 var(--size-space-md);
  color: var(--color-text-secondary);
  font-size: var(--size-font-sm);
}

.mode-buttons {
  display: flex;
  gap: var(--size-space-md);
}

.mode-btn {
  padding: 8px 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--size-radius-md);
  background: var(--color-bg-container);
  cursor: pointer;
  transition: all 0.2s;
  font-size: var(--size-font-sm);
  color: var(--color-text-primary);
  text-transform: capitalize;
}

.mode-btn:hover {
  border-color: var(--color-primary-500);
  color: var(--color-primary-500);
}

.mode-btn.active {
  background: var(--color-primary-500);
  border-color: var(--color-primary-500);
  color: white;
}

/* 预览框架 */
.preview-card {
  border: 1px solid var(--color-border);
  border-radius: var(--size-radius-lg);
  overflow: hidden;
  background: var(--color-bg-page);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.preview-frame {
  height: 600px;
  overflow: hidden;
}

/* ==================== Admin 布局 ==================== */
.admin-layout {
  display: flex;
  height: 100%;
  background: var(--color-bg-layout);
}

.admin-sider {
  width: 200px;
  background: #001529;
  color: #fff;
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.admin-sider.collapsed {
  width: 64px;
}

.sider-logo {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: bold;
  font-size: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  white-space: nowrap;
  overflow: hidden;
  color: #fff;
}

.logo-icon {
  width: 20px;
  height: 20px;
}

.sider-menu {
  flex: 1;
  padding: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
  color: rgba(255, 255, 255, 0.85);
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.collapsed .menu-item {
  justify-content: center;
}

.menu-icon {
  width: 16px;
  height: 16px;
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.admin-header {
  height: 48px;
  background: var(--color-bg-container);
  display: flex;
  align-items: center;
  padding: 0 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  gap: 16px;
  color: var(--color-text-primary);
}

.toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
}

.header-title {
  font-weight: 500;
}

.header-user {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
}

.admin-tabs {
  height: 36px;
  background: var(--color-bg-container);
  display: flex;
  align-items: center;
  padding: 0 8px;
  border-bottom: 1px solid var(--color-border);
  gap: 4px;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: var(--color-bg-page);
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.tab-item.active {
  background: var(--color-primary-50);
  color: var(--color-primary-600);
}

.pin-icon {
  width: 12px;
  height: 12px;
}

.close-icon {
  width: 14px;
  height: 14px;
  margin-left: 4px;
  opacity: 0.5;
}

.close-icon:hover {
  opacity: 1;
  color: var(--color-error-500);
}

.admin-content {
  flex: 1;
  padding: 16px;
  overflow: auto;
}

.content-card {
  background: var(--color-bg-container);
  padding: 24px;
  border-radius: 8px;
  color: var(--color-text-primary);
}

.content-card h3 {
  margin: 0 0 8px;
}

.content-card p {
  margin: 0 0 16px;
  color: var(--color-text-secondary);
}

.controls {
  display: flex;
  gap: 16px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: var(--color-text-primary);
}

.admin-footer {
  height: 40px;
  background: var(--color-bg-container);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  font-size: 13px;
  border-top: 1px solid var(--color-border);
}

/* ==================== Portal 布局 ==================== */
.portal-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-layout);
}

.portal-header {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-container);
  color: var(--color-text-primary);
}

.portal-logo {
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
}

.portal-nav {
  display: flex;
  gap: 32px;
}

.portal-nav span {
  cursor: pointer;
  color: var(--color-text-primary);
}

.portal-nav span:hover {
  color: var(--color-primary-500);
}

.portal-login {
  color: var(--color-primary-500);
  cursor: pointer;
}

.portal-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px;
}

.large-icon {
  width: 64px;
  height: 64px;
  color: var(--color-primary-200);
  margin-bottom: 24px;
}

.portal-content h3 {
  margin: 0 0 16px;
  font-size: 24px;
  color: var(--color-text-primary);
}

.portal-content p {
  margin: 0;
  color: var(--color-text-secondary);
}

.portal-footer {
  height: 48px;
  background: #001529;
  color: rgba(255, 255, 255, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}

/* ==================== Dashboard 布局 ==================== */
.dashboard-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #0d1117;
  color: #e6edf3;
}

.dashboard-header {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.dashboard-content {
  flex: 1;
  padding: 16px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  height: 100%;
}

.dashboard-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  gap: 16px;
}

.card-icon {
  width: 32px;
  height: 32px;
  opacity: 0.8;
}

.card-icon.up {
  color: #10b981;
}

.card-icon.down {
  color: #ef4444;
}

/* ==================== Blank 布局 ==================== */
.blank-layout {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-800) 100%);
}

.blank-content {
  text-align: center;
  color: #fff;
}

.blank-content h3 {
  margin: 0 0 8px;
  font-size: 24px;
}

.blank-content p {
  margin: 0 0 24px;
  opacity: 0.9;
}

.login-card {
  padding: 32px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  color: #333;
  min-width: 280px;
}

.login-card h4 {
  margin: 0 0 20px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.input {
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-sizing: border-box;
}

.login-btn {
  width: 100%;
  padding: 10px;
  background: var(--color-primary-500);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.login-btn:hover {
  background: var(--color-primary-600);
}

.flex-center {
  display: flex;
  align-items: center;
  gap: 8px;
}

.inline-icon {
  width: 16px;
  height: 16px;
}
</style>
