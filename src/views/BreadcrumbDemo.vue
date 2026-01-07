<script setup lang="ts">
/**
 * 面包屑组件演示页面
 * 展示 @ldesign/breadcrumb-vue 的各种功能和用法
 */
import { ref, computed, markRaw } from 'vue'
import { useRoute } from 'vue-router'
import type { BreadcrumbItem } from '@ldesign/breadcrumb-vue'
import {
  LBreadcrumb,
  useBreadcrumbRoute,
} from '@ldesign/breadcrumb-vue'
import '@ldesign/breadcrumb-vue/styles'
import { Home, ChevronRight, MoreHorizontal, Settings, List, Map } from 'lucide-vue-next'

const route = useRoute()

// 基础面包屑数据
const basicItems = ref<BreadcrumbItem[]>([
  { key: 'home', label: '首页', path: '/', icon: markRaw(Home) },
  { key: 'system', label: '系统管理', path: '/system' },
  { key: 'user', label: '用户管理', path: '/system/user' },
])

// 带下拉菜单的面包屑
const itemsWithDropdown = ref<BreadcrumbItem[]>([
  { key: 'home', label: '首页', path: '/', icon: markRaw(Home) },
  {
    key: 'products',
    label: '产品中心',
    path: '/products',
    children: [
      { key: 'software', label: '软件产品', path: '/products/software' },
      { key: 'hardware', label: '硬件产品', path: '/products/hardware' },
      { key: 'service', label: '服务产品', path: '/products/service' },
    ],
  },
  { key: 'detail', label: '产品详情', path: '/products/detail' },
])

// 可折叠的面包屑（很长的路径）
const longPathItems = ref<BreadcrumbItem[]>([
  { key: 'home', label: '首页', path: '/' },
  { key: 'level1', label: '一级目录', path: '/level1' },
  { key: 'level2', label: '二级目录', path: '/level1/level2' },
  { key: 'level3', label: '三级目录', path: '/level1/level2/level3' },
  { key: 'level4', label: '四级目录', path: '/level1/level2/level3/level4' },
  { key: 'current', label: '当前页面', path: '/level1/level2/level3/level4/current' },
])

// 配置选项
const separator = ref<'/' | '>' | '•'>('/')
const size = ref<'small' | 'medium' | 'large'>('medium')
const maxItems = ref(0)
const showHome = ref(true)
const lastItemClickable = ref(false)

// 基于当前路由生成的面包屑
const { items: routeItems } = useBreadcrumbRoute({
  route,
  includeHome: true,
  homeItem: { label: '首页', icon: markRaw(Home) },
})

/**
 * 处理面包屑项点击
 */
function handleClick(item: BreadcrumbItem, index: number, event: MouseEvent) {
  console.log('点击面包屑项:', { item, index })
  // 实际应用中这里可以进行路由跳转
  // router.push(item.path)
}

/**
 * 处理下拉菜单选择
 */
function handleDropdownSelect(parentItem: BreadcrumbItem, selectedItem: any, event: MouseEvent) {
  console.log('选择下拉菜单项:', { parentItem, selectedItem })
}
</script>

