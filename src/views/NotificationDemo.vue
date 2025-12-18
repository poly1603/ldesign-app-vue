<script setup lang="ts">
import {
  LDrawer,
  LMessage,
  LModal,
  LNotification,
  LToast,
  useDrawer,
  useMessage,
  useModal,
  useNotification,
  useToast,
} from '@ldesign/notification-vue'
/**
 * 通知系统演示页面
 *
 * 展示 @ldesign/notification-vue 的所有功能
 */
import { ref } from 'vue'

// ==================== Composables ====================
const toast = useToast()
const message = useMessage()
const notification = useNotification()
const modal = useModal()
const drawer = useDrawer()

// ==================== Toast 演示 ====================
const showToastSuccess = () => toast.success('操作成功！')
const showToastError = () => toast.error('操作失败，请重试')
const showToastWarning = () => toast.warning('警告：请注意操作')
const showToastInfo = () => toast.info('这是一条信息提示')

const toastLoading = ref<string | null>(null)
const showToastLoading = async () => {
  toastLoading.value = toast.loading('加载中...')
  await new Promise(resolve => setTimeout(resolve, 2000))
  if (toastLoading.value) {
    toast.update(toastLoading.value, {
      type: 'success',
      content: '加载完成！',
      duration: 2000,
    })
    toastLoading.value = null
  }
}

// ==================== Message 演示 ====================
const showMessageSuccess = () => message.success('保存成功')
const showMessageError = () => message.error('网络错误，请检查连接')
const showMessageWarning = () => message.warning('您的会话即将过期')
const showMessageInfo = () => message.info('新消息通知')

// ==================== Notification 演示 ====================
const showNotificationSuccess = () => {
  notification.success('成功', {
    content: '您的文件已成功上传到服务器',
    duration: 5000,
  })
}

const showNotificationError = () => {
  notification.error('错误', {
    content: '文件上传失败，请检查网络连接后重试',
  })
}

const showNotificationWithActions = () => {
  notification.info('系统更新', {
    content: '检测到新版本可用，是否立即更新？',
    closable: true,
    duration: 0,
    actions: [
      { text: '稍后提醒', type: 'secondary' },
      { text: '立即更新', type: 'primary' },
    ],
  })
}

// ==================== Modal 演示 ====================
const showConfirmDialog = async () => {
  const confirmed = await modal.confirm({
    title: '确认删除',
    content: '确定要删除这条记录吗？此操作不可恢复。',
    confirmText: '删除',
    cancelText: '取消',
    confirmType: 'danger',
  })
  if (confirmed) {
    toast.success('删除成功')
  }
  else {
    toast.info('已取消')
  }
}

const showAlertDialog = () => {
  modal.alert({
    title: '系统通知',
    content: '您的账户已在其他设备登录，如非本人操作，请及时修改密码。',
    confirmText: '我知道了',
  })
}

const promptResult = ref('')
const showPromptDialog = async () => {
  const result = await modal.prompt({
    title: '输入名称',
    content: '请输入新文件夹的名称：',
    placeholder: '新文件夹',
    confirmText: '创建',
    cancelText: '取消',
  })
  if (result) {
    promptResult.value = result
    toast.success(`创建成功：${result}`)
  }
}

const modalVisible = ref(false)
const showCustomModal = () => {
  modalVisible.value = true
}

// Modal 动画演示
type AnimationMode = 'fade' | 'scale' | 'slide-top' | 'slide-bottom' | 'slide-left' | 'slide-right' | 'bounce' | 'zoom'
const modalAnimation = ref<AnimationMode>('scale')
const animationModalVisible = ref(false)

const showAnimationModal = (animation: AnimationMode) => {
  modalAnimation.value = animation
  animationModalVisible.value = true
}

// Modal 高级功能演示
const maximizableModalVisible = ref(false)
const draggableModalVisible = ref(false)
const resizableModalVisible = ref(false)
const fullFeaturedModalVisible = ref(false)

// ==================== Drawer 演示 ====================
const drawerVisible = ref(false)
const drawerPlacement = ref<'left' | 'right' | 'top' | 'bottom'>('right')
const resizableDrawerVisible = ref(false)

const showDrawer = (placement: 'left' | 'right' | 'top' | 'bottom') => {
  drawerPlacement.value = placement
  drawerVisible.value = true
}

