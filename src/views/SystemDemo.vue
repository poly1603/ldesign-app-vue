<script setup lang="ts">
/**
 * 系统功能演示页面
 * 展示 @ldesign/permission-vue 的功能
 */
import { ref, onMounted } from 'vue'
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
  XCircle,
  Lock,
  Eye,
  Trash2,
  Code
} from 'lucide-vue-next'

// 权限控制
const { hasPermission, setPermissions, setRoles } = usePermission()
const currentRole = ref('admin')

// 环境变量
const env = useEnvironment()

// 浏览器特性
const browserFeatures = useBrowserFeatures()
const mounted = ref(false)

// 模拟权限更新
function updatePermissions() {
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

onMounted(() => {
  updatePermissions()
  setTimeout(() => mounted.value = true, 100)
})
</script>

<template>
  <div class="page-container" :class="{ 'is-mounted': mounted }">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-bg">
        <div class="hero-gradient" />
        <div class="hero-pattern" />
        <div class="hero-orbs">
          <div class="orb orb-1" />
          <div class="orb orb-2" />
        </div>
      </div>
      <div class="hero-content">
        <span class="hero-badge">
          <Settings class="w-3.5 h-3.5" />
          System
        </span>
        <h1 class="hero-title">系统功能</h1>
        <p class="hero-subtitle">
          集成权限控制、环境变量访问及浏览器特性检测，为应用提供底层能力支持。
        </p>
      </div>
    </section>

    <div class="main-grid">
      <!-- 权限控制 -->
      <section class="demo-card permission-card">
        <div class="card-header">
          <div class="icon-wrapper primary">
            <Shield class="w-5 h-5" />
          </div>
          <div>
            <h2 class="card-title">权限控制</h2>
            <p class="card-desc">基于角色的动态权限管理</p>
          </div>
        </div>
        
        <div class="card-body">
          <div class="role-selector">
            <label class="input-label">切换模拟角色</label>
            <div class="select-wrapper">
              <select v-model="currentRole" class="custom-select" @change="updatePermissions">
                <option value="admin">👑 管理员 (All Permissions)</option>
                <option value="editor">✏️ 编辑 (Edit & View)</option>
                <option value="user">👤 普通用户 (View Only)</option>
                <option value="guest">👻 访客 (No Permissions)</option>
              </select>
            </div>
          </div>

          <div class="permission-demos">
            <div class="demo-item">
              <h3 class="demo-label">指令控制 (v-permission)</h3>
              <div class="button-row">
                <button v-permission="['system:settings:view']" class="btn btn-primary">
                  <Settings class="w-4 h-4 mr-1" /> 管理员设置
                </button>
                <button v-permission="['post:edit']" class="btn btn-secondary">
                  <Code class="w-4 h-4 mr-1" /> 编辑文章
                </button>
                <button v-permission="['post:view']" class="btn btn-outline">
                  <Eye class="w-4 h-4 mr-1" /> 查看文章
                </button>
              </div>
              <p class="demo-hint" v-if="currentRole === 'guest'">* 访客模式下上述按钮均不可见</p>
            </div>

            <div class="demo-item">
              <h3 class="demo-label">组件控制 (PermissionCheck)</h3>
              <div class="check-box">
                <PermissionCheck :value="['system:user:add']">
                  <div class="status-badge success">
                    <CheckCircle class="w-4 h-4" /> 拥有添加用户权限
                  </div>
                  <template #fallback>
                    <div class="status-badge error">
                      <Lock class="w-4 h-4" /> 无添加用户权限
                    </div>
                  </template>
                </PermissionCheck>
              </div>
            </div>

            <div class="demo-item">
              <h3 class="demo-label">函数控制 (hasPermission)</h3>
              <div class="code-display">
                <span class="code-label">hasPermission('post:delete')</span>
                <span class="code-value" :class="hasPermission(['post:delete']) ? 'text-green' : 'text-red'">
                  {{ hasPermission(['post:delete']) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="side-column">
        <!-- 环境变量 -->
        <section class="demo-card">
          <div class="card-header">
            <div class="icon-wrapper info">
              <Database class="w-5 h-5" />
            </div>
            <div>
              <h2 class="card-title">环境变量</h2>
              <p class="card-desc">Vite 注入的环境配置</p>
            </div>
          </div>
          <div class="env-list">
            <div class="env-item">
              <span class="env-key">MODE</span>
              <span class="env-value badge">{{ env.MODE }}</span>
            </div>
            <div class="env-item">
              <span class="env-key">BASE_URL</span>
              <span class="env-value">{{ env.BASE_URL }}</span>
            </div>
            <div class="env-item">
              <span class="env-key">PROD</span>
              <span class="env-value" :class="env.PROD ? 'text-green' : 'text-gray'">{{ env.PROD }}</span>
            </div>
            <div class="env-item">
              <span class="env-key">DEV</span>
              <span class="env-value" :class="env.DEV ? 'text-green' : 'text-gray'">{{ env.DEV }}</span>
            </div>
          </div>
        </section>

        <!-- 浏览器特性 -->
        <section class="demo-card">
          <div class="card-header">
            <div class="icon-wrapper success">
              <Globe class="w-5 h-5" />
            </div>
            <div>
              <h2 class="card-title">浏览器特性</h2>
              <p class="card-desc">当前环境支持能力检测</p>
            </div>
          </div>
          <div class="feature-grid">
            <div class="feature-tag" :class="{ active: browserFeatures.cookie }">
              Cookie
            </div>
            <div class="feature-tag" :class="{ active: browserFeatures.localStorage }">
              LocalStorage
            </div>
            <div class="feature-tag" :class="{ active: browserFeatures.sessionStorage }">
              SessionStorage
            </div>
            <div class="feature-tag" :class="{ active: browserFeatures.serviceWorker }">
              ServiceWorker
            </div>
            <div class="feature-tag" :class="{ active: browserFeatures.geolocation }">
              Geolocation
            </div>
            <div class="feature-tag" :class="{ active: browserFeatures.notification }">
              Notification
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 继承首页风格变量 */
.page-container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-container.is-mounted {
  opacity: 1;
  transform: translateY(0);
}

/* Hero Section */
.hero-section {
  position: relative;
  padding: 48px 40px;
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 32px;
  background: linear-gradient(135deg, var(--color-primary-600, #4f46e5) 0%, var(--color-primary-900, #312e81) 100%);
  color: white;
  box-shadow: 0 20px 40px -10px rgba(79, 70, 229, 0.3);
}

.hero-bg {
  position: absolute;
  inset: 0;
}

.hero-pattern {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.hero-orbs .orb {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  filter: blur(40px);
  animation: float 10s infinite ease-in-out;
}

.orb-1 { width: 300px; height: 300px; top: -100px; right: -50px; }
.orb-2 { width: 200px; height: 200px; bottom: -50px; left: 10%; animation-delay: -5s; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border-radius: 99px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 12px;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 16px;
  opacity: 0.85;
  max-width: 600px;
  line-height: 1.6;
}

/* Layout */
.main-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}

.side-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Card Style */
.demo-card {
  background: var(--color-bg-container, #fff);
  border: 1px solid var(--color-border-secondary, #e5e7eb);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.demo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.08);
  border-color: var(--color-primary-200, #bfdbfe);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border-secondary, #f3f4f6);
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper.primary { background: var(--color-primary-50, #eff6ff); color: var(--color-primary-600, #2563eb); }
.icon-wrapper.info { background: var(--color-info-50, #f0f9ff); color: var(--color-info-600, #0284c7); }
.icon-wrapper.success { background: var(--color-success-50, #f0fdf4); color: var(--color-success-600, #16a34a); }

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary, #1f2937);
  margin: 0;
}

.card-desc {
  font-size: 13px;
  color: var(--color-text-tertiary, #9ca3af);
  margin: 4px 0 0;
}

/* Role Selector */
.input-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.select-wrapper {
  position: relative;
}

.custom-select {
  width: 100%;
  padding: 10px 16px;
  background: var(--color-bg-layout);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text-primary);
  font-size: 14px;
  transition: all 0.2s;
  cursor: pointer;
  appearance: none;
}

.custom-select:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-100);
}

/* Permission Demos */
.permission-demos {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 24px;
}

.demo-item {
  background: var(--color-bg-layout);
  padding: 16px;
  border-radius: 12px;
  border: 1px dashed var(--color-border);
}

.demo-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.button-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary { background: var(--color-primary-600); color: white; }
.btn-primary:hover { background: var(--color-primary-700); }

.btn-secondary { background: white; border-color: var(--color-border); color: var(--color-text-primary); }
.btn-secondary:hover { border-color: var(--color-primary-200); color: var(--color-primary-600); }

.btn-outline { background: transparent; border: 1px dashed var(--color-border); color: var(--color-text-secondary); }
.btn-outline:hover { border-color: var(--color-text-secondary); color: var(--color-text-primary); }

.demo-hint {
  font-size: 12px;
  color: var(--color-warning-600);
  margin-top: 8px;
}

/* Status Badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
}

.status-badge.success { background: var(--color-success-50); color: var(--color-success-700); }
.status-badge.error { background: var(--color-error-50); color: var(--color-error-700); }

/* Code Display */
.code-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.code-label { font-family: monospace; font-size: 13px; color: var(--color-text-secondary); }
.code-value { font-family: monospace; font-weight: 600; font-size: 13px; }
.text-green { color: var(--color-success-600); }
.text-red { color: var(--color-error-600); }
.text-gray { color: var(--color-text-tertiary); }

/* Environment List */
.env-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.env-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px dashed var(--color-border-secondary);
}

.env-item:last-child { border-bottom: none; padding-bottom: 0; }

.env-key {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.env-value {
  font-family: monospace;
  font-size: 13px;
  color: var(--color-text-primary);
}

.env-value.badge {
  background: var(--color-primary-50);
  color: var(--color-primary-700);
  padding: 2px 8px;
  border-radius: 4px;
}

/* Feature Grid */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.feature-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: var(--color-bg-layout);
  border-radius: 8px;
  font-size: 13px;
  color: var(--color-text-tertiary);
  border: 1px solid transparent;
  transition: all 0.2s;
}

.feature-tag.active {
  background: var(--color-success-50);
  color: var(--color-success-700);
  border-color: var(--color-success-200);
  font-weight: 500;
}
</style>