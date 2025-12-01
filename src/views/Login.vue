<script setup lang="ts">
/**
 * 登录页面（全屏模式）
 *
 * 使用模板系统实现多设备适配的登录页面
 * - 自动检测设备类型（desktop/tablet/mobile）
 * - 当浏览器窗口大小变化时自动切换到对应设备的模板
 * - 集成 TemplateSelector 组件，支持用户手动选择模板
 *
 * 简化后的实现：
 * - 无需手动使用 useWindowSize 监听窗口大小
 * - 无需手动计算设备类型
 * - 无需手动 watch 设备变化
 * - useTemplate 和 TemplateSelector 会自动处理设备检测
 */
import { useEngine, useRouterService } from '@ldesign/engine-vue3'
import { TemplateSelector, useTemplate } from '@ldesign/template-vue'
import { computed, ref } from 'vue'

/** 登录数据类型 */
interface LoginData {
  username: string
  password: string
}

const engine = useEngine()
const router = useRouterService()

// 是否显示模板选择器面板
const showSelector = ref(false)

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
  load: loadTemplate,
  template: currentTemplateMeta,
  disabled: templateDisabled,
  disabledMessage,
  deviceType,
} = useTemplate('login', { immediate: true })

/**
 * 获取当前模板ID（用于选择器高亮）
 */
const currentTemplateId = computed(() => currentTemplateMeta.value?.id)

/**
 * 处理用户手动选择模板
 * 使用 'user' 来源标记，这样会写入缓存
 */
function handleTemplateChange(templateId: string): void {
  // 用户手动选择，传入 'user' 来源，会写入缓存
  loadTemplate(templateId, 'user')
  // 选择后关闭面板
  showSelector.value = false
}

/**
 * 处理登录提交
 */
function handleLogin(data: LoginData): void {
  console.log('[Login]', data.username, data.password)

  // 模拟登录成功
  engine.events.emit('user:login', { username: data.username })

  // 跳转到首页
  router.push('/')
}

/**
 * 切换模板选择器面板显示
 */
function toggleSelector(): void {
  showSelector.value = !showSelector.value
}
</script>

<template>
  <div class="login-page">
    <!-- 模板选择器触发按钮 -->
    <button class="template-trigger" :class="{ active: showSelector }" title="选择登录模板" @click="toggleSelector">
      🎨
    </button>

    <!-- 模板选择器面板 -->
    <Transition name="slide">
      <div v-if="showSelector" class="template-panel">
        <div class="panel-header">
          <h3>选择模板</h3>
          <button class="close-btn" @click="showSelector = false">×</button>
        </div>
        <div class="panel-content">
          <!-- 简化：不再需要传递 device，TemplateSelector 会自动检测设备类型 -->
          <TemplateSelector category="login" :model-value="currentTemplateId" :show-preview="true"
            :show-description="true" @update:model-value="handleTemplateChange" />
        </div>
      </div>
    </Transition>

    <!-- 遮罩层 -->
    <Transition name="fade">
      <div v-if="showSelector" class="overlay" @click="showSelector = false" />
    </Transition>

    <!-- 动态渲染登录模板 -->
    <div v-if="templateLoading" class="template-loading">
      <span>加载模板中...</span>
    </div>
    <component v-else-if="currentTemplate" :is="currentTemplate" title="登录" :on-submit="handleLogin" :category="'login'"
      :device="deviceType" :message="disabledMessage" />
  </div>
</template>

<style scoped>
.login-page {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.template-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 16px;
  color: #666;
}

/* 模板选择器触发按钮 */
.template-trigger {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1001;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.template-trigger:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.template-trigger.active {
  transform: rotate(45deg);
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

/* 模板选择器面板 */
.template-panel {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 1000;
  width: 400px;
  max-width: calc(100vw - 40px);
  max-height: calc(100vh - 120px);
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.close-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 20px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}



/* 遮罩层 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.3);
}

/* 动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .template-panel {
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    max-width: 100%;
    max-height: 70vh;
    border-radius: 16px 16px 0 0;
  }

  .template-trigger {
    top: auto;
    bottom: 20px;
  }
}
</style>