const showDrawerWithAPI = () => {
  drawer.open({
    title: 'API 调用抽屉',
    placement: 'right',
    width: 400,
    content: '这是通过 API 调用打开的抽屉',
  })
}

const showResizableDrawer = () => {
  resizableDrawerVisible.value = true
}
</script>

<template>
  <div class="notification-demo page-container">
    <h1 class="page-title">🔔 通知系统演示</h1>
    <p class="subtitle">
      @ldesign/notification-vue - Toast / Message / Notification / Modal / Drawer
    </p>

    <!-- Toast 演示 -->
    <section class="section-card">
      <h2 class="section-title">🍞 Toast 轻提示</h2>
      <p class="section-desc">
        轻量级的消息提示，自动消失，适合简单反馈
      </p>
      <div class="button-group">
        <button class="btn success" @click="showToastSuccess">
          成功
        </button>
        <button class="btn error" @click="showToastError">
          错误
        </button>
        <button class="btn warning" @click="showToastWarning">
          警告
        </button>
        <button class="btn info" @click="showToastInfo">
          信息
        </button>
        <button class="btn loading" @click="showToastLoading">
          加载
        </button>
      </div>
    </section>

    <!-- Message 演示 -->
    <section class="section-card">
      <h2 class="section-title">💬 Message 消息</h2>
      <p class="section-desc">
        顶部居中的全局消息提示
      </p>
      <div class="button-group">
        <button class="btn success" @click="showMessageSuccess">
          成功
        </button>
        <button class="btn error" @click="showMessageError">
          错误
        </button>
        <button class="btn warning" @click="showMessageWarning">
          警告
        </button>
        <button class="btn info" @click="showMessageInfo">
          信息
        </button>
      </div>
    </section>

    <!-- Notification 演示 -->
    <section class="section-card">
      <h2 class="section-title">📢 Notification 通知</h2>
      <p class="section-desc">
        带标题和内容的通知框，支持操作按钮
      </p>
      <div class="button-group">
        <button class="btn success" @click="showNotificationSuccess">
          成功通知
        </button>
        <button class="btn error" @click="showNotificationError">
          错误通知
        </button>
        <button class="btn primary" @click="showNotificationWithActions">
          带操作按钮
        </button>
      </div>
    </section>

    <!-- Modal 演示 -->
    <section class="section-card">
      <h2 class="section-title">🪟 Modal 弹窗</h2>
      <p class="section-desc">模态对话框，用于重要信息确认</p>

      <h3 class="subsection-title">基础用法</h3>
      <div class="button-group">
        <button class="btn primary" @click="showConfirmDialog">确认对话框</button>
        <button class="btn warning" @click="showAlertDialog">警告对话框</button>
        <button class="btn info" @click="showPromptDialog">输入对话框</button>
        <button class="btn secondary" @click="showCustomModal">自定义弹窗</button>
      </div>
      <p v-if="promptResult" class="result-box">输入结果: {{ promptResult }}</p>

      <h3 class="subsection-title">动画效果</h3>
      <div class="button-group">
        <button class="btn anim" @click="showAnimationModal('fade')">淡入淡出</button>
        <button class="btn anim" @click="showAnimationModal('scale')">缩放</button>
        <button class="btn anim" @click="showAnimationModal('zoom')">放大</button>
        <button class="btn anim" @click="showAnimationModal('bounce')">弹跳</button>
        <button class="btn anim" @click="showAnimationModal('slide-top')">从上滑入</button>
        <button class="btn anim" @click="showAnimationModal('slide-bottom')">从下滑入</button>
        <button class="btn anim" @click="showAnimationModal('slide-left')">从左滑入</button>
        <button class="btn anim" @click="showAnimationModal('slide-right')">从右滑入</button>
      </div>

      <h3 class="subsection-title">高级功能</h3>
      <div class="button-group">
        <button class="btn feature" @click="maximizableModalVisible = true">可最大化</button>
        <button class="btn feature" @click="draggableModalVisible = true">可拖动</button>
        <button class="btn feature" @click="resizableModalVisible = true">可调整大小</button>
        <button class="btn feature-full" @click="fullFeaturedModalVisible = true">✨ 全能弹窗</button>
      </div>
    </section>

    <!-- Drawer 演示 -->
    <section class="section-card">
      <h2 class="section-title">🗄️ Drawer 抽屉</h2>
      <p class="section-desc">
        从屏幕边缘滑出的抽屉面板
      </p>
      <div class="button-group">
        <button class="btn secondary" @click="showDrawer('left')">
          ← 左侧
        </button>
        <button class="btn secondary" @click="showDrawer('right')">
          右侧 →
        </button>
        <button class="btn secondary" @click="showDrawer('top')">
          ↑ 顶部
        </button>
        <button class="btn secondary" @click="showDrawer('bottom')">
          ↓ 底部
        </button>
        <button class="btn primary" @click="showDrawerWithAPI">
          API 调用
        </button>
        <button class="btn info" @click="showResizableDrawer">
          可调整大小
        </button>
      </div>
    </section>

    <!-- 渲染组件 -->
    <LToast />
    <LMessage />
    <LNotification />
    <!-- 命令式 Modal（用于 modal.confirm/alert/prompt 等 API 调用） -->
    <LModal />
    <!-- 命令式 Drawer（用于 drawer.open 等 API 调用） -->
    <LDrawer />

    <!-- 自定义 Modal -->
    <LModal v-model:visible="modalVisible" title="自定义弹窗" :width="500">
      <div class="custom-modal-content">
        <p>这是一个自定义内容的弹窗组件。</p>
        <p>您可以在这里放置任何内容：</p>
        <ul>
          <li>表单</li>
          <li>详情信息</li>
          <li>图片/视频</li>
          <li>复杂的交互组件</li>
        </ul>
      </div>
      <template #footer>
        <button class="btn secondary" @click="modalVisible = false">取消</button>
        <button class="btn primary" @click="modalVisible = false; toast.success('确认成功')">确认</button>
      </template>
    </LModal>

    <!-- 动画演示 Modal -->
    <LModal v-model:visible="animationModalVisible" :animation="modalAnimation" title="动画效果演示" :width="450" centered>
      <div class="animation-modal-content">
        <div class="animation-badge">{{ modalAnimation }}</div>
        <p>当前使用的动画效果是：<strong>{{ modalAnimation }}</strong></p>
        <p class="animation-desc">点击遮罩或关闭按钮查看关闭动画效果。</p>
      </div>
      <template #footer>
        <button class="btn primary" @click="animationModalVisible = false">关闭</button>
      </template>
    </LModal>

    <!-- 可最大化 Modal -->
    <LModal v-model:visible="maximizableModalVisible" title="可最大化弹窗" :width="500" maximizable centered>
      <div class="feature-modal-content">
        <div class="feature-icon">🔲</div>
        <h3>最大化功能</h3>
        <p>点击标题栏右侧的最大化按钮，可以将弹窗放大到全屏。</p>
        <p class="tip">再次点击可以恢复原始大小。</p>
      </div>
      <template #footer>
        <button class="btn secondary" @click="maximizableModalVisible = false">关闭</button>
      </template>
    </LModal>

    <!-- 可拖动 Modal -->
    <LModal v-model:visible="draggableModalVisible" title="可拖动弹窗" :width="450" draggable>
      <div class="feature-modal-content">
        <div class="feature-icon">✋</div>
        <h3>拖动功能</h3>
        <p>按住标题栏可以拖动弹窗到任意位置。</p>
        <p class="tip">试试拖动我到屏幕的其他位置！</p>
      </div>
      <template #footer>
        <button class="btn secondary" @click="draggableModalVisible = false">关闭</button>
      </template>
    </LModal>

    <!-- 可调整大小 Modal -->
    <LModal v-model:visible="resizableModalVisible" title="可调整大小弹窗" :width="500" resizable centered>
      <div class="feature-modal-content">
        <div class="feature-icon">↔️</div>
        <h3>调整大小功能</h3>
        <p>拖动弹窗右下角可以调整弹窗大小。</p>
        <p class="tip">鼠标移到右下角会出现调整光标。</p>
      </div>
      <template #footer>
        <button class="btn secondary" @click="resizableModalVisible = false">关闭</button>
      </template>
    </LModal>

    <!-- 全能弹窗 -->
    <LModal v-model:visible="fullFeaturedModalVisible" title="✨ 全能弹窗" :width="550" animation="zoom" draggable resizable
      maximizable>
      <div class="full-featured-content">
        <div class="feature-badges">
          <span class="badge badge-drag">可拖动</span>
          <span class="badge badge-resize">可调整大小</span>
          <span class="badge badge-max">可最大化</span>
        </div>
        <p>这是一个集成了所有高级功能的弹窗：</p>
        <ul class="feature-list-modal">
          <li><strong>拖动</strong> - 按住标题栏拖动</li>
          <li><strong>调整大小</strong> - 拖动右下角</li>
          <li><strong>最大化</strong> - 点击标题栏按钮</li>
          <li><strong>缩放动画</strong> - Zoom 动画效果</li>
        </ul>
      </div>
      <template #footer>
        <button class="btn secondary" @click="fullFeaturedModalVisible = false">取消</button>
        <button class="btn primary" @click="fullFeaturedModalVisible = false; toast.success('操作成功！')">
          确认
        </button>
      </template>
    </LModal>

    <!-- Drawer -->
    <LDrawer v-model:visible="drawerVisible" :placement="drawerPlacement" title="抽屉面板">
      <div class="drawer-content">
        <h3>抽屉内容</h3>
        <p>这是从 {{ drawerPlacement }} 方向滑出的抽屉。</p>
        <p>你可以在抽屉中放置：</p>
        <ul>
          <li>导航菜单</li>
          <li>设置面板</li>
          <li>详情信息</li>
          <li>表单</li>
        </ul>
      </div>
      <template #footer>
        <button class="btn secondary" @click="drawerVisible = false">
          关闭
        </button>
      </template>
    </LDrawer>

    <!-- 可调整大小的 Drawer -->
    <LDrawer v-model:visible="resizableDrawerVisible" placement="right" title="可调整大小的抽屉" :width="400" resizable
      :min-width="250" :max-width="800">
      <div class="drawer-content">
        <h3>🔄 拖拽调整大小</h3>
        <p class="tip">
          将鼠标移到抽屉左边缘，出现调整光标后拖拽即可改变宽度。
        </p>
        <div class="feature-list">
          <div class="feature-item">
            <span class="icon">📏</span>
            <div>
              <strong>最小宽度</strong>
              <p>250px</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="icon">📐</span>
            <div>
              <strong>最大宽度</strong>
              <p>800px</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="icon">🎯</span>
            <div>
              <strong>初始宽度</strong>
              <p>400px</p>
            </div>
          </div>
        </div>
        <p class="note">
          调整后的大小会在抽屉关闭后重置为初始值。
        </p>
      </div>
      <template #footer>
        <button class="btn secondary" @click="resizableDrawerVisible = false">
          关闭
        </button>
      </template>
    </LDrawer>
  </div>
