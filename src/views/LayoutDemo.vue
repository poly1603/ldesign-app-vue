<script setup lang="ts">
/**
 * 布局系统演示页面
 *
 * 展示 @ldesign/template-vue 中的布局模板使用
 */
import { ref, computed } from 'vue'
import {
  TemplateRenderer,
  useLayout,
  LayoutHeader,
  LayoutSider,
  LayoutContent,
  LayoutFooter,
  LayoutTabs,
  type TabItem,
} from '@ldesign/template-vue'

// 布局模式选择
const layoutModes = ['admin', 'portal', 'dashboard', 'blank'] as const
const currentMode = ref<typeof layoutModes[number]>('admin')

// 使用布局状态管理
const {
  siderCollapsed,
  toggleSider,
  showTabs,
  showFooter,
  isMobile,
} = useLayout()

// 模拟菜单数据
const menuItems = [
  { key: 'dashboard', label: '📊 仪表盘', path: '/dashboard' },
  { key: 'users', label: '👥 用户管理', path: '/users' },
  { key: 'settings', label: '⚙️ 系统设置', path: '/settings' },
  { key: 'logs', label: '📝 操作日志', path: '/logs' },
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
  <div class="layout-demo">
    <!-- 布局模式选择器 -->
    <div class="mode-selector">
      <h2>🎨 布局系统演示</h2>
      <p>选择布局模式：</p>
      <div class="mode-buttons">
        <button v-for="mode in layoutModes" :key="mode" :class="['mode-btn', { active: currentMode === mode }]"
          @click="switchMode(mode)">
          {{ mode }}
        </button>
      </div>
      <p class="tip">当前设备: {{ isMobile ? '移动端' : '桌面端' }}</p>
    </div>

    <!-- 布局预览区域 -->
    <div class="layout-preview">
      <!-- Admin 布局 -->
      <div v-if="currentMode === 'admin'" class="preview-container">
        <div class="admin-preview">
          <LayoutSider :collapsed="siderCollapsed" :width="200" :collapsed-width="64" class="preview-sider">
            <template #logo>
              <div class="logo">{{ siderCollapsed ? '🎨' : '🎨 LDesign' }}</div>
            </template>
            <div class="menu">
              <div v-for="item in menuItems" :key="item.key" class="menu-item">
                {{ siderCollapsed ? item.label.slice(0, 2) : item.label }}
              </div>
            </div>
          </LayoutSider>

          <div class="preview-main" :style="{ marginLeft: siderCollapsed ? '64px' : '200px' }">
            <LayoutHeader :height="48" @toggle-sider="toggleSider">
              <template #menuButton>
                <span class="menu-icon">☰</span>
              </template>
              <template #left>
                <span>Admin Layout</span>
              </template>
              <template #right>
                <span>👤 用户</span>
              </template>
            </LayoutHeader>

            <LayoutTabs v-if="showTabs" :tabs="tabs" :active-key="activeTab" :height="36" style="margin-top: 48px;"
              @change="handleTabChange" @close="handleTabClose" />

            <LayoutContent :padding="16" :style="{ marginTop: showTabs ? '84px' : '48px' }">
              <div class="content-area">
                <h3>内容区域</h3>
                <p>这是 Admin 布局的内容区域，包含侧边栏、顶栏、标签栏和页脚。</p>
                <div class="controls">
                  <label>
                    <input v-model="showTabs" type="checkbox">
                    显示标签栏
                  </label>
                  <label>
                    <input v-model="showFooter" type="checkbox">
                    显示页脚
                  </label>
                </div>
              </div>
            </LayoutContent>

            <LayoutFooter v-if="showFooter" :height="40">
              <span>Copyright © 2024 LDesign</span>
            </LayoutFooter>
          </div>
        </div>
      </div>

      <!-- Portal 布局 -->
      <div v-else-if="currentMode === 'portal'" class="preview-container">
        <div class="portal-preview">
          <LayoutHeader :height="56" class="portal-header">
            <template #left>
              <span class="portal-logo">🎨 LDesign Portal</span>
            </template>
            <template #center>
              <nav class="portal-nav">
                <span>首页</span>
                <span>产品</span>
                <span>文档</span>
                <span>关于</span>
              </nav>
            </template>
            <template #right>
              <span>登录</span>
            </template>
          </LayoutHeader>
          <LayoutContent :padding="24" style="margin-top: 56px; min-height: 300px;">
            <div class="portal-content">
              <h3>Portal 门户布局</h3>
              <p>适合官网、博客、门户网站等顶部导航的场景。</p>
            </div>
          </LayoutContent>
          <LayoutFooter :height="48" class="portal-footer">
            <span>© 2024 LDesign. All rights reserved.</span>
          </LayoutFooter>
        </div>
      </div>

      <!-- Dashboard 布局 -->
      <div v-else-if="currentMode === 'dashboard'" class="preview-container">
        <div class="dashboard-preview">
          <LayoutHeader :height="48" :shadow="false" class="dashboard-header">
            <template #left>
              <span>📊 数据监控中心</span>
            </template>
            <template #center>
              <span>2024-01-01 12:00:00</span>
            </template>
            <template #right>
              <span>⛶ 全屏</span>
            </template>
          </LayoutHeader>
          <LayoutContent :padding="16" style="margin-top: 48px;" class="dashboard-content">
            <div class="dashboard-grid">
              <div class="dashboard-card">图表 1</div>
              <div class="dashboard-card">图表 2</div>
              <div class="dashboard-card">图表 3</div>
              <div class="dashboard-card">图表 4</div>
            </div>
          </LayoutContent>
        </div>
      </div>

      <!-- Blank 布局 -->
      <div v-else-if="currentMode === 'blank'" class="preview-container">
        <div class="blank-preview">
          <div class="blank-content">
            <h3>Blank 空白布局</h3>
            <p>无任何装饰的空白布局，适合登录页、错误页等。</p>
            <div class="login-card">
              <h4>登录</h4>
              <input type="text" placeholder="用户名">
              <input type="password" placeholder="密码">
              <button>登录</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-demo {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.mode-selector {
  margin-bottom: 24px;
  padding: 16px;
  background: var(--color-bg-container, #fff);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.mode-selector h2 {
  margin-bottom: 8px;
}

.mode-buttons {
  display: flex;
  gap: 8px;
  margin: 12px 0;
}

.mode-btn {
  padding: 8px 16px;
  border: 1px solid var(--color-border, #d9d9d9);
  border-radius: 4px;
  background: var(--color-bg-container, #fff);
  cursor: pointer;
  transition: all 0.2s;
}

.mode-btn:hover {
  border-color: var(--color-primary, #1890ff);
  color: var(--color-primary, #1890ff);
}

.mode-btn.active {
  background: var(--color-primary, #1890ff);
  border-color: var(--color-primary, #1890ff);
  color: #fff;
}

.tip {
  font-size: 12px;
  color: var(--color-text-secondary, #999);
}

.layout-preview {
  border: 1px solid var(--color-border, #d9d9d9);
  border-radius: 8px;
  overflow: hidden;
  min-height: 500px;
  background: var(--color-bg-page, #f0f2f5);
}

.preview-container {
  height: 100%;
  min-height: 500px;
}

/* Admin 布局样式 */
.admin-preview {
  display: flex;
  height: 100%;
  min-height: 500px;
  position: relative;
}

.preview-sider {
  position: absolute !important;
  left: 0;
  top: 0;
  bottom: 0;
}

.preview-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s;
}

.logo {
  padding: 16px;
  color: #fff;
  font-weight: bold;
  text-align: center;
}

.menu {
  padding: 8px;
}

.menu-item {
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 4px;
  transition: background 0.2s;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.menu-icon {
  font-size: 18px;
  cursor: pointer;
}

.content-area {
  background: var(--color-bg-container, #fff);
  padding: 24px;
  border-radius: 8px;
  min-height: 200px;
}

.controls {
  margin-top: 16px;
  display: flex;
  gap: 16px;
}

.controls label {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

/* Portal 布局样式 */
.portal-preview {
  min-height: 500px;
  display: flex;
  flex-direction: column;
}

.portal-header {
  background: var(--color-bg-container, #fff) !important;
}

.portal-logo {
  font-size: 18px;
  font-weight: bold;
}

.portal-nav {
  display: flex;
  gap: 24px;
}

.portal-nav span {
  cursor: pointer;
}

.portal-nav span:hover {
  color: var(--color-primary, #1890ff);
}

.portal-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 48px 0;
}

.portal-footer {
  background: #001529 !important;
  color: rgba(255, 255, 255, 0.65) !important;
  margin-top: auto;
}

/* Dashboard 布局样式 */
.dashboard-preview {
  min-height: 500px;
  background: #0d1117;
  color: #e6edf3;
}

.dashboard-header {
  background: transparent !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #e6edf3 !important;
}

.dashboard-content {
  background: transparent !important;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.dashboard-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 24px;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Blank 布局样式 */
.blank-preview {
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.blank-content {
  text-align: center;
  color: #fff;
}

.login-card {
  margin-top: 24px;
  padding: 32px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  color: #333;
  min-width: 300px;
}

.login-card h4 {
  margin-bottom: 16px;
}

.login-card input {
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

.login-card button {
  width: 100%;
  padding: 10px;
  background: var(--color-primary, #1890ff);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
