<script setup lang="ts">
/**
 * 系统功能演示页面
 * 展示 @ldesign/permission-vue 的功能
 */
import { ref } from 'vue'
import {
  usePermission,
  PermissionCheck,
  useEnvironment,
  useBrowserFeatures
} from '@ldesign/permission-vue'
import {
  Settings,
  Shield,
  Database,
  Globe,
  CheckCircle,
  XCircle
} from 'lucide-vue-next'

// 权限控制
const { hasPermission, setPermissions, setRoles } = usePermission()
const currentRole = ref('admin')

// 环境变量
const env = useEnvironment()

// 浏览器特性
const browserFeatures = useBrowserFeatures()

// 模拟权限更新
function updatePermissions() {
  console.log('切换角色:', currentRole.value)
  if (currentRole.value === 'admin') {
    setRoles(['admin'])
    setPermissions(['system:settings:view', 'system:user:add', 'post:edit', 'post:delete', 'post:view'])
  } else if (currentRole.value === 'editor') {
    setRoles(['editor'])
    setPermissions(['post:edit', 'post:view'])
  } else if (currentRole.value === 'user') {
    setRoles(['user'])
    setPermissions(['post:view'])
  } else {
    setRoles(['guest'])
    setPermissions([])
  }
}

// 初始化默认权限
updatePermissions()
</script>

<template>
  <div class="system-demo page-container">
    <div class="page-header section-card">
      <div class="header-content">
        <div class="header-icon">
          <Settings class="icon-hero" />
        </div>
        <div>
          <h1 class="page-title">系统功能演示</h1>
          <p class="page-desc">展示 @ldesign/permission-vue 的权限控制、环境变量访问和浏览器特性检测。</p>
        </div>
      </div>
    </div>

    <!-- 权限控制 -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">
          <Shield class="section-icon" />
          权限控制
        </h2>
      </div>
      <div class="demo-content">
        <div class="role-selector mb-md">
          <span class="label">当前角色:</span>
          <select v-model="currentRole" class="select-input" @change="updatePermissions">
            <option value="admin">管理员 (admin)</option>
            <option value="editor">编辑 (editor)</option>
            <option value="user">普通用户 (user)</option>
            <option value="guest">访客 (guest)</option>
          </select>
        </div>

        <div class="permission-checks grid-layout-small">
          <div class="check-item card-light">
            <h3 class="item-title">v-permission 指令</h3>
            <div class="demo-box">
              <button v-permission="['system:settings:view']" class="action-btn primary btn-sm">
                仅管理员可见
              </button>
              <button v-permission="['post:edit']" class="action-btn secondary btn-sm">
                编辑权限可见
              </button>
              <button v-permission="['post:view']" class="action-btn info btn-sm">
                查看权限可见
              </button>
            </div>
          </div>

          <div class="check-item card-light">
            <h3 class="item-title">组件式鉴权</h3>
            <div class="demo-box">
              <PermissionCheck :value="['system:user:add']">
                <div class="success-badge">拥有添加用户权限</div>
                <template #fallback>
                  <div class="error-badge">无添加用户权限</div>
                </template>
              </PermissionCheck>
            </div>
          </div>

          <div class="check-item card-light">
            <h3 class="item-title">函数式鉴权</h3>
            <div class="demo-box">
              <p>
                hasPermission('post:delete'):
                <strong :class="hasPermission(['post:delete']) ? 'text-success' : 'text-error'">
                  {{ hasPermission(['post:delete']) }}
                </strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid-layout">
      <!-- 环境变量 -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">
            <Database class="section-icon" />
            环境变量
          </h2>
        </div>
        <div class="info-list">
          <div class="info-row">
            <span class="label">MODE:</span>
            <span class="value">{{ env.MODE }}</span>
          </div>
          <div class="info-row">
            <span class="label">BASE_URL:</span>
            <span class="value">{{ env.BASE_URL }}</span>
          </div>
          <div class="info-row">
            <span class="label">PROD:</span>
            <span class="value">{{ env.PROD }}</span>
          </div>
          <div class="info-row">
            <span class="label">DEV:</span>
            <span class="value">{{ env.DEV }}</span>
          </div>
        </div>
      </div>

      <!-- 浏览器特性 -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">
            <Globe class="section-icon" />
            浏览器特性
          </h2>
        </div>
        <div class="feature-grid">
          <div class="feature-item" :class="{ supported: browserFeatures.cookie }">
            <component :is="browserFeatures.cookie ? CheckCircle : XCircle" class="status-icon" />
            Cookie
          </div>
          <div class="feature-item" :class="{ supported: browserFeatures.localStorage }">
            <component :is="browserFeatures.localStorage ? CheckCircle : XCircle" class="status-icon" />
            LocalStorage
          </div>
          <div class="feature-item" :class="{ supported: browserFeatures.sessionStorage }">
            <component :is="browserFeatures.sessionStorage ? CheckCircle : XCircle" class="status-icon" />
            SessionStorage
          </div>
          <div class="feature-item" :class="{ supported: browserFeatures.serviceWorker }">
            <component :is="browserFeatures.serviceWorker ? CheckCircle : XCircle" class="status-icon" />
            ServiceWorker
          </div>
          <div class="feature-item" :class="{ supported: browserFeatures.geolocation }">
            <component :is="browserFeatures.geolocation ? CheckCircle : XCircle" class="status-icon" />
            Geolocation
          </div>
          <div class="feature-item" :class="{ supported: browserFeatures.notification }">
            <component :is="browserFeatures.notification ? CheckCircle : XCircle" class="status-icon" />
            Notification
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.system-demo {
  max-width: 1000px;
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

.page-desc code {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
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

.grid-layout-small {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--size-space-md);
}

/* Form Controls */
.role-selector {
  display: flex;
  align-items: center;
  gap: var(--size-space-md);
}

.label {
  font-weight: 500;
  color: var(--color-text-secondary);
}

.select-input {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--size-radius-md);
  background: var(--color-bg-container);
  color: var(--color-text-primary);
  min-width: 200px;
}