</template>

<style scoped>
.notification-demo {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--size-space-lg);
}

.page-title {
  text-align: center;
  color: var(--color-text-primary);
  margin-bottom: var(--size-space-sm);
  font-size: var(--size-font-2xl);
  font-weight: 600;
}

.subtitle {
  text-align: center;
  color: var(--color-text-secondary);
  margin-bottom: var(--size-space-xl);
  font-size: var(--size-font-md);
}

.section-card {
  background: var(--color-bg-container);
  border-radius: var(--size-radius-lg);
  padding: var(--size-space-lg);
  margin-bottom: var(--size-space-lg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-border-secondary);
}

.section-title {
  margin: 0 0 var(--size-space-sm);
  color: var(--color-text-primary);
  font-size: var(--size-font-lg);
  font-weight: 600;
}

.section-desc {
  color: var(--color-text-secondary);
  font-size: var(--size-font-sm);
  margin: 0 0 var(--size-space-md);
}

.subsection-title {
  font-size: var(--size-font-md);
  color: var(--color-text-primary);
  margin: var(--size-space-lg) 0 var(--size-space-md);
  font-weight: 600;
  border-left: 3px solid var(--color-primary-500);
  padding-left: var(--size-space-sm);
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--size-space-md);
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: var(--size-radius-md);
  font-size: var(--size-font-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--color-bg-component);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: var(--color-bg-component-hover);
}

