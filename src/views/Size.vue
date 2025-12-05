<script setup lang="ts">
import type { BaseSizeAdapter } from '@ldesign/size-core'
import { SIZE_SYMBOL, SizePresetPicker } from '@ldesign/size-vue'
import { computed, inject } from 'vue'

// 注入 Size 适配器
const sizeAdapter = inject<BaseSizeAdapter>(SIZE_SYMBOL)

// 当前预设
const currentPreset = computed(() => {
  return sizeAdapter?.getCurrentPreset?.() || null
})
</script>

<template>
  <div class="size-page">
    <h1>尺寸管理</h1>

    <div class="size-content">
      <!-- 当前状态 -->
      <section class="current-state">
        <h2>当前预设</h2>
        <div v-if="currentPreset" class="state-info">
          <div class="info-item">
            <span class="label">预设名称</span>
            <span class="value">{{ currentPreset.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">基础尺寸</span>
            <span class="value">{{ currentPreset.config.baseSize }}px</span>
          </div>
          <div class="info-item">
            <span class="label">缩放比例</span>
            <span class="value">×{{ currentPreset.config.scale }}</span>
          </div>
          <div class="info-item">
            <span class="label">单位</span>
            <span class="value">{{ currentPreset.config.unit }}</span>
          </div>
        </div>
        <div v-else class="no-preset">
          请选择一个预设
        </div>
      </section>

      <!-- 预设选择器 -->
      <section class="preset-selector">
        <h2>选择预设</h2>
        <SizePresetPicker />
      </section>

      <!-- 示例文本 -->
      <section class="example-text">
        <h2>示例文本</h2>
        <div class="text-samples">
          <p class="sample-h1">
            标题 1 - Heading 1
          </p>
          <p class="sample-h2">
            标题 2 - Heading 2
          </p>
          <p class="sample-h3">
            标题 3 - Heading 3
          </p>
          <p class="sample-body">
            正文文本 - Body Text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            这是一段示例文本，用于展示当前尺寸设置的效果。
          </p>
          <p class="sample-small">
            小号文本 - Small Text. 这是小号文本的示例。
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.size-page {
  padding: var(--size-space-lg, 24px);
  max-width: var(--size-size-64, 1200px);
  margin: 0 auto;
}

h1 {
  font-size: var(--size-font-xxl, 32px);
  font-weight: var(--size-font-weight-bold, 700);
  margin-bottom: var(--size-comp-margin-xxxl, 32px);
  color: var(--color-text-primary, #333);
}

h2 {
  font-size: var(--size-font-lg, 20px);
  font-weight: var(--size-font-weight-semibold, 600);
  margin-bottom: var(--size-comp-margin-l, 16px);
  color: var(--color-text-secondary, #555);
}

.size-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--size-space-lg, 24px);
}

.current-state,
.preset-selector,
.example-text {
  background: var(--color-bg-container, #ffffff);
  padding: var(--size-space-lg, 24px);
  border-radius: var(--size-radius-lg, 12px);
  box-shadow: var(--size-shadow-2, 0 2px 8px rgba(0, 0, 0, 0.08));
}

.example-text {
  grid-column: 1 / -1;
}

.state-info {
  display: flex;
  flex-direction: column;
  gap: var(--size-space-s, 12px);
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--size-space-s, 12px);
  background: var(--color-bg-component, #f5f5f5);
  border-radius: var(--size-radius-md, 6px);
}

.info-item .label {
  font-weight: var(--size-font-weight-semibold, 600);
  color: var(--color-text-secondary, #666);
}

.info-item .value {
  font-family: var(--size-font-family-mono, 'Courier New', monospace);
  color: var(--color-primary, #1890ff);
  font-weight: var(--size-font-weight-semibold, 600);
}

.no-preset {
  padding: var(--size-space-lg, 24px);
  text-align: center;
  color: var(--color-text-disabled, #999);
  font-style: italic;
}

.text-samples {
  display: flex;
  flex-direction: column;
  gap: var(--size-space-md, 16px);
}

.sample-h1 {
  font-size: var(--size-font-xxl, 2em);
  font-weight: var(--size-font-weight-bold, 700);
  line-height: var(--size-line-tight, 1.2);
}

.sample-h2 {
  font-size: var(--size-font-xl, 1.5em);
  font-weight: var(--size-font-weight-semibold, 600);
  line-height: var(--size-line-snug, 1.3);
}

.sample-h3 {
  font-size: var(--size-font-lg, 1.25em);
  font-weight: var(--size-font-weight-semibold, 600);
  line-height: var(--size-line-normal, 1.4);
}

.sample-body {
  font-size: var(--size-font-md, 1em);
  line-height: var(--size-line-relaxed, 1.6);
  color: var(--color-text-primary, #333);
}

.sample-small {
  font-size: var(--size-font-sm, 0.875em);
  line-height: var(--size-line-normal, 1.5);
  color: var(--color-text-secondary, #666);
}

@media (max-width: 768px) {
  .size-content {
    grid-template-columns: 1fr;
  }
}
</style>
