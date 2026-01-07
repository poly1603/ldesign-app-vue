<script setup lang="ts">
/**
 * 退出登录确认弹窗组件
 * 
 * 用于在用户点击退出按钮时显示确认对话框
 */
import { LogOut, X } from 'lucide-vue-next'

interface Props {
  /** 是否显示弹窗 */
  visible: boolean
  /** 是否正在加载（退出中） */
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  /** 确认退出 */
  confirm: []
  /** 取消退出 */
  cancel: []
}>()

/** 点击遮罩层关闭 */
function handleMaskClick(e: MouseEvent) {
  if (e.target === e.currentTarget && !props.loading) {
    emit('cancel')
  }
}

/** 按 ESC 键关闭 */
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && !props.loading) {
    emit('cancel')
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div 
        v-if="visible" 
        class="logout-modal-mask" 
        @click="handleMaskClick"
        @keydown="handleKeydown"
        tabindex="-1"
      >
        <div class="logout-modal">
          <!-- 关闭按钮 -->
          <button 
            class="modal-close" 
            @click="emit('cancel')" 
            :disabled="loading"
            aria-label="关闭"
          >
            <X :size="20" />
          </button>

          <!-- 图标 -->
          <div class="modal-icon">
            <LogOut :size="32" />
          </div>

          <!-- 标题 -->
          <h3 class="modal-title">确认退出</h3>

          <!-- 内容 -->
          <p class="modal-content">
            您确定要退出登录吗？退出后需要重新登录才能访问系统。
          </p>

          <!-- 按钮组 -->
          <div class="modal-actions">
            <button 
              class="modal-btn cancel" 
              @click="emit('cancel')"
              :disabled="loading"
            >
              取消
            </button>
            <button 
              class="modal-btn confirm" 
              @click="emit('confirm')"
              :disabled="loading"
            >
              <span v-if="loading" class="btn-loading"></span>
              {{ loading ? '退出中...' : '确认退出' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* 遮罩层 */
.logout-modal-mask {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

/* 弹窗主体 */
.logout-modal {
  position: relative;
  width: 400px;
  max-width: calc(100vw - 32px);
  padding: 32px;
  background: var(--color-bg-container, #fff);
  border-radius: 16px;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  text-align: center;
}

/* 关闭按钮 */
.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--color-text-tertiary, #999);
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover:not(:disabled) {
  background: var(--color-fill-secondary, #f5f5f5);
  color: var(--color-text-secondary, #666);
}

.modal-close:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 图标 */
.modal-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: var(--color-warning-50, #fffbeb);
  color: var(--color-warning-500, #f59e0b);
}

/* 标题 */
.modal-title {
  margin: 0 0 12px;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary, #1f2937);
}

/* 内容 */
.modal-content {
  margin: 0 0 24px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-secondary, #6b7280);
}

/* 按钮组 */
.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* 按钮基础样式 */
.modal-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 100px;
  height: 40px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 取消按钮 */
.modal-btn.cancel {
  background: var(--color-fill-secondary, #f3f4f6);
  color: var(--color-text-secondary, #6b7280);
}

.modal-btn.cancel:hover:not(:disabled) {
  background: var(--color-fill-tertiary, #e5e7eb);
}

/* 确认按钮 */
.modal-btn.confirm {
  background: var(--color-error-500, #ef4444);
  color: #fff;
}

.modal-btn.confirm:hover:not(:disabled) {
  background: var(--color-error-600, #dc2626);
}

/* 加载动画 */
.btn-loading {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 过渡动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-active .logout-modal,
.modal-fade-leave-active .logout-modal {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .logout-modal,
.modal-fade-leave-to .logout-modal {
  transform: scale(0.95);
  opacity: 0;
}

/* 深色模式适配 */
:root[data-theme-mode="dark"] .logout-modal,
.dark .logout-modal {
  background: var(--color-bg-container, #1f2937);
}

:root[data-theme-mode="dark"] .modal-icon,
.dark .modal-icon {
  background: rgba(245, 158, 11, 0.15);
}

:root[data-theme-mode="dark"] .modal-close:hover:not(:disabled),
.dark .modal-close:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
}
</style>
