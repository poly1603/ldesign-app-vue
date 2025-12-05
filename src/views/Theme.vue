<script setup lang="ts">
import { BaseThemeAdapter } from '@ldesign/color-core'
import { computed, onMounted, ref } from 'vue'

// 创建主题适配器实例
const themeAdapter = new BaseThemeAdapter({
  autoApply: true,
  persistToLocalStorage: true,
  respectSystemPreference: true,
})

// 响应式状态
const currentTheme = ref(themeAdapter.getCurrentTheme())
const isLoading = ref(false)
const customColor = ref('#667eea')
const selectedPreset = ref('')

// 预设主题列表
const presetList = computed(() => {
  const state = themeAdapter.getState()
  return Object.keys(state.presets)
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
      { isDark: !currentTheme.value.isDark },
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
  <div class="theme-page">
    <h1>{{ $t('theme.title') }}</h1>

    <div class="theme-section">
      <h2>{{ $t('theme.currentTheme') }}</h2>
      <div v-if="currentTheme" class="theme-info">
        <p><strong>{{ $t('theme.name') }}:</strong> {{ currentTheme.themeName }}</p>
        <p>
          <strong>{{ $t('theme.primaryColor') }}:</strong>
          <span class="color-box" :style="{ backgroundColor: currentTheme.primaryColor }" />
          {{ currentTheme.primaryColor }}
        </p>
        <p>
          <strong>{{ $t('theme.modeLabel') }}:</strong>
          {{ currentTheme.isDark ? $t('theme.dark') : $t('theme.light') }}
        </p>
      </div>
      <p v-else class="no-theme">
        {{ $t('theme.noTheme') }}
      </p>
    </div>

    <div class="theme-section">
      <h2>{{ $t('theme.actions') }}</h2>
      <div class="actions">
        <div class="action-group">
          <label>{{ $t('theme.customColor') }}:</label>
          <input v-model="customColor" type="color" @change="applyCustomTheme">
          <button :disabled="isLoading" @click="applyCustomTheme">
            {{ $t('theme.apply') }}
          </button>
        </div>

        <div class="action-group">
          <label>{{ $t('theme.presetsLabel') }}:</label>
          <select v-model="selectedPreset" @change="applyPreset">
            <option value="">
              {{ $t('theme.selectPreset') }}
            </option>
            <option v-for="preset in presetList" :key="preset" :value="preset">
              {{ preset }}
            </option>
          </select>
        </div>

        <div class="action-group">
          <button :disabled="isLoading" @click="toggleDarkMode">
            {{ currentTheme?.isDark ? $t('theme.lightMode') : $t('theme.darkMode') }}
          </button>
          <button @click="clearTheme">
            {{ $t('theme.clear') }}
          </button>
          <button @click="restoreTheme">
            {{ $t('theme.restore') }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="loading">
      {{ $t('theme.loading') }}
    </div>
  </div>
</template>

<style scoped>
.theme-page {
  padding: var(--size-space-xl, 2rem);
  max-width: var(--size-size-48, 800px);
  margin: 0 auto;
}

h1 {
  color: var(--color-primary-default, #667eea);
  margin-bottom: var(--size-space-xl, 2rem);
}

h2 {
  color: var(--color-text-primary, #374151);
}

.theme-section {
  background: var(--color-bg-container-secondary, #f5f5f5);
  padding: var(--size-space-lg, 1.5rem);
  margin-bottom: var(--size-space-lg, 1.5rem);
  border-radius: var(--size-radius-md, 8px);
  border: var(--size-border-width-thin, 1px) solid var(--color-border, #e5e7eb);
}

.theme-info {
  display: flex;
  flex-direction: column;
  gap: var(--size-space-s, 0.75rem);
  color: var(--color-text-primary, #374151);
}

.theme-info p {
  color: var(--color-text-primary, #374151);
}

.theme-info strong {
  color: var(--color-text-primary, #374151);
}

.color-box {
  display: inline-block;
  width: var(--size-size-12, 40px);
  height: var(--size-size-7, 20px);
  border: var(--size-border-width-thin, 1px) solid var(--color-border, #ccc);
  border-radius: var(--size-radius-sm, 4px);
  margin: 0 var(--size-space-xs, 8px);
  vertical-align: middle;
}

.no-theme {
  color: var(--color-text-secondary, #666);
  font-style: italic;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: var(--size-space-md, 1rem);
}

.action-group {
  display: flex;
  align-items: center;
  gap: var(--size-space-md, 1rem);
}

.action-group label {
  font-weight: var(--size-font-weight-semibold, 600);
  min-width: var(--size-size-18, 120px);
  color: var(--color-text-primary, #374151);
}

.action-group input[type='color'] {
  width: var(--size-size-14, 60px);
  height: var(--size-size-12, 40px);
  border: var(--size-border-width-thin, 1px) solid var(--color-border, #d1d5db);
  border-radius: var(--size-radius-sm, 4px);
  cursor: pointer;
  background: var(--color-bg-component, #ffffff);
}

.action-group select {
  flex: 1;
  padding: var(--size-comp-paddingTB-xs, 0.5rem);
  border: var(--size-border-width-thin, 1px) solid var(--color-border, #ddd);
  border-radius: var(--size-radius-sm, 4px);
  font-size: var(--size-font-sm, 14px);
  background: var(--color-bg-component, #ffffff);
  color: var(--color-text-primary, #374151);
  transition: border-color var(--size-duration-fast, 0.2s);
}

.action-group select:hover {
  border-color: var(--color-border-dark, #9ca3af);
}

.action-group select:focus {
  outline: none;
  border-color: var(--color-primary-default, #3b82f6);
}

.action-group button {
  padding: var(--size-comp-paddingTB-xs, 0.5rem) var(--size-comp-paddingLR-m, 1rem);
  background: var(--color-primary-default, #667eea);
  color: var(--color-text-inverse, #ffffff);
  border: none;
  border-radius: var(--size-radius-sm, 4px);
  cursor: pointer;
  font-size: var(--size-font-sm, 14px);
  transition: all var(--size-duration-fast, 0.2s);
}

.action-group button:hover:not(:disabled) {
  background: var(--color-primary-hover, #5568d3);
  transform: translateY(calc(-1 * var(--size-size-1, 1px)));
}

.action-group button:active:not(:disabled) {
  background: var(--color-primary-active, #4451b8);
  transform: translateY(0);
}

.action-group button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--color-gray-400, #9ca3af);
}

.loading {
  text-align: center;
  color: var(--color-primary-default, #667eea);
  font-weight: var(--size-font-weight-semibold, 600);
  margin-top: var(--size-space-md, 1rem);
}
</style>
