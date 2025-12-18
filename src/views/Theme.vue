<script setup lang="ts">
import { BaseThemeAdapter } from '@ldesign/color-core'
import { useI18n } from '@ldesign/i18n-vue'
import { computed, onMounted, ref } from 'vue'

const { t } = useI18n()

// 创建主题适配器实例
const themeAdapter = new BaseThemeAdapter({
  autoApply: true,
  // 修正参数: 使用 persistence 对象替代 persistToLocalStorage
  persistence: {
    enabled: true,
    storage: 'localStorage'
  }
})

// 响应式状态
const currentTheme = ref(themeAdapter.getCurrentTheme())
const isLoading = ref(false)
const customColor = ref('#667eea')
const selectedPreset = ref('')

// 预设主题列表
const presetList = computed(() => {
  const state = themeAdapter.getState()
  return state.presets.map(p => p.name)
})

// 应用自定义颜色
async function applyCustomTheme() {
  isLoading.value = true
  try {
    const theme = await themeAdapter.applyTheme(customColor.value)
    currentTheme.value = theme
  }
  finally {
    isLoading.value = false
  }
}

// 应用预设主题
async function applyPreset() {
  if (!selectedPreset.value)
    return

  isLoading.value = true
  try {
    const theme = await themeAdapter.applyPresetTheme(selectedPreset.value)
    currentTheme.value = theme
  }
  finally {
    isLoading.value = false
  }
}

// 切换深色模式
async function toggleDarkMode() {
  if (!currentTheme.value)
    return

  isLoading.value = true
  try {
    const theme = await themeAdapter.applyTheme(
      currentTheme.value.primaryColor,
      { mode: currentTheme.value.isDark ? 'light' : 'dark' },
    )
    currentTheme.value = theme
  }
  finally {
    isLoading.value = false
  }
}

// 清除主题
function clearTheme() {
  themeAdapter.clearTheme()
  currentTheme.value = null
}

// 恢复主题
function restoreTheme() {
  const theme = themeAdapter.restoreTheme()
  currentTheme.value = theme
}

// 监听主题变化
onMounted(() => {
  themeAdapter.onChange((theme) => {
    currentTheme.value = theme
  })
})
</script>

<template>
  <div class="theme-page page-container">
    <header class="theme-hero section-card">
      <div>
        <p class="section-eyebrow">{{ t('theme.manageEasily') }}</p>
        <div class="section-header">
          <div>
            <h1 class="page-title white-text">
              {{ t('theme.title') }}
            </h1>
            <p class="section-description">
              {{ t('theme.desc') }}
            </p>
          </div>
          <div class="hero-actions">
            <button class="btn glass" :disabled="isLoading" @click="toggleDarkMode">
              {{ currentTheme?.isDark ? t('theme.lightMode') : t('theme.darkMode') }}
            </button>
            <button class="btn glass" @click="restoreTheme">
              {{ t('theme.restore') }}
            </button>
          </div>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-card glass-card">
          <span class="info-card__label">{{ t('theme.name') }}</span>
          <span class="info-card__value">
            {{ currentTheme?.themeName || t('theme.noTheme') }}
          </span>
        </div>
        <div class="info-card glass-card">
          <span class="info-card__label">{{ t('theme.primaryColor') }}</span>
          <div class="info-card__value color-value">
            <span class="color-box" :style="{ backgroundColor: currentTheme?.primaryColor || customColor }" />
            {{ currentTheme?.primaryColor || customColor }}
          </div>
        </div>
        <div class="info-card glass-card">
          <span class="info-card__label">{{ t('theme.modeLabel') }}</span>
          <span class="info-card__value">
            {{ currentTheme?.isDark ? t('theme.dark') : t('theme.light') }}
          </span>
        </div>
      </div>
    </header>

    <section class="section-card">
      <div class="section-header-row">
        <div>
          <h2 class="section-title">
            {{ t('theme.customizeTitle') }}
          </h2>
          <p class="section-desc">
            {{ t('theme.customizeDesc') }}
          </p>
        </div>
      </div>

      <div class="theme-controls">
        <div class="control-block">
          <div class="control-info">
            <p class="control-label">{{ t('theme.customColor') }}</p>
            <p class="control-desc">{{ t('theme.customColorDesc') }}</p>
          </div>
          <div class="control-actions">
            <div class="color-picker-wrapper">
              <input v-model="customColor" class="color-input" type="color" @change="applyCustomTheme">
            </div>
            <button class="btn primary" :disabled="isLoading" @click="applyCustomTheme">
              {{ t('theme.apply') }}
            </button>
          </div>
        </div>

        <div class="control-block">
          <div class="control-info">
            <p class="control-label">{{ t('theme.presetsLabel') }}</p>
            <p class="control-desc">{{ t('theme.presetsDesc') }}</p>
          </div>
          <div class="control-actions">
            <select v-model="selectedPreset" class="preset-select" @change="applyPreset">
              <option value="">{{ t('theme.selectPreset') }}</option>
              <option v-for="preset in presetList" :key="preset" :value="preset">{{ preset }}</option>
            </select>
            <button class="btn secondary" :disabled="!selectedPreset" @click="applyPreset">
              {{ t('theme.applyPreset') }}
            </button>
          </div>
        </div>

        <div class="control-block danger-block">
          <div class="control-info">
            <p class="control-label danger-text">{{ t('theme.resetTitle') }}</p>
            <p class="control-desc">{{ t('theme.resetDesc') }}</p>
          </div>
          <div class="control-actions">
            <button class="btn secondary" @click="clearTheme">
              {{ t('theme.clear') }}
            </button>
            <button class="btn secondary" @click="restoreTheme">
              {{ t('theme.restore') }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section v-if="isLoading" class="section-card loading-card">
      <div class="spinner"></div>
      <span>{{ t('theme.loading') }}</span>
    </section>
  </div>
</template>

<style scoped>
.theme-page {
  padding: var(--size-space-lg);
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--size-space-lg);
}

