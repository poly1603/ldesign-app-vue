<script setup lang="ts">
/**
 * 书签功能演示页面
 * 展示 LDesign 书签系统的完整功能
 */
import type { BookmarkItem } from '@ldesign/bookmark-vue'
import { BookmarkBar, useBookmarkStore } from '@ldesign/bookmark-vue'
import { ref, computed, h } from 'vue'
import {
  Home,
  Wrench,
  Github,
  Monitor,
  Package,
  Book,
  FileCode,
  Settings,
  Bookmark,
  Plus,
  FolderOpen,
  Folder,
  Layout,
  Moon,
  Sun,
  MousePointer2,
  Activity
} from 'lucide-vue-next'

// 示例书签数据
const sampleBookmarks: BookmarkItem[] = [
  {
    id: 'home',
    type: 'bookmark',
    title: '首页',
    url: '/',
    icon: h(Home),
    pinned: true,
  },
  {
    id: 'folder-dev',
    type: 'folder',
    title: '开发工具',
    icon: h(Wrench),
    children: [
      {
        id: 'github',
        type: 'bookmark',
        title: 'GitHub',
        url: 'https://github.com',
        icon: h(Github),
      },
      {
        id: 'vscode',
        type: 'bookmark',
        title: 'VS Code',
        url: 'https://code.visualstudio.com',
        icon: h(Monitor),
      },
      { type: 'separator' },
      {
        id: 'npm',
        type: 'bookmark',
        title: 'NPM',
        url: 'https://npmjs.com',
        icon: h(Package),
      },
    ],
  },
  {
    id: 'folder-docs',
    type: 'folder',
    title: '文档',
    icon: h(Book),
    children: [
      {
        id: 'vue-docs',
        type: 'bookmark',
        title: 'Vue 3 文档',
        url: 'https://vuejs.org',
        icon: h(FileCode),
      },
      {
        id: 'ts-docs',
        type: 'bookmark',
        title: 'TypeScript 文档',
        url: 'https://typescriptlang.org',
        icon: h(FileCode),
      },
    ],
  },
  {
    id: 'settings',
    type: 'bookmark',
    title: '设置',
    url: '/settings',
    icon: h(Settings),
  },
]

// 书签栏引用
const bookmarkBarRef = ref<InstanceType<typeof BookmarkBar> | null>(null)

// 当前模式
const mode = ref<'horizontal' | 'vertical'>('horizontal')

// 当前主题
const theme = ref<'light' | 'dark'>('light')

// 是否可拖拽
const draggable = ref(true)

// 选中的书签
const selectedBookmark = ref<BookmarkItem | null>(null)

// 使用书签存储
const store = useBookmarkStore({
  items: sampleBookmarks,
  persistent: true,
  storageKey: 'demo-bookmarks',
})

/**
 * 处理书签选中
 */
function handleSelect(item: BookmarkItem): void {
  selectedBookmark.value = item
  console.log('选中书签:', item)
}

/**
 * 处理右键菜单
 */
function handleContextMenu(item: BookmarkItem, event: MouseEvent): void {
  console.log('右键菜单:', item, event)
}

/**
 * 添加新书签
 */
function addBookmark(): void {
  const newBookmark = store.add({
    type: 'bookmark',
    title: `新书签 ${Date.now()}`,
    url: 'https://example.com',
    icon: h(Bookmark),
  })
  console.log('添加书签:', newBookmark)
}

/**
 * 切换模式
 */
function toggleMode(): void {
  mode.value = mode.value === 'horizontal' ? 'vertical' : 'horizontal'
}

/**
 * 切换主题
 */
