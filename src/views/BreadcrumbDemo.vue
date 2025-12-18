<script setup lang="ts">
/**
 * 面包屑组件演示页面
 * 展示 @ldesign/breadcrumb-vue 的各种功能和用法
 */
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import type { BreadcrumbItem } from '@ldesign/breadcrumb-vue'
import {
  LBreadcrumb,
  useBreadcrumbRoute,
} from '@ldesign/breadcrumb-vue'
import '@ldesign/breadcrumb-vue/styles'

const route = useRoute()

// 基础面包屑数据
const basicItems = ref<BreadcrumbItem[]>([
  { key: 'home', label: '首页', path: '/', icon: '🏠' },
  { key: 'system', label: '系统管理', path: '/system' },
  { key: 'user', label: '用户管理', path: '/system/user' },
])

// 带下拉菜单的面包屑
const itemsWithDropdown = ref<BreadcrumbItem[]>([
  { key: 'home', label: '首页', path: '/', icon: '🏠' },
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
  homeItem: { label: '首页', icon: '🏠' },
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
    <h1 class="page-title">面包屑组件演示</h1>
    <p class="page-desc">
      @ldesign/breadcrumb-vue 提供了功能丰富的面包屑导航组件，支持路由自动生成、下拉菜单、折叠显示等特性。
    </p>

    <!-- 基础用法 -->
    <section class="section-card">
      <h2 class="section-title">基础用法</h2>
      <div class="demo-block">
        <LBreadcrumb :items="basicItems" :separator="separator" :size="size" :show-home="false" @click="handleClick" />
      </div>
      <div class="controls-row">
        <label class="control-label">
          分隔符:
          <select v-model="separator" class="select-input">
            <option value="/">/</option>
            <option value=">">&gt;</option>
            <option value="•">•</option>
          </select>
        </label>
        <label class="control-label">
          大小:
          <select v-model="size" class="select-input">
            <option value="small">小</option>
            <option value="medium">中</option>
            <option value="large">大</option>
          </select>
        </label>
      </div>
    </section>

    <!-- 带下拉菜单 -->
    <section class="section-card">
      <h2 class="section-title">带下拉菜单</h2>
      <p class="section-desc">支持在面包屑项上显示下拉菜单，方便快速导航到子页面。</p>
      <div class="demo-block">
        <LBreadcrumb :items="itemsWithDropdown" :show-home="false" @click="handleClick"
          @dropdown-select="handleDropdownSelect" />
      </div>
    </section>

    <!-- 自动折叠 -->
    <section class="section-card">
      <h2 class="section-title">自动折叠</h2>
      <p class="section-desc">当路径层级过深时，可以自动折叠中间项，点击省略号可展开。</p>
      <div class="demo-block">
        <LBreadcrumb :items="longPathItems" :max-items="4" :items-before-collapse="1" :items-after-collapse="2"
          :show-home="false" @click="handleClick" />
      </div>
      <div class="controls-row">
        <label class="control-label">
          最大显示项数:
          <input type="number" v-model.number="maxItems" min="0" max="10" class="number-input" />
        </label>
      </div>
    </section>

    <!-- 基于路由自动生成 -->
    <section class="section-card">
      <h2 class="section-title">基于路由自动生成</h2>
      <p class="section-desc">使用 useBreadcrumbRoute 组合式函数，自动根据当前路由生成面包屑。</p>
      <div class="demo-block">
        <LBreadcrumb :items="routeItems" :show-home="false" @click="handleClick" />
      </div>
      <div class="info-tip">
        当前路由: {{ route.path }}
      </div>
    </section>

    <!-- 配置选项 -->
    <section class="section-card">
      <h2 class="section-title">配置选项</h2>
      <div class="controls-row">
        <label class="checkbox-label">
          <input type="checkbox" v-model="showHome" />
          显示首页
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="lastItemClickable" />
          最后一项可点击
        </label>
      </div>
      <div class="demo-block">
        <LBreadcrumb :items="basicItems" :show-home="showHome" :last-item-clickable="lastItemClickable"
          @click="handleClick" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.breadcrumb-demo {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--size-space-lg);
}

.page-title {
  font-size: var(--size-font-2xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--size-space-sm);
}

.page-desc {
  margin-bottom: var(--size-space-xl);
  color: var(--color-text-secondary);
  font-size: var(--size-font-md);
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
  margin-bottom: var(--size-space-md);
  font-size: var(--size-font-lg);
  color: var(--color-text-primary);
  font-weight: 600;
}

.section-desc {
  margin-bottom: var(--size-space-md);
  color: var(--color-text-secondary);
  font-size: var(--size-font-sm);
}

.demo-block {
  padding: var(--size-space-lg);
  background: var(--color-bg-page);
  border-radius: var(--size-radius-md);
  margin-bottom: var(--size-space-md);
  border: 1px solid var(--color-border);
}

.controls-row {
  display: flex;
  gap: var(--size-space-lg);
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: var(--size-space-md);
}

.control-label,
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--size-font-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
}

.select-input,
.number-input {
  padding: 4px 8px;
  border: 1px solid var(--color-border);
  border-radius: var(--size-radius-sm);
  font-size: var(--size-font-sm);
  background: var(--color-bg-container);
  color: var(--color-text-primary);
}

.info-tip {
  margin-top: var(--size-space-md);
  padding: 8px 12px;
  background: var(--color-primary-50);
  border-radius: var(--size-radius-sm);
  font-size: var(--size-font-sm);
  color: var(--color-primary-600);
  border: 1px solid var(--color-primary-100);
}
</style>