.btn:active {
  transform: translateY(0);
}

.btn.primary {
  background: var(--color-primary-500);
  color: white;
  border-color: var(--color-primary-500);
}

.btn.primary:hover {
  background: var(--color-primary-600);
}

.btn.success {
  background: var(--color-success-500);
  color: white;
  border-color: var(--color-success-500);
}

.btn.success:hover {
  background: var(--color-success-600);
}

.btn.error {
  background: var(--color-error-500);
  color: white;
  border-color: var(--color-error-500);
}

.btn.error:hover {
  background: var(--color-error-600);
}

.btn.warning {
  background: var(--color-warning-500);
  color: white;
  border-color: var(--color-warning-500);
}

.btn.warning:hover {
  background: var(--color-warning-600);
}

.btn.info {
  background: var(--color-info-500);
  color: white;
  border-color: var(--color-info-500);
}

.btn.info:hover {
  background: var(--color-info-600);
}

.btn.loading {
  background: var(--color-text-tertiary);
  color: white;
  border-color: var(--color-text-tertiary);
}

.btn.secondary {
  background: var(--color-bg-page);
  color: var(--color-text-primary);
}

.btn.secondary:hover {
  background: var(--color-bg-hover);
}

.btn.anim {
  background: var(--color-bg-layout);
  border-color: var(--color-primary-200);
  color: var(--color-primary-600);
}

