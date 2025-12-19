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
  MousePointer2
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
  <div class="bookmark-demo page-shell section-stack">
    <div class="header-section">
      <h1 class="page-title">
        <Bookmark class="icon-title" />
        书签系统演示
      </h1>
      <p class="page-desc">展示 LDesign 书签系统的完整功能，支持拖拽排序、多级文件夹和右键菜单。</p>
    </div>

    <!-- 控制面板 -->
    <div class="section-card">
      <div class="control-group">
        <button class="action-btn" @click="toggleMode">
          <Layout class="btn-icon" />
          {{ mode === 'horizontal' ? '水平模式' : '垂直模式' }}
        </button>
        <button class="action-btn" @click="toggleTheme">
          <component :is="theme === 'light' ? Moon : Sun" class="btn-icon" />
          {{ theme === 'light' ? '深色主题' : '浅色主题' }}
        </button>
        <button class="action-btn primary" @click="addBookmark">
          <Plus class="btn-icon" />
          添加书签
        </button>
        <button class="action-btn" @click="expandAll">
          <FolderOpen class="btn-icon" />
          展开全部
        </button>
        <button class="action-btn" @click="collapseAll">
          <Folder class="btn-icon" />
          收起全部
        </button>
        <label class="checkbox-label">
          <input v-model="draggable" type="checkbox">
          <MousePointer2 class="label-icon" />
          允许拖拽
        </label>
      </div>
    </div>

    <!-- 书签栏 -->
    <div class="section-card">
      <h2 class="section-title">
        <Layout class="section-icon" />
        书签栏预览
      </h2>
      <div class="bookmark-preview" :class="[theme === 'dark' ? 'theme-dark' : 'theme-light']">
        <BookmarkBar ref="bookmarkBarRef" :items="store.items.value" :mode="mode" :theme="theme" :draggable="draggable"
          @select="handleSelect" @contextmenu="handleContextMenu" />
      </div>
    </div>

    <!-- 选中信息 -->
    <div v-if="selectedBookmark" class="section-card">
      <h3 class="section-title">
        <MousePointer2 class="section-icon" />
        选中的书签
      </h3>
      <pre class="code-block">{{ JSON.stringify(selectedBookmark, null, 2) }}</pre>
    </div>

    <!-- 状态信息 -->
    <div class="section-card">
      <h3 class="section-title">
        <Monitor class="section-icon" />
        当前状态
      </h3>
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

.header-section {
  margin-bottom: var(--size-space-xl);
}

.page-title {
  display: flex;
  align-items: center;
  gap: var(--size-space-sm);
  font-size: var(--size-font-2xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--size-space-xs);
}

.icon-title {
  width: 32px;
  height: 32px;
  color: var(--color-primary-500);
}

.page-desc {
  color: var(--color-text-secondary);
  font-size: var(--size-font-md);
}

/* 使用全局 .section-card 样式 */

.control-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--size-space-md);
  align-items: center;
}

/* 使用全局 .action-btn 样式 */

.btn-icon {
  width: 16px;
  height: 16px;
}

/* 交互样式沿用全局 */

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--color-text-primary);
  font-size: var(--size-font-sm);
  margin-left: var(--size-space-sm);
}

.label-icon {
  width: 16px;
  height: 16px;
  color: var(--color-text-secondary);
}

/* 使用全局 .section-card */

.section-title {
  display: flex;
  align-items: center;
  gap: var(--size-space-sm);
  font-size: var(--size-font-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--size-space-md);
  padding-bottom: var(--size-space-sm);
  border-bottom: 1px solid var(--color-border-secondary);
}

.section-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary-500);
}

.bookmark-preview {
  padding: var(--size-space-lg);
  border-radius: var(--size-radius-md);
  border: 1px solid var(--color-border);
  min-height: 120px;
  transition: all 0.3s ease;
}

.theme-light {
  background: var(--color-bg-container);
  border-color: var(--color-border);
}

.theme-dark {
  background: var(--color-bg-container);
  border-color: var(--color-border);
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
  font-size: var(--size-font-sm);
}

.info-list strong {
  color: var(--color-text-secondary);
  margin-right: 8px;
}
</style>
