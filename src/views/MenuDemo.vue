<script setup lang="ts">
/**
 * Menu 组件演示页面
 * 展示菜单的各种功能和样式
 */
import { ref } from 'vue'
import { Home, Users, Settings, FileText, Folder, Database, BarChart, Bell, Menu as MenuIcon } from 'lucide-vue-next'
import { LMenu, LMenuItem, LSubMenu } from '@ldesign/menu-vue'

const selectedKey = ref('home')
const collapsed = ref(false)
const defaultOpenKeys = ['users', 'settings']

/**
 * 切换折叠状态
 */
function toggleCollapse() {
  collapsed.value = !collapsed.value
}
</script>

<template>
  <div class="menu-demo page-container">
    <h1 class="page-title">Menu 组件演示</h1>

    <div class="controls-card">
      <button @click="toggleCollapse" class="action-btn primary">
        <MenuIcon :size="16" />
        {{ collapsed ? '展开菜单' : '折叠菜单' }}
      </button>
      <span class="status">
        当前状态: <strong>{{ collapsed ? '折叠' : '展开' }}</strong>
      </span>
      <span class="status">
        选中项: <strong>{{ selectedKey }}</strong>
      </span>
    </div>

    <div class="demo-container">
      <!-- 侧边栏菜单 -->
      <div class="sidebar">
        <LMenu v-model:selectedKey="selectedKey" v-model:collapsed="collapsed" :default-open-keys="defaultOpenKeys"
          mode="vertical" theme="light" :collapsed-width="64" :expanded-width="240">
          <!-- 一级菜单项 -->
          <LMenuItem itemKey="home" label="首页" :icon="Home" />
          <LMenuItem itemKey="dashboard" label="仪表盘" :icon="BarChart" />

          <!-- 子菜单 -->
          <LSubMenu itemKey="users" label="用户管理" :icon="Users">
            <LMenuItem itemKey="user-list" label="用户列表" :icon="FileText" />
            <LMenuItem itemKey="user-roles" label="角色管理" :icon="Folder" />

            <!-- 多级子菜单 -->
            <LSubMenu itemKey="user-settings" label="用户设置" :icon="Settings">
              <LMenuItem itemKey="user-profile" label="个人资料" />
              <LMenuItem itemKey="user-security" label="安全设置" />
              <LMenuItem itemKey="user-privacy" label="隐私设置" />
            </LSubMenu>
          </LSubMenu>

          <LSubMenu itemKey="settings" label="系统设置" :icon="Settings">
            <LMenuItem itemKey="general" label="常规设置" />
            <LMenuItem itemKey="database" label="数据库配置" :icon="Database" />
            <LMenuItem itemKey="notifications" label="通知设置" :icon="Bell" />
          </LSubMenu>

          <LMenuItem itemKey="reports" label="报表中心" :icon="FileText" />
        </LMenu>
      </div>

      <!-- 内容区域 -->
      <div class="content">
        <div class="content-card">
          <h2 class="card-title">功能说明</h2>
          <ul class="feature-list">
            <li><strong>折叠模式</strong>：点击按钮切换菜单的折叠/展开状态</li>
            <li><strong>图标居中</strong>：折叠时只显示图标，图标水平居中</li>
            <li><strong>Tooltip 提示</strong>：鼠标悬停在折叠的菜单项上时，右侧显示完整文本</li>
            <li><strong>弹出式子菜单</strong>：折叠时，子菜单以浮层形式从右侧弹出</li>
            <li><strong>多级级联</strong>：支持多层嵌套的子菜单，每一层向右侧弹出</li>
            <li><strong>默认展开</strong>：通过 <code>defaultOpenKeys</code> 配置默认展开的子菜单</li>
            <li><strong>流畅动画</strong>：所有交互都有平滑的过渡动画</li>
          </ul>
        </div>

        <div class="content-card">
          <h2 class="card-title">使用的 CSS 变量</h2>
          <p>所有颜色和尺寸都使用了 <code>@ldesign/color</code> 和 <code>@ldesign/size</code> 包提供的 CSS 变量：</p>
          <ul class="feature-list">
            <li><strong>颜色</strong>: <code>--color-primary-default</code>, <code>--color-bg-component-hover</code>,
              <code>--color-text-primary</code> 等</li>
            <li><strong>尺寸</strong>: <code>--size-spacing-md</code>, <code>--size-4</code>,
              <code>--size-font-base</code> 等</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu-demo {
  padding: var(--size-space-lg);
  min-height: 100vh;
  background: var(--color-bg-page);
}

.page-title {
  margin: 0 0 var(--size-space-xl) 0;
  font-size: var(--size-font-2xl);
  color: var(--color-text-primary);
  font-weight: 600;
}

.controls-card {
  display: flex;
  align-items: center;
  gap: var(--size-space-lg);
  margin-bottom: var(--size-space-lg);
  padding: var(--size-space-md);
  background: var(--color-bg-container);
  border-radius: var(--size-radius-lg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-border-secondary);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--size-radius-md);
  cursor: pointer;
  font-size: var(--size-font-sm);
  transition: all 0.2s;
  border: none;
  font-weight: 500;
}

.action-btn.primary {
  background: var(--color-primary-500);
  color: white;
}

.action-btn.primary:hover {
  background: var(--color-primary-600);
}

.status {
  font-size: var(--size-font-sm);
  color: var(--color-text-secondary);
}

.status strong {
  color: var(--color-primary-500);
}

.demo-container {
  display: flex;
  gap: var(--size-space-lg);
  min-height: 600px;
}

.sidebar {
  flex-shrink: 0;
  background: var(--color-bg-container);
  border-radius: var(--size-radius-lg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid var(--color-border-secondary);
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--size-space-lg);
}

.content-card {
  padding: var(--size-space-lg);
  background: var(--color-bg-container);
  border-radius: var(--size-radius-lg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-border-secondary);
}

.card-title {
  margin: 0 0 var(--size-space-md) 0;
  font-size: var(--size-font-lg);
  color: var(--color-text-primary);
  font-weight: 600;
}

.feature-list {
  margin: 0;
  padding-left: 20px;
}

.feature-list li {
  margin-bottom: 8px;
  line-height: 1.6;
  color: var(--color-text-secondary);
}

.content-card code {
  padding: 2px 6px;
  background: var(--color-bg-page);
  border-radius: 4px;
  font-family: monospace;
  font-size: var(--size-font-xs);
  color: var(--color-primary-500);
  border: 1px solid var(--color-border);
}
</style>