function toggleTheme(): void {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

/**
 * 展开所有文件夹
 */
function expandAll(): void {
  store.expandAll()
}

/**
 * 收起所有文件夹
 */
function collapseAll(): void {
  store.collapseAll()
}
</script>

<template>
  <div class="bookmark-demo page-container">
    <div class="page-header section-card">
      <div class="header-content">
        <div class="header-icon">
          <Bookmark class="icon-hero" />
        </div>
        <div>
          <h1 class="page-title">书签系统</h1>
          <p class="page-desc">全功能书签管理演示，支持多级文件夹、拖拽排序、右键菜单和持久化存储。</p>
        </div>
      </div>
    </div>

    <!-- 控制面板 -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">
          <Settings class="section-icon" />
          控制面板
        </h2>
      </div>
      <div class="control-group">
        <button class="action-btn" @click="toggleMode">
          <Layout class="btn-icon" />
          {{ mode === 'horizontal' ? '切换垂直模式' : '切换水平模式' }}
        </button>
        <button class="action-btn" @click="toggleTheme">
          <component :is="theme === 'light' ? Moon : Sun" class="btn-icon" />
          {{ theme === 'light' ? '切换深色' : '切换浅色' }}
        </button>
        <div class="divider-v"></div>
        <button class="action-btn primary" @click="addBookmark">
          <Plus class="btn-icon" />
          添加书签
        </button>
        <button class="action-btn secondary" @click="expandAll">
          <FolderOpen class="btn-icon" />
          展开
        </button>
        <button class="action-btn secondary" @click="collapseAll">
          <Folder class="btn-icon" />
          收起
        </button>
        <label class="checkbox-label">
          <input v-model="draggable" type="checkbox" class="checkbox-input">
          <span>允许拖拽</span>
        </label>
      </div>
    </div>

    <!-- 书签栏 -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">
          <Monitor class="section-icon" />
          预览效果
        </h2>
      </div>
      <div class="bookmark-preview-container" :class="[theme === 'dark' ? 'theme-dark' : 'theme-light']">
        <BookmarkBar ref="bookmarkBarRef" :items="store.items.value" :mode="mode" :theme="theme" :draggable="draggable"
          @select="handleSelect" @contextmenu="handleContextMenu" />
      </div>
    </div>

    <div class="grid-layout">
      <!-- 选中信息 -->
      <div class="section-card" v-if="selectedBookmark">
        <div class="section-header">
          <h3 class="section-title small">
            <MousePointer2 class="section-icon" />
            当前选中
          </h3>
        </div>
        <div class="info-box">
          <div class="info-row">
            <span class="label">标题:</span>
            <span class="value">{{ selectedBookmark.title }}</span>
          </div>
          <div class="info-row">
            <span class="label">ID:</span>
            <code class="code-badge">{{ selectedBookmark.id }}</code>
          </div>
          <div class="info-row" v-if="selectedBookmark.url">
            <span class="label">URL:</span>
            <a :href="selectedBookmark.url" target="_blank" class="link-value">{{ selectedBookmark.url }}</a>
          </div>
        </div>
      </div>

      <!-- 状态信息 -->
      <div class="section-card">
        <div class="section-header">
          <h3 class="section-title small">
            <Activity class="section-icon" />
            系统状态
          </h3>
        </div>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">总数</span>
            <span class="stat-value">{{ store.items.value.length }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">展开</span>
            <span class="stat-value">{{ store.expandedIds.value.length }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bookmark-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--size-space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--size-space-lg);
}

/* Page Header (Hero Style) */
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

.section-title.small {
  font-size: var(--size-font-md);
}

.section-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary-500);
}

/* Controls */
.control-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--size-space-md);
  align-items: center;
}

.divider-v {
  width: 1px;
  height: 24px;
  background-color: var(--color-border);
  margin: 0 var(--size-space-xs);
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--size-radius-md);
  font-size: var(--size-font-sm);
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--color-border);
  background: var(--color-bg-container);
  color: var(--color-text-primary);
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--color-bg-hover);
  border-color: var(--color-border-hover);
  transform: translateY(-1px);
}

.action-btn.primary {
  background: var(--color-primary-500);
  color: white;
  border-color: var(--color-primary-500);
}

.action-btn.primary:hover {
  background: var(--color-primary-600);
}

.action-btn.secondary {
  background: var(--color-bg-page);
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: var(--size-font-sm);
  color: var(--color-text-primary);
  user-select: none;
}

.checkbox-input {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--color-primary-500);
}

/* Preview */
.bookmark-preview-container {
  padding: var(--size-space-xl);
  border-radius: var(--size-radius-md);
  border: 1px solid var(--color-border);
  min-height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.theme-light {
  background: #f8fafc;
}

.theme-dark {
  background: #1e293b;
  border-color: #334155;
}

/* Grid Layout for Bottom Info */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--size-space-lg);
}

/* Info Box */
.info-box {
  display: flex;
  flex-direction: column;
  gap: var(--size-space-sm);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed var(--color-border-secondary);
}

.info-row:last-child {
  border-bottom: none;
}

.label {
  color: var(--color-text-secondary);
  font-size: var(--size-font-sm);
}

.value {
  color: var(--color-text-primary);
  font-weight: 500;
}

.code-badge {
  background: var(--color-bg-page);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  color: var(--color-primary-600);
}

.link-value {
  color: var(--color-primary-500);
  text-decoration: none;
}

.link-value:hover {
  text-decoration: underline;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--size-space-md);
}

.stat-item {
  background: var(--color-bg-page);
  padding: var(--size-space-md);
  border-radius: var(--size-radius-md);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: var(--size-font-xs);
  color: var(--color-text-secondary);
  text-transform: uppercase;
}

.stat-value {
  font-size: var(--size-font-xl);
  font-weight: 700;
  color: var(--color-primary-500);
}

@media (max-width: 768px) {
  .bookmark-demo {
    padding: var(--size-space-md);
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .control-group {
    justify-content: center;
  }
  
  .divider-v {
    display: none;
  }
}
</style>
