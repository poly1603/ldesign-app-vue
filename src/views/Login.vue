<script setup lang="ts">
/**
 * 登录页面（全屏模式）
 *
 * 使用模板系统实现多设备适配的登录页面
 * - 自动检测设备类型（desktop/tablet/mobile）
 * - 当浏览器窗口大小变化时自动切换到对应设备的模板
 * - 工具栏 slot 支持语言/主题/尺寸切换
 * - 集成 LEAP 系统认证接口
 */
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useEngine, useRouterService } from '@ldesign/engine-vue3'
import { TemplateSwitcher, useTemplate } from '@ldesign/template-vue'
import { useI18n, LanguageSwitcher } from '@ldesign/i18n-vue'
import { ThemeColorPicker, ThemeModeSwitcher } from '@ldesign/color-vue'
import { SizeSwitcher } from '@ldesign/size-vue'
import { useNotification, LNotification, LToast, LMessage } from '@ldesign/notification-vue'
import { Loader2 } from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'

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
const route = useRoute()
const { t } = useI18n()
const notification = useNotification()

// 认证状态管理
const auth = useAuth()

// 错误消息
const errorMessage = ref('')

const templateMessage = computed(() => {
  return errorMessage.value || disabledMessage.value || ''
})

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
 * 页面加载时准备登录
 * - 获取 SID
 * - 获取验证码
 */
onMounted(async () => {
  try {
    await auth.prepareLogin()
    console.log('[Login] 准备登录完成, captchaUrl:', auth.captchaUrl.value)
  } catch (e) {
    console.error('[Login] 准备登录失败:', e)
    errorMessage.value = e instanceof Error
      ? e.message
      : '获取登录信息失败，请刷新页面重试'

    notification.error('登录初始化失败', {
      content: errorMessage.value,
      duration: 8000,
    })
  }
})

/**
 * 处理登录提交
 */
async function handleLogin(data: LoginData): Promise<void> {
  console.log('[Login] 登录数据:', data)
  errorMessage.value = ''

  // 只支持用户名密码登录
  if (data.loginType !== 'username') {
    errorMessage.value = '暂不支持手机号登录'
    return
  }

  if (!data.username || !data.password) {
    errorMessage.value = '请输入用户名和密码'
    return
  }

  try {
    const result = await auth.login({
      username: data.username,
      password: data.password,
      captcha: data.captcha,
    })

    if (result.type === 'success') {
      // 登录成功 - 显示欢迎通知
      const displayName = auth.displayName.value || '用户'
      notification.success('欢迎回来', {
        content: `${displayName}，登录成功！`,
        duration: 3000,
      })
      
      engine.events.emit('user:login', {
        username: auth.username.value,
        userInfo: auth.userInfo.value,
      })

      // 稍微延迟跳转，确保通知显示出来
      setTimeout(() => {
        const redirect = route.query?.redirect
        const target = typeof redirect === 'string' && redirect.trim() !== '' ? redirect : '/'
        router.push(target)
      }, 300)
    } else {
      // 登录失败，弹出错误通知
      notification.error('登录失败', {
        content: result.message,
        duration: 5000,
      })
      errorMessage.value = result.message
    }
  } catch (e) {
    console.error('[Login] 登录错误:', e)
    errorMessage.value = '登录失败，请重试'
  }
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
      :captcha-url="auth.captchaUrl.value" :on-refresh-captcha="auth.refreshCaptcha"
      :category="'login'" :device="deviceType" :message="templateMessage">
      <!-- 工具栏 slot：语言/主题/尺寸切换 -->
      <template #toolbar>
        <LanguageSwitcher variant="primary" />
        <ThemeModeSwitcher variant="primary" />
        <ThemeColorPicker variant="primary" />
        <SizeSwitcher variant="primary" />
        <TemplateSwitcher category="login" :translate="t" variant="primary" />
      </template>
    </component>

    <div v-if="errorMessage" class="login-error-banner">{{ errorMessage }}</div>

    <!-- 通知组件容器 -->
    <LNotification />
    <LToast />
    <LMessage />
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

.login-error-banner {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 16px;
  z-index: 10;
  padding: 12px 14px;
  background: rgba(255, 77, 79, 0.12);
  border: 1px solid rgba(255, 77, 79, 0.35);
  color: var(--color-text-primary);
  border-radius: 10px;
  font-size: var(--size-font-md);
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
