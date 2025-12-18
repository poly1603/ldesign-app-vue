<script setup lang="ts">
/**
 * 书签功能演示页面
 * 展示 LDesign 书签系统的完整功能
 */
import type { BookmarkItem } from '@ldesign/bookmark-vue'
import { BookmarkBar, useBookmarkStore } from '@ldesign/bookmark-vue'
import { ref, computed } from 'vue'

// 示例书签数据
const sampleBookmarks: BookmarkItem[] = [
  {
    id: 'home',
    type: 'bookmark',
    title: '首页',
    url: '/',
    icon: '🏠',
    pinned: true,
  },
  {
    id: 'folder-dev',
    type: 'folder',
    title: '开发工具',
    icon: '🛠️',
    children: [
      {
        id: 'github',
        type: 'bookmark',
        title: 'GitHub',
        url: 'https://github.com',
        icon: '🐙',
      },
      {
        id: 'vscode',
        type: 'bookmark',
        title: 'VS Code',
        url: 'https://code.visualstudio.com',
        icon: '💻',
      },
      { type: 'separator' },
      {
        id: 'npm',
        type: 'bookmark',
        title: 'NPM',
        url: 'https://npmjs.com',
        icon: '📦',
      },
    ],
  },
  {
    id: 'folder-docs',
    type: 'folder',
    title: '文档',
    icon: '📚',
    children: [
      {
        id: 'vue-docs',
        type: 'bookmark',
        title: 'Vue 3 文档',
        url: 'https://vuejs.org',
        icon: '💚',
      },
      {
        id: 'ts-docs',
        type: 'bookmark',
        title: 'TypeScript 文档',
        url: 'https://typescriptlang.org',
        icon: '🔷',
      },
    ],
  },
  {
    id: 'settings',
    type: 'bookmark',
    title: '设置',
    url: '/settings',
    icon: '⚙️',
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
    icon: '🔖',
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
    <h1 class="page-title">📚 书签系统演示</h1>

    <!-- 控制面板 -->
    <div class="controls-card">
      <div class="control-group">
        <button class="action-btn" @click="toggleMode">
          切换模式: {{ mode === 'horizontal' ? '水平' : '垂直' }}
        </button>
        <button class="action-btn" @click="toggleTheme">
          切换主题: {{ theme === 'light' ? '浅色' : '深色' }}
        </button>
        <button class="action-btn primary" @click="addBookmark">
          ➕ 添加书签
        </button>
        <button class="action-btn" @click="expandAll">
          📂 展开全部
        </button>
        <button class="action-btn" @click="collapseAll">
          📁 收起全部
        </button>
        <label class="checkbox-label">
          <input v-model="draggable" type="checkbox">
          可拖拽
        </label>
      </div>
    </div>

    <!-- 书签栏 -->
    <div class="section-card">
      <h2 class="section-title">书签栏</h2>
      <div class="bookmark-preview" :class="[theme === 'dark' ? 'theme-dark' : 'theme-light']">
        <BookmarkBar ref="bookmarkBarRef" :items="store.items.value" :mode="mode" :theme="theme" :draggable="draggable"
          @select="handleSelect" @contextmenu="handleContextMenu" />
      </div>
    </div>

    <!-- 选中信息 -->
    <div v-if="selectedBookmark" class="section-card">
      <h3 class="section-title">选中的书签</h3>
      <pre class="code-block">{{ JSON.stringify(selectedBookmark, null, 2) }}</pre>
    </div>

    <!-- 状态信息 -->
    <div class="section-card">
      <h3 class="section-title">当前状态</h3>
      <div class="info-list">
        <p><strong>选中 ID:</strong> {{ store.selectedId.value || '无' }}</p>
        <p><strong>展开的文件夹:</strong> {{ store.expandedIds.value.join(', ') || '无' }}</p>
        <p><strong>书签数量:</strong> {{ store.items.value.length }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bookmark-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--size-space-lg);
}

.page-title {
  font-size: var(--size-font-2xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--size-space-xl);
}

.controls-card {
  background: var(--color-bg-container);
  border-radius: var(--size-radius-lg);
  padding: var(--size-space-lg);
  margin-bottom: var(--size-space-lg);
  border: 1px solid var(--color-border-secondary);
}

.control-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--size-space-md);
  align-items: center;
}

.action-btn {
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--size-radius-md);
  background: var(--color-bg-container);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.2s;
  font-size: var(--size-font-sm);
}

.action-btn:hover {
  border-color: var(--color-primary-500);
  color: var(--color-primary-500);
}

.action-btn.primary {
  background: var(--color-primary-500);
  color: white;
  border-color: var(--color-primary-500);
}

.action-btn.primary:hover {
  background: var(--color-primary-600);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--color-text-primary);
  font-size: var(--size-font-sm);
}

.section-card {
  background: var(--color-bg-container);
  border-radius: var(--size-radius-lg);
  padding: var(--size-space-lg);
  margin-bottom: var(--size-space-lg);
  border: 1px solid var(--color-border-secondary);
}

.section-title {
  font-size: var(--size-font-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--size-space-md);
}

.bookmark-preview {
  padding: var(--size-space-md);
  border-radius: var(--size-radius-md);
  border: 1px solid var(--color-border);
  min-height: 100px;
}

.theme-light {
  background: #f5f5f5;
}

.theme-dark {
  background: #1e1e1e;
}

.code-block {
  background: var(--color-bg-layout);
  padding: var(--size-space-md);
  border-radius: var(--size-radius-md);
  overflow-x: auto;
  font-family: monospace;
  font-size: var(--size-font-xs);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.info-list p {
  margin: 8px 0;
  color: var(--color-text-primary);
}

.info-list strong {
  color: var(--color-text-secondary);
  margin-right: 8px;
}
</style>
