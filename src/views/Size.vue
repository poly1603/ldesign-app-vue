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
    <h1 class="page-title">
      <Ruler class="icon-title" />
      尺寸管理
    </h1>

    <div class="size-content">
      <!-- 当前状态 -->
      <section class="section-card current-state">
        <h2 class="section-title">
          <CheckCircle class="section-icon" />
          当前预设
        </h2>
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
      </section>

      <!-- 预设选择器 -->
      <section class="section-card preset-selector">
        <h2 class="section-title">
          <Maximize class="section-icon" />
          选择预设
        </h2>
        <SizePresetPicker />
      </section>

      <!-- 示例文本 -->
      <section class="section-card example-text">
        <h2 class="section-title">
          <FileText class="section-icon" />
          示例文本
        </h2>
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
  padding: var(--size-space-lg);
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-space-sm);
  font-size: var(--size-font-2xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--size-space-xl);
  text-align: center;
}

.icon-title {
  width: 32px;
  height: 32px;
  color: var(--color-primary-500);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--size-space-sm);
  font-size: var(--size-font-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--size-space-md);
  border-bottom: 1px solid var(--color-border-secondary);
  padding-bottom: var(--size-space-sm);
}

.section-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary-500);
}

.size-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--size-space-lg);
}

.section-card {
  background: var(--color-bg-container);
  padding: var(--size-space-lg);
  border-radius: var(--size-radius-lg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-border-secondary);
}

.example-text {
  grid-column: 1 / -1;
}

.state-info {
  display: flex;
  flex-direction: column;
  gap: var(--size-space-sm);
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--size-space-sm) var(--size-space-md);
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

.text-samples {
  display: flex;
  flex-direction: column;
  gap: var(--size-space-md);
  padding: var(--size-space-md);
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
  .size-content {
    grid-template-columns: 1fr;
  }
}
</style>