<template>
  <div class="breadcrumb-demo page-container">
    <div class="page-header section-card">
      <div class="header-content">
        <div class="header-icon">
          <Map class="icon-hero" />
        </div>
        <div>
          <h1 class="page-title">面包屑组件</h1>
          <p class="page-desc">
            提供功能丰富的面包屑导航组件，支持路由自动生成、下拉菜单、折叠显示等特性。
          </p>
        </div>
      </div>
    </div>

    <!-- 基础用法 -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">
          <List class="section-icon" />
          基础用法
        </h2>
        <p class="section-desc">最基础的面包屑用法，支持自定义分隔符和大小。</p>
      </div>
      
      <div class="control-group mb-md">
        <div class="control-item">
          <span class="label">分隔符:</span>
          <select v-model="separator" class="select-input">
            <option value="/">/</option>
            <option value=">">&gt;</option>
            <option value="•">•</option>
          </select>
        </div>
        <div class="control-item">
          <span class="label">大小:</span>
          <select v-model="size" class="select-input">
            <option value="small">小</option>
            <option value="medium">中</option>
            <option value="large">大</option>
          </select>
        </div>
      </div>

      <div class="demo-block">
        <LBreadcrumb :items="basicItems" :separator="separator" :size="size" :show-home="false" @click="handleClick" />
      </div>
    </div>

    <!-- 带下拉菜单 -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">
          <List class="section-icon" />
          带下拉菜单
        </h2>
        <p class="section-desc">支持在面包屑项上显示下拉菜单，方便快速导航到子页面。</p>
      </div>
      <div class="demo-block">
        <LBreadcrumb :items="itemsWithDropdown" :show-home="false" @click="handleClick"
          @dropdown-select="handleDropdownSelect" />
      </div>
    </div>

    <!-- 自动折叠 -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">
          <MoreHorizontal class="section-icon" />
          自动折叠
        </h2>
        <p class="section-desc">当路径层级过深时，可以自动折叠中间项，点击省略号可展开。</p>
      </div>
      
      <div class="control-group mb-md">
        <div class="control-item">
          <span class="label">最大显示项数:</span>
          <input type="number" v-model.number="maxItems" min="0" max="10" class="number-input" />
        </div>
      </div>

      <div class="demo-block">
        <LBreadcrumb :items="longPathItems" :max-items="4" :items-before-collapse="1" :items-after-collapse="2"
          :show-home="false" @click="handleClick" />
      </div>
    </div>

    <!-- 基于路由自动生成 -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">
          <Map class="section-icon" />
          基于路由自动生成
        </h2>
        <p class="section-desc">使用 useBreadcrumbRoute 组合式函数，自动根据当前路由生成面包屑。</p>
      </div>
      <div class="demo-block">
        <LBreadcrumb :items="routeItems" :show-home="false" @click="handleClick" />
      </div>
      <div class="info-tip">
        <span class="tip-label">当前路由:</span> {{ route.path }}
      </div>
    </div>

    <!-- 配置选项 -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">
          <Settings class="section-icon" />
          配置选项
        </h2>
      </div>
      <div class="control-group mb-md">
        <label class="checkbox-label">
          <input type="checkbox" v-model="showHome" class="checkbox-input" />
          <span>显示首页</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="lastItemClickable" class="checkbox-input" />
          <span>最后一项可点击</span>
        </label>
      </div>
      <div class="demo-block">
        <LBreadcrumb :items="basicItems" :show-home="showHome" :last-item-clickable="lastItemClickable"
          @click="handleClick" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.breadcrumb-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--size-space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--size-space-lg);
}

/* Page Header */
.page-header {
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800));
  color: white;
  padding: var(--size-space-xl);
  border-radius: var(--size-radius-lg);
  border: none;
}

.header-content {
  display: flex;
  align-items: center;
  gap: var(--size-space-lg);
}

.header-icon {
  background: rgba(255, 255, 255, 0.2);
  padding: var(--size-space-md);
  border-radius: var(--size-radius-round);
  display: flex;
}

.icon-hero {
  width: 48px;
  height: 48px;
  color: white;
}

.page-title {
  font-size: var(--size-font-2xl);
  font-weight: 700;
  margin: 0 0 var(--size-space-xs);
  color: white;
}

.page-desc {
  font-size: var(--size-font-md);
  opacity: 0.9;
  margin: 0;
  max-width: 600px;
}

/* Section Card */
.section-card {
  background: var(--color-bg-container);
  border-radius: var(--size-radius-lg);
  padding: var(--size-space-lg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-border-secondary);
}

.section-header {
  margin-bottom: var(--size-space-md);
  border-bottom: 1px solid var(--color-border-secondary);
  padding-bottom: var(--size-space-sm);
}

.section-title {
  font-size: var(--size-font-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--size-space-sm);
  margin: 0 0 var(--size-space-xs);
}

.section-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary-500);
}

.section-desc {
  color: var(--color-text-secondary);
  font-size: var(--size-font-sm);
  margin: 0;
}

/* Demo Block */
.demo-block {
  padding: var(--size-space-xl);
  background: var(--color-bg-page);
  border-radius: var(--size-radius-md);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  min-height: 80px;
}

/* Controls */
.control-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--size-space-lg);
  align-items: center;
}

.control-group.mb-md {
  margin-bottom: var(--size-space-md);
}

.control-item {
  display: flex;
  align-items: center;
  gap: var(--size-space-sm);
}

.label {
  font-size: var(--size-font-sm);
  color: var(--color-text-secondary);
  font-weight: 500;
}

.select-input,
.number-input {
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--size-radius-md);
  font-size: var(--size-font-sm);
  background: var(--color-bg-container);
  color: var(--color-text-primary);
  min-width: 100px;
  transition: all 0.2s;
}

.select-input:focus,
.number-input:focus {
  border-color: var(--color-primary-500);
  outline: none;
  box-shadow: 0 0 0 2px var(--color-primary-100);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: var(--size-font-sm);
  color: var(--color-text-primary);
  user-select: none;
}

.checkbox-input {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--color-primary-500);
}

.info-tip {
  margin-top: var(--size-space-md);
  padding: var(--size-space-md);
  background: var(--color-primary-50);
  border-radius: var(--size-radius-md);
  font-size: var(--size-font-sm);
  color: var(--color-primary-700);
  border: 1px solid var(--color-primary-100);
  display: flex;
  align-items: center;
  gap: var(--size-space-sm);
}

.tip-label {
  font-weight: 600;
  color: var(--color-primary-800);
}

@media (max-width: 768px) {
  .breadcrumb-demo {
    padding: var(--size-space-md);
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>