/* Cards */
.card-light {
  background: var(--color-bg-page);
  padding: var(--size-space-md);
  border-radius: var(--size-radius-md);
  border: 1px solid var(--color-border);
}

.item-title {
  font-size: var(--size-font-md);
  font-weight: 600;
  margin: 0 0 var(--size-space-sm);
  color: var(--color-text-primary);
}

.demo-box {
  display: flex;
  flex-wrap: wrap;
  gap: var(--size-space-sm);
  align-items: center;
}

/* Buttons */
.action-btn {
  padding: 6px 12px;
  border-radius: var(--size-radius-md);
  border: none;
  font-size: var(--size-font-sm);
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  color: var(--color-text-primary);
  background: var(--color-bg-container);
  border: 1px solid var(--color-border);
}

.action-btn:hover {
  transform: translateY(-1px);
}

.btn-sm {
  font-size: var(--size-font-xs);
}

.action-btn.primary {
  background: var(--color-primary-500);
  color: white;
  border-color: var(--color-primary-500);
}

.action-btn.secondary {
  background: var(--color-bg-page);
}

.action-btn.info {
  background: var(--color-info-50);
  color: var(--color-info-600);
  border-color: var(--color-info-200);
}

/* Badges */
.success-badge {
  padding: 4px 8px;
  background: var(--color-success-bg);
  color: var(--color-success-500);
  border-radius: var(--size-radius-sm);
  font-size: var(--size-font-xs);
  border: 1px solid var(--color-success-border);
}

.error-badge {
  padding: 4px 8px;
  background: var(--color-error-bg);
  color: var(--color-error-500);
  border-radius: var(--size-radius-sm);
  font-size: var(--size-font-xs);
  border: 1px solid var(--color-error-border);
}

.text-success { color: var(--color-success-500); }
.text-error { color: var(--color-error-500); }

/* Info List */
.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed var(--color-border);
}

.info-row:last-child { border-bottom: none; }

.value {
  font-family: monospace;
  color: var(--color-primary-500);
  font-weight: 600;
}

/* Feature Grid */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--size-space-md);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: var(--color-bg-page);
  border-radius: var(--size-radius-md);
  font-size: var(--size-font-sm);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.feature-item.supported {
  color: var(--color-success-500);
  border-color: var(--color-success-border);
  background: var(--color-success-bg);
}

.status-icon {
  width: 16px;
  height: 16px;
}

.mb-md { margin-bottom: var(--size-space-md); }

@media (max-width: 768px) {
  .system-demo { padding: var(--size-space-md); }
  .header-content { flex-direction: column; text-align: center; }
  .grid-layout { grid-template-columns: 1fr; }
  .feature-grid { grid-template-columns: 1fr; }
}
</style>