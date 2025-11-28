<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import type { Dependency, NpmrcConfig } from '../api/dependencies'
import {
  getDependencies,
  installDependency,
  removeDependency,
  upgradeDependency,
  getNpmrcConfig,
  updateNpmrcConfig,
} from '../api/dependencies'

// State
const dependencies = ref<Dependency[]>([])
const loading = ref(false)
const activeTab = ref<'list' | 'npmrc'>('list')
const filterType = ref<'all' | 'dependencies' | 'devDependencies'>('all')
const searchQuery = ref('')

// Add dependency form
const showAddDialog = ref(false)
const addForm = ref({
  name: '',
  version: '',
  type: 'dependencies' as 'dependencies' | 'devDependencies',
})

// Npmrc config
const npmrcConfig = ref<NpmrcConfig>({
  registry: 'https://registry.npmjs.org/',
  scopes: {},
  customConfig: '',
})
const newScope = ref({ name: '', registry: '' })

// Computed
const filteredDependencies = computed(() => {
  let result = dependencies.value

  if (filterType.value !== 'all') {
    result = result.filter(dep => dep.type === filterType.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(dep => 
      dep.name.toLowerCase().includes(query) || 
      dep.description?.toLowerCase().includes(query)
    )
  }

  return result
})

const scopeEntries = computed(() => {
  return Object.entries(npmrcConfig.value.scopes || {})
})

// Methods
async function loadDependencies() {
  loading.value = true
  try {
    dependencies.value = await getDependencies()
  } catch (error) {
    console.error('Failed to load dependencies:', error)
  } finally {
    loading.value = false
  }
}

async function loadNpmrcConfig() {
  try {
    npmrcConfig.value = await getNpmrcConfig()
  } catch (error) {
    console.error('Failed to load npmrc config:', error)
  }
}

async function handleInstall() {
  if (!addForm.value.name) {
    alert('请输入包名 / Please enter package name')
    return
  }

  loading.value = true
  try {
    const result = await installDependency(
      addForm.value.name,
      addForm.value.version || undefined,
      addForm.value.type
    )

    if (result.success) {
      alert('安装成功 / Installed successfully')
      showAddDialog.value = false
      addForm.value = { name: '', version: '', type: 'dependencies' }
      await loadDependencies()
    } else {
      alert(`安装失败 / Installation failed: ${result.message}`)
    }
  } catch (error) {
    console.error('Install error:', error)
    alert('安装失败 / Installation failed')
  } finally {
    loading.value = false
  }
}

async function handleUpgrade(dep: Dependency) {
  if (!dep.latestVersion || dep.currentVersion === dep.latestVersion) {
    return
  }

  if (!confirm(`确定要升级 ${dep.name} 到 ${dep.latestVersion} 吗？\nUpgrade ${dep.name} to ${dep.latestVersion}?`)) {
    return
  }

  loading.value = true
  try {
    const result = await upgradeDependency(dep.name, dep.latestVersion)
    if (result.success) {
      alert('升级成功 / Upgraded successfully')
      await loadDependencies()
    } else {
      alert(`升级失败 / Upgrade failed: ${result.message}`)
    }
  } catch (error) {
    console.error('Upgrade error:', error)
    alert('升级失败 / Upgrade failed')
  } finally {
    loading.value = false
  }
}

async function handleRemove(dep: Dependency) {
  if (!confirm(`确定要删除 ${dep.name} 吗？\nRemove ${dep.name}?`)) {
    return
  }

  loading.value = true
  try {
    const result = await removeDependency(dep.name)
    if (result.success) {
      alert('删除成功 / Removed successfully')
      await loadDependencies()
    } else {
      alert(`删除失败 / Remove failed: ${result.message}`)
    }
  } catch (error) {
    console.error('Remove error:', error)
    alert('删除失败 / Remove failed')
  } finally {
    loading.value = false
  }
}

function addScope() {
  if (!newScope.value.name || !newScope.value.registry) {
    alert('请填写完整的scope信息 / Please fill in complete scope info')
    return
  }

  if (!npmrcConfig.value.scopes) {
    npmrcConfig.value.scopes = {}
  }

  npmrcConfig.value.scopes[newScope.value.name] = newScope.value.registry
  newScope.value = { name: '', registry: '' }
}

function removeScope(scopeName: string) {
  if (npmrcConfig.value.scopes) {
    delete npmrcConfig.value.scopes[scopeName]
  }
}

async function saveNpmrcConfig() {
  loading.value = true
  try {
    const result = await updateNpmrcConfig(npmrcConfig.value)
    if (result.success) {
      alert('配置保存成功 / Configuration saved successfully')
    } else {
      alert(`保存失败 / Save failed: ${result.message}`)
    }
  } catch (error) {
    console.error('Save npmrc error:', error)
    alert('保存失败 / Save failed')
  } finally {
    loading.value = false
  }
}

function hasUpdate(dep: Dependency): boolean {
  return !!dep.latestVersion && 
         !!dep.currentVersion && 
         dep.latestVersion !== dep.currentVersion &&
         dep.version !== 'workspace:*'
}

onMounted(() => {
  loadDependencies()
  loadNpmrcConfig()
})
</script>

<template>
  <div class="dependency-management">
    <div class="header">
      <h1>📦 依赖管理 / Dependency Management</h1>
      <router-link to="/">
        <button class="btn btn-secondary">← 返回 / Back</button>
      </router-link>
    </div>

    <div class="tabs">
      <button 
        class="tab" 
        :class="{ active: activeTab === 'list' }"
        @click="activeTab = 'list'"
      >
        📋 依赖列表 / Dependencies
      </button>
      <button 
        class="tab" 
        :class="{ active: activeTab === 'npmrc' }"
        @click="activeTab = 'npmrc'"
      >
        ⚙️ .npmrc 配置 / .npmrc Config
      </button>
    </div>

    <!-- Dependencies List Tab -->
    <div v-if="activeTab === 'list'" class="tab-content">
      <div class="toolbar">
        <div class="search-bar">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="🔍 搜索依赖... / Search dependencies..."
            class="search-input"
          >
        </div>
        <div class="filters">
          <button
            class="filter-btn"
            :class="{ active: filterType === 'all' }"
            @click="filterType = 'all'"
          >
            全部 / All
          </button>
          <button
            class="filter-btn"
            :class="{ active: filterType === 'dependencies' }"
            @click="filterType = 'dependencies'"
          >
            生产依赖 / Dependencies
          </button>
          <button
            class="filter-btn"
            :class="{ active: filterType === 'devDependencies' }"
            @click="filterType = 'devDependencies'"
          >
            开发依赖 / DevDependencies
          </button>
        </div>
        <button class="btn btn-primary" @click="showAddDialog = true">
          ➕ 添加依赖 / Add Dependency
        </button>
      </div>

      <div v-if="loading" class="loading">
        加载中... / Loading...
      </div>

      <div v-else class="dependencies-grid">
        <div
          v-for="dep in filteredDependencies"
          :key="dep.name"
          class="dependency-card"
        >
          <div class="dep-header">
            <h3 class="dep-name">{{ dep.name }}</h3>
            <span class="dep-type-badge" :class="dep.type">
              {{ dep.type === 'dependencies' ? '生产' : '开发' }}
            </span>
          </div>

          <p v-if="dep.description" class="dep-description">
            {{ dep.description }}
          </p>

          <div class="dep-versions">
            <div class="version-info">
              <span class="label">配置版本:</span>
              <code>{{ dep.version }}</code>
            </div>
            <div class="version-info">
              <span class="label">当前版本:</span>
              <code>{{ dep.currentVersion || 'N/A' }}</code>
            </div>
            <div class="version-info">
              <span class="label">最新版本:</span>
              <code :class="{ 'has-update': hasUpdate(dep) }">
                {{ dep.latestVersion || 'N/A' }}
              </code>
            </div>
          </div>

          <div class="dep-actions">
            <button
              v-if="hasUpdate(dep)"
              class="btn btn-sm btn-primary"
              @click="handleUpgrade(dep)"
              :disabled="loading"
            >
              ⬆️ 升级 / Upgrade
            </button>
            <button
              class="btn btn-sm btn-danger"
              @click="handleRemove(dep)"
              :disabled="loading"
            >
              🗑️ 删除 / Remove
            </button>
          </div>
        </div>
      </div>

      <div v-if="!loading && filteredDependencies.length === 0" class="empty-state">
        <p>暂无依赖 / No dependencies found</p>
      </div>
    </div>

    <!-- .npmrc Config Tab -->
    <div v-if="activeTab === 'npmrc'" class="tab-content npmrc-config">
      <div class="config-section">
        <h2>🌐 默认源 / Default Registry</h2>
        <div class="form-group">
          <label>Registry URL:</label>
          <input
            v-model="npmrcConfig.registry"
            type="text"
            class="form-input"
            placeholder="https://registry.npmjs.org/"
          >
        </div>
        <div class="registry-presets">
          <button 
            class="preset-btn"
            @click="npmrcConfig.registry = 'https://registry.npmjs.org/'"
          >
            npm 官方
          </button>
          <button 
            class="preset-btn"
            @click="npmrcConfig.registry = 'https://registry.npmmirror.com/'"
          >
            淘宝镜像
          </button>
          <button 
            class="preset-btn"
            @click="npmrcConfig.registry = 'https://registry.yarnpkg.com/'"
          >
            Yarn
          </button>
        </div>
      </div>

      <div class="config-section">
        <h2>🎯 Scope 配置 / Scope Configuration</h2>
        <p class="hint">为特定的包 scope 指定源 / Specify registry for specific package scopes</p>
        
        <div class="scope-list">
          <div
            v-for="[scopeName, registry] in scopeEntries"
            :key="scopeName"
            class="scope-item"
          >
            <div class="scope-info">
              <code>@{{ scopeName }}</code>
              <span class="arrow">→</span>
              <span class="registry-url">{{ registry }}</span>
            </div>
            <button
              class="btn btn-sm btn-danger"
              @click="removeScope(scopeName)"
            >
              删除
            </button>
          </div>
        </div>

        <div class="add-scope-form">
          <input
            v-model="newScope.name"
            type="text"
            class="form-input"
            placeholder="scope 名称 (例如: ldesign)"
          >
          <input
            v-model="newScope.registry"
            type="text"
            class="form-input"
            placeholder="Registry URL"
          >
          <button class="btn btn-primary" @click="addScope">
            ➕ 添加 Scope
          </button>
        </div>
      </div>

      <div class="config-section">
        <h2>📝 自定义配置 / Custom Configuration</h2>
        <p class="hint">
          直接编辑 .npmrc 内容 / Edit .npmrc content directly
        </p>
        <textarea
          v-model="npmrcConfig.customConfig"
          class="config-textarea"
          rows="10"
          placeholder="# 在此处添加自定义配置&#10;# Add custom configuration here&#10;&#10;# 例如 / Example:&#10;# always-auth=true&#10;# strict-ssl=false"
        />
      </div>

      <div class="config-actions">
        <button
          class="btn btn-primary btn-large"
          @click="saveNpmrcConfig"
          :disabled="loading"
        >
          💾 保存配置 / Save Configuration
        </button>
        <button
          class="btn btn-secondary btn-large"
          @click="loadNpmrcConfig"
          :disabled="loading"
        >
          🔄 重新加载 / Reload
        </button>
      </div>
    </div>

    <!-- Add Dependency Dialog -->
    <div v-if="showAddDialog" class="modal-overlay" @click="showAddDialog = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>➕ 添加依赖 / Add Dependency</h2>
          <button class="close-btn" @click="showAddDialog = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>包名 / Package Name: *</label>
            <input
              v-model="addForm.name"
              type="text"
              class="form-input"
              placeholder="例如: lodash"
              @keyup.enter="handleInstall"
            >
          </div>
          <div class="form-group">
            <label>版本 / Version:</label>
            <input
              v-model="addForm.version"
              type="text"
              class="form-input"
              placeholder="例如: ^4.17.21 (留空安装最新版)"
              @keyup.enter="handleInstall"
            >
          </div>
          <div class="form-group">
            <label>类型 / Type:</label>
            <select v-model="addForm.type" class="form-select">
              <option value="dependencies">生产依赖 / Dependencies</option>
              <option value="devDependencies">开发依赖 / DevDependencies</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showAddDialog = false">
            取消 / Cancel
          </button>
          <button class="btn btn-primary" @click="handleInstall" :disabled="loading">
            安装 / Install
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dependency-management {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  margin: 0;
  font-size: 2rem;
  color: var(--color-text-primary, #2c3e50);
}

/* Tabs */
.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--color-border, #e5e7eb);
}

.tab {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text-secondary, #6b7280);
  transition: all 0.2s;
}

.tab:hover {
  color: var(--color-primary-default, #3b82f6);
  background: var(--color-bg-container-secondary, #f3f4f6);
}

.tab.active {
  color: var(--color-primary-default, #3b82f6);
  border-bottom-color: var(--color-primary-default, #3b82f6);
}

/* Tab Content */
.tab-content {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Toolbar */
.toolbar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
}

.search-bar {
  flex: 1;
  min-width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary-default, #3b82f6);
}

.filters {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 2px solid var(--color-border, #e5e7eb);
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: var(--color-primary-default, #3b82f6);
  color: var(--color-primary-default, #3b82f6);
}

.filter-btn.active {
  background: var(--color-primary-default, #3b82f6);
  color: white;
  border-color: var(--color-primary-default, #3b82f6);
}

/* Dependencies Grid */
.dependencies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.dependency-card {
  padding: 1.5rem;
  background: white;
  border: 2px solid var(--color-border, #e5e7eb);
  border-radius: 12px;
  transition: all 0.3s;
}

.dependency-card:hover {
  border-color: var(--color-primary-default, #3b82f6);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

.dep-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.dep-name {
  margin: 0;
  font-size: 1.1rem;
  color: var(--color-text-primary, #2c3e50);
  word-break: break-word;
}

.dep-type-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.dep-type-badge.dependencies {
  background: #dbeafe;
  color: #1e40af;
}

.dep-type-badge.devDependencies {
  background: #fef3c7;
  color: #92400e;
}

.dep-description {
  font-size: 0.9rem;
  color: var(--color-text-secondary, #6b7280);
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.dep-versions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: var(--color-bg-container-secondary, #f9fafb);
  border-radius: 8px;
}

.version-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.version-info .label {
  color: var(--color-text-secondary, #6b7280);
  font-weight: 500;
}

.version-info code {
  padding: 0.25rem 0.5rem;
  background: white;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 0.85rem;
}

.version-info code.has-update {
  background: #dcfce7;
  border-color: #16a34a;
  color: #15803d;
  font-weight: 600;
}

.dep-actions {
  display: flex;
  gap: 0.5rem;
}

/* Loading */
.loading {
  text-align: center;
  padding: 3rem;
  font-size: 1.1rem;
  color: var(--color-text-secondary, #6b7280);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-tertiary, #9ca3af);
}

/* Npmrc Config */
.npmrc-config {
  max-width: 900px;
}

.config-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border: 2px solid var(--color-border, #e5e7eb);
  border-radius: 12px;
}

.config-section h2 {
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
  color: var(--color-text-primary, #2c3e50);
}

.hint {
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: var(--color-text-secondary, #6b7280);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text-primary, #374151);
}

.form-input, .form-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: var(--color-primary-default, #3b82f6);
}

.registry-presets {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.preset-btn {
  padding: 0.5rem 1rem;
  background: var(--color-bg-container-secondary, #f3f4f6);
  border: 2px solid var(--color-border, #e5e7eb);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.preset-btn:hover {
  background: var(--color-primary-default, #3b82f6);
  color: white;
  border-color: var(--color-primary-default, #3b82f6);
}

/* Scope List */
.scope-list {
  margin-bottom: 1rem;
}

.scope-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background: var(--color-bg-container-secondary, #f9fafb);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
}

.scope-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.scope-info code {
  padding: 0.25rem 0.5rem;
  background: white;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 4px;
  font-weight: 600;
  color: var(--color-primary-default, #3b82f6);
}

.arrow {
  color: var(--color-text-tertiary, #9ca3af);
}

.registry-url {
  color: var(--color-text-secondary, #6b7280);
  font-size: 0.9rem;
}

.add-scope-form {
  display: grid;
  grid-template-columns: 1fr 2fr auto;
  gap: 0.5rem;
  align-items: end;
}

.config-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 0.9rem;
  resize: vertical;
  transition: border-color 0.2s;
}

.config-textarea:focus {
  outline: none;
  border-color: var(--color-primary-default, #3b82f6);
}

.config-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 2px solid var(--color-border, #e5e7eb);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  padding: 0.5rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-text-tertiary, #9ca3af);
  transition: color 0.2s;
}

.close-btn:hover {
  color: var(--color-text-primary, #2c3e50);
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 2px solid var(--color-border, #e5e7eb);
}

/* Buttons */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--color-primary-default, #3b82f6);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-hover, #2563eb);
}

.btn-secondary {
  background: var(--color-bg-container-secondary, #f3f4f6);
  color: var(--color-text-primary, #374151);
  border: 2px solid var(--color-border, #e5e7eb);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--color-bg-container-tertiary, #e5e7eb);
}

.btn-danger {
  background: var(--color-danger-default, #ef4444);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .dependencies-grid {
    grid-template-columns: 1fr;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-bar {
    min-width: 100%;
  }

  .filters {
    flex-wrap: wrap;
  }

  .add-scope-form {
    grid-template-columns: 1fr;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
