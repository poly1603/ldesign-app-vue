<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const title = computed(() => {
  const t = route.meta?.title
  return typeof t === 'string' && t.length > 0 ? t : route.path
})

const componentPath = computed(() => {
  const v = route.meta?.menuComponent
  return typeof v === 'string' ? v : ''
})

const componentName = computed(() => {
  const v = route.meta?.menuComponentName
  return typeof v === 'string' ? v : ''
})
</script>

<template>
  <div class="menu-page">
    <div class="menu-page__title">{{ title }}</div>

    <div v-if="componentPath || componentName" class="menu-page__meta">
      <div v-if="componentPath" class="menu-page__meta-row">
        <span class="menu-page__meta-label">component:</span>
        <span class="menu-page__meta-value">{{ componentPath }}</span>
      </div>
      <div v-if="componentName" class="menu-page__meta-row">
        <span class="menu-page__meta-label">componentName:</span>
        <span class="menu-page__meta-value">{{ componentName }}</span>
      </div>
    </div>

    <div class="menu-page__content">
      <div class="menu-page__hint">该菜单页面未配置本地组件，当前为占位页。</div>
    </div>
  </div>
</template>

<style scoped>
.menu-page {
  padding: 16px;
}

.menu-page__title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--color-gray-900, #111827);
}

.menu-page__meta {
  padding: 12px;
  border: 1px solid var(--color-gray-200, #e5e7eb);
  border-radius: 8px;
  background: var(--color-bg-container, #fff);
  margin-bottom: 12px;
}

.menu-page__meta-row {
  display: flex;
  gap: 8px;
  line-height: 1.6;
}

.menu-page__meta-label {
  color: var(--color-gray-500, #6b7280);
}

.menu-page__meta-value {
  color: var(--color-gray-900, #111827);
  word-break: break-all;
}

.menu-page__content {
  padding: 16px;
  border-radius: 8px;
  background: var(--color-gray-50, #f9fafb);
  color: var(--color-text-secondary, #666);
}

.menu-page__hint {
  font-size: 14px;
}
</style>