.section-eyebrow {
  font-size: var(--size-font-xs);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: var(--size-space-xs);
  font-weight: 600;
}

.theme-hero {
  display: flex;
  flex-direction: column;
  gap: var(--size-space-xl);
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800));
  color: white;
  border: none;
}

.page-title.white-text {
  color: white;
  margin: 0 0 var(--size-space-xs);
  font-size: var(--size-font-2xl);
  font-weight: 700;
}

.section-description {
  color: rgba(255, 255, 255, 0.9);
  font-size: var(--size-font-md);
  margin: 0;
  max-width: 600px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: var(--size-space-lg);
}

.hero-actions {
  display: flex;
  gap: var(--size-space-md);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--size-space-md);
}

.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: var(--size-space-md);
  border-radius: var(--size-radius-md);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-card__label {
  font-size: var(--size-font-sm);
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.info-card__value {
  font-size: var(--size-font-lg);
  font-weight: 600;
  color: white;
}

.section-card {
  background: var(--color-bg-container);
  border-radius: var(--size-radius-lg);
  padding: var(--size-space-lg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-border-secondary);
}

.section-header-row {
  margin-bottom: var(--size-space-lg);
  padding-bottom: var(--size-space-md);
  border-bottom: 1px solid var(--color-border-secondary);
}

.section-title {
  font-size: var(--size-font-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--size-space-xs);
}

.section-desc {
  color: var(--color-text-secondary);
  font-size: var(--size-font-sm);
  margin: 0;
}

.theme-controls {
  display: flex;
  flex-direction: column;
  gap: var(--size-space-lg);
}

.control-block {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: var(--size-space-md);
  padding-bottom: var(--size-space-md);
  border-bottom: 1px solid var(--color-border-secondary);
}

.control-block:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.control-info {
  flex: 1;
  min-width: 280px;
}

.control-label {
  font-size: var(--size-font-md);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 4px;
}

.control-desc {
  color: var(--color-text-secondary);
  font-size: var(--size-font-sm);
  margin: 0;
}

.danger-text {
  color: var(--color-error-500);
}

.control-actions {
  display: flex;
  align-items: center;
  gap: var(--size-space-md);
}

.btn {
  padding: 8px 16px;
  border-radius: var(--size-radius-md);
  font-size: var(--size-font-sm);
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.btn.primary {
  background: var(--color-primary-500);
  color: white;
}

.btn.primary:hover {
  background: var(--color-primary-600);
}

.btn.secondary {
  background: var(--color-bg-page);
  border-color: var(--color-border);
  color: var(--color-text-primary);
}

.btn.secondary:hover {
  background: var(--color-bg-hover);
  border-color: var(--color-border-secondary);
}

.btn.glass {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn.glass:hover {
  background: rgba(255, 255, 255, 0.3);
}

.color-input {
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: var(--size-radius-md);
  cursor: pointer;
  background: none;
}

.color-picker-wrapper {
  width: 40px;
  height: 40px;
  border-radius: var(--size-radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border);
  cursor: pointer;
}

.preset-select {
  padding: 8px 12px;
  border-radius: var(--size-radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-bg-page);
  color: var(--color-text-primary);
  font-size: var(--size-font-sm);
  min-width: 200px;
}

.color-value {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-box {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  display: inline-block;
}

.loading-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-space-md);
  min-height: 100px;
  color: var(--color-text-secondary);
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--size-space-md);
  }

  .control-block {
    flex-direction: column;
    align-items: flex-start;
  }

  .control-actions {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
