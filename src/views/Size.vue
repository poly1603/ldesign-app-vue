<script setup lang="ts">
import type { BaseSizeAdapter } from '@ldesign/size-core'
import { SIZE_SYMBOL, SizePresetPicker } from '@ldesign/size-vue'
import { computed, inject } from 'vue'
import { Ruler, Maximize, FileText, CheckCircle, Scale, Type } from 'lucide-vue-next'

// 注入 Size 适配器
const sizeAdapter = inject<BaseSizeAdapter>(SIZE_SYMBOL)

// 当前预设
const currentPreset = computed(() => {
  return sizeAdapter?.getCurrentPreset?.() || null
})
</script>

<template>
  <div class="size-page page-container">
    <div class="page-header section-card">
      <div class="header-content">
        <div class="header-icon">
          <Ruler class="icon-hero" />
        </div>
        <div>
          <h1 class="page-title">尺寸管理</h1>
          <p class="page-desc">
            调整系统全局尺寸预设，包括间距、字体大小和组件尺寸。
          </p>
        </div>
      </div>
    </div>

    <div class="grid-layout">
      <!-- 当前状态 -->
      <div class="section-card current-state">
        <div class="section-header">
          <h2 class="section-title">
            <CheckCircle class="section-icon" />
            当前预设
          </h2>
        </div>
        <div v-if="currentPreset" class="state-info">
          <div class="info-item">
            <span class="label flex-center">
              <Type class="inline-icon" /> 预设名称
            </span>
            <span class="value">{{ currentPreset.name }}</span>
          </div>
          <div class="info-item">
            <span class="label flex-center">
              <Ruler class="inline-icon" /> 基础尺寸
            </span>
            <span class="value">{{ currentPreset.config.baseSize }}px</span>
          </div>
          <div class="info-item">
            <span class="label flex-center">
              <Scale class="inline-icon" /> 缩放比例
            </span>
            <span class="value">×{{ currentPreset.config.scale }}</span>
          </div>
          <div class="info-item">
            <span class="label flex-center">
              <Maximize class="inline-icon" /> 单位
            </span>
            <span class="value">{{ currentPreset.config.unit }}</span>
          </div>
        </div>
        <div v-else class="no-preset">
          请选择一个预设
        </div>
      </div>

      <!-- 预设选择器 -->
      <div class="section-card preset-selector">
        <div class="section-header">
          <h2 class="section-title">
            <Maximize class="section-icon" />
            选择预设
          </h2>
        </div>
        <div class="picker-wrapper">
          <SizePresetPicker />
        </div>
      </div>
    </div>

    <!-- 示例文本 -->
    <div class="section-card example-text">
      <div class="section-header">
        <h2 class="section-title">
          <FileText class="section-icon" />
          示例文本
        </h2>
      </div>
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
    </div>
  </div>
</template>

<style scoped>
.size-page {
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
  margin: 0;
}

.section-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary-500);
}

/* Grid Layout */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--size-space-lg);
}

/* State Info */
.state-info {
  display: flex;
  flex-direction: column;
  gap: var(--size-space-md);
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--size-space-md);
  background: var(--color-bg-page);
  border-radius: var(--size-radius-md);
  border: 1px solid var(--color-border);
}

.info-item .label {
  font-weight: 500;
  color: var(--color-text-secondary);
  font-size: var(--size-font-sm);
}

.info-item .value {
  font-family: monospace;
  color: var(--color-primary-500);
  font-weight: 600;
  font-size: var(--size-font-md);
}

.no-preset {
  padding: var(--size-space-lg);
  text-align: center;
  color: var(--color-text-tertiary);
  font-style: italic;
  background: var(--color-bg-page);
  border-radius: var(--size-radius-md);
}

.picker-wrapper {
  display: flex;
  justify-content: center;
  padding: var(--size-space-md) 0;
}

/* Text Samples */
.text-samples {
  display: flex;
  flex-direction: column;
  gap: var(--size-space-md);
  padding: var(--size-space-lg);
  background: var(--color-bg-page);
  border-radius: var(--size-radius-md);
  border: 1px solid var(--color-border);
}

.sample-h1 {
  font-size: var(--size-font-2xl);
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-text-primary);
  margin: 0;
}

.sample-h2 {
  font-size: var(--size-font-xl);
  font-weight: 600;
  line-height: 1.3;
  color: var(--color-text-primary);
  margin: 0;
}

.sample-h3 {
  font-size: var(--size-font-lg);
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-text-primary);
  margin: 0;
}

.sample-body {
  font-size: var(--size-font-md);
  line-height: 1.6;
  color: var(--color-text-primary);
  margin: 0;
}

.sample-small {
  font-size: var(--size-font-sm);
  line-height: 1.5;
  color: var(--color-text-secondary);
  margin: 0;
}

.flex-center {
  display: flex;
  align-items: center;
  gap: 6px;
}

.inline-icon {
  width: 14px;
  height: 14px;
}

@media (max-width: 768px) {
  .size-page {
    padding: var(--size-space-md);
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .grid-layout {
    grid-template-columns: 1fr;
  }
}
</style>
