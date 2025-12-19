<script setup lang="ts">
/**
 * 登录页面（全屏模式）
 *
 * 使用模板系统实现多设备适配的登录页面
 * - 自动检测设备类型（desktop/tablet/mobile）
 * - 当浏览器窗口大小变化时自动切换到对应设备的模板
 * - 工具栏 slot 支持语言/主题/尺寸切换
 */
import { useEngine, useRouterService } from '@ldesign/engine-vue3'
import { TemplateSwitcher, useTemplate } from '@ldesign/template-vue'
import { useI18n, LanguageSwitcher } from '@ldesign/i18n-vue'
import { ThemeColorPicker, ThemeModeSwitcher } from '@ldesign/color-vue'
import { SizeSwitcher } from '@ldesign/size-vue'
import { Loader2 } from 'lucide-vue-next'

/** 登录数据类型 */
interface LoginData {
  loginType: 'username' | 'phone'
  username?: string
  phone?: string
  password?: string
  smsCode?: string
  captcha: string
}

const engine = useEngine()
const router = useRouterService()
const { t } = useI18n()

/**
 * 使用 useTemplate 动态加载模板组件
 *
 * 简化模式：只传分类名 'login'，自动检测设备类型
 * - 自动检测当前设备类型（desktop/tablet/mobile）
 * - 窗口大小变化时自动切换到对应设备的模板
 * - 优先使用缓存中的用户选择
 */
const {
  component: currentTemplate,
  loading: templateLoading,
  disabledMessage,
  deviceType,
} = useTemplate('login', { immediate: true })

/**
 * 处理登录提交
 */
function handleLogin(data: LoginData): void {
  console.log('[Login]', data)

  // 模拟登录成功
  engine.events.emit('user:login', { username: data.username || data.phone })

  // 跳转到首页
  router.push('/')
}

/**
 * 处理忘记密码
 */
function handleForgotPassword(): void {
  console.log('[ForgotPassword]')
  // 跳转到忘记密码页面
  // router.push('/forgot-password')
}

/**
 * 处理注册
 */
function handleRegister(): void {
  console.log('[Register]')
  // 跳转到注册页面
  // router.push('/register')
}

/**
 * 处理第三方登录
 */
function handleSocialLogin(provider: string): void {
  console.log('[SocialLogin]', provider)
  // 跳转到第三方登录
}
</script>

<template>
  <div class="login-page">
    <!-- 动态渲染登录模板 -->
    <div v-if="templateLoading" class="template-loading">
      <Loader2 class="spinner" />
      <span>加载模板中...</span>
    </div>
    <component v-else-if="currentTemplate" :is="currentTemplate" title="登录" :on-submit="handleLogin"
      :on-forgot-password="handleForgotPassword" :on-register="handleRegister" :on-social-login="handleSocialLogin"
      :category="'login'" :device="deviceType" :message="disabledMessage">
      <!-- 工具栏 slot：语言/主题/尺寸切换 -->
      <template #toolbar>
        <LanguageSwitcher variant="primary" />
        <ThemeModeSwitcher variant="primary" />
        <ThemeColorPicker variant="primary" />
        <SizeSwitcher variant="primary" />
        <TemplateSwitcher category="login" :translate="t" variant="primary" />
      </template>
    </component>
  </div>
</template>

<style scoped>
.login-page {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: var(--color-bg-layout);
}

.template-loading {
  display: flex;
  flex-direction: column;
  gap: var(--size-space-md);
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: var(--size-font-lg);
  color: var(--color-text-secondary);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
