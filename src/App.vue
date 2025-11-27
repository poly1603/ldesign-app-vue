<script setup lang="ts">
import { ThemeColorPicker, ThemeModeSwitcher } from '@ldesign/color-vue'
import { LanguageSwitcher, useI18n } from '@ldesign/i18n-vue'
import { SizeSwitcher } from '@ldesign/size-vue'

const { t, locale } = useI18n()
</script>

<template>
  <div id="app">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div class="header-content">
        <div class="logo">
          <span class="logo-icon">🎨</span>
          <span class="logo-text">LDesign</span>
        </div>

        <nav class="nav-menu">
          <router-link to="/" class="nav-link">
            {{ $t('nav.home') }}
          </router-link>
          <router-link to="/login" class="nav-link">
            {{ $t('nav.login') }}
          </router-link>
          <router-link to="/http" class="nav-link">
            HTTP 请求
          </router-link>
        </nav>

        <div class="header-actions">
          <LanguageSwitcher />
          <ThemeColorPicker :translate="t" />
          <ThemeModeSwitcher :translate="t" />
          <SizeSwitcher :translate="t" :locale="locale" />
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  background: var(--color-bg-page, #f5f7fa);
  color: var(--color-text-primary, #1f2937);
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏 */
.app-header {
  background: var(--color-bg-container, #ffffff);
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary, #2c3e50);
}

.logo-icon {
  font-size: 2rem;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
}

.nav-link {
  color: var(--color-text-secondary, #6b7280);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-link:hover {
  color: var(--color-primary-hover, #3b82f6);
  background: var(--color-bg-hover, #f3f4f6);
}

.nav-link.router-link-active {
  color: var(--color-primary, #3b82f6);
  background: var(--color-primary-bg, #eff6ff);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* 主内容区 */
.app-main {
  flex: 1;
  padding-top: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-menu {
    width: 100%;
    justify-content: center;
  }

  .header-actions {
    width: 100%;
    justify-content: center;
  }
}
</style>