.btn.anim:hover {
  background: var(--color-primary-50);
}

.btn.feature {
  background: var(--color-bg-layout);
  border-color: var(--color-text-tertiary);
  color: var(--color-text-primary);
}

.btn.feature-full {
  background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-info-500) 100%);
  color: white;
  border: none;
}

.result-box {
  margin-top: var(--size-space-md);
  padding: var(--size-space-md);
  background: var(--color-success-bg);
  border-radius: var(--size-radius-md);
  color: var(--color-success-text);
  font-size: var(--size-font-sm);
  border: 1px solid var(--color-success-border);
}

.custom-modal-content,
.drawer-content,
.feature-modal-content,
.full-featured-content,
.animation-modal-content {
  line-height: 1.6;
  color: var(--color-text-primary);
}

.custom-modal-content ul,
.drawer-content ul,
.feature-list-modal {
  margin: var(--size-space-md) 0;
  padding-left: 20px;
}

.custom-modal-content li,
.drawer-content li {
  margin: 4px 0;
  color: var(--color-text-secondary);
}

.drawer-content h3,
.feature-modal-content h3 {
  margin: 0 0 var(--size-space-md);
  color: var(--color-text-primary);
  font-size: var(--size-font-lg);
}

.drawer-content .tip,
.feature-modal-content .tip {
  padding: var(--size-space-md);
  background: var(--color-info-bg);
  border-radius: var(--size-radius-md);
  color: var(--color-info-text);
  margin-bottom: var(--size-space-lg);
  font-size: var(--size-font-sm);
  border: 1px solid var(--color-info-border);
}

.drawer-content .feature-list {
  display: flex;
  flex-direction: column;
  gap: var(--size-space-md);
  margin: var(--size-space-lg) 0;
}

.drawer-content .feature-item {
  display: flex;
  align-items: flex-start;
  gap: var(--size-space-md);
  padding: var(--size-space-md);
  background: var(--color-bg-page);
  border-radius: var(--size-radius-md);
}

.drawer-content .feature-item .icon,
.feature-modal-content .feature-icon {
  font-size: 24px;
  line-height: 1;
}

.feature-modal-content {
  text-align: center;
  padding: var(--size-space-lg) 0;
}

.feature-modal-content .feature-icon {
  font-size: 48px;
  margin-bottom: var(--size-space-md);
}

.drawer-content .feature-item strong {
  display: block;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.drawer-content .feature-item p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--size-font-sm);
}

.drawer-content .note {
  padding: var(--size-space-md);
  background: var(--color-warning-bg);
  border-radius: var(--size-radius-md);
  color: var(--color-warning-text);
  font-size: var(--size-font-sm);
  margin-top: var(--size-space-lg);
  border: 1px solid var(--color-warning-border);
}

.animation-modal-content {
  text-align: center;
  padding: var(--size-space-lg) 0;
}

.animation-badge {
  display: inline-block;
  padding: 4px 12px;
  background: var(--color-primary-100);
  color: var(--color-primary-600);
  border-radius: 20px;
  font-weight: 600;
  margin-bottom: var(--size-space-md);
}

.animation-desc {
  color: var(--color-text-tertiary);
  font-size: var(--size-font-sm);
  margin-top: var(--size-space-md);
}

.feature-badges {
  display: flex;
  justify-content: center;
  gap: var(--size-space-sm);
  margin-bottom: var(--size-space-lg);
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: var(--size-font-xs);
  font-weight: 600;
}

.badge-drag {
  background: #e0f2fe;
  color: #0369a1;
}

.badge-resize {
  background: #f0fdf4;
  color: #15803d;
}

.badge-max {
  background: #f3e8ff;
  color: #7e22ce;
}
</style>
