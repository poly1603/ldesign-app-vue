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
  <div class="bookmark-demo" :class="{ 'dark-mode': theme === 'dark' }">
    <h1>📚 书签系统演示</h1>

    <!-- 控制面板 -->
    <div class="controls">
      <button @click="toggleMode">
        切换模式: {{ mode === 'horizontal' ? '水平' : '垂直' }}
      </button>
      <button @click="toggleTheme">
        切换主题: {{ theme === 'light' ? '浅色' : '深色' }}
      </button>
      <button @click="addBookmark">
        ➕ 添加书签
      </button>
      <button @click="expandAll">
        📂 展开全部
      </button>
      <button @click="collapseAll">
        📁 收起全部
      </button>
      <label>
        <input v-model="draggable" type="checkbox">
        可拖拽
      </label>
    </div>

    <!-- 书签栏 -->
    <div class="bookmark-container">
      <h2>书签栏</h2>
      <BookmarkBar
        ref="bookmarkBarRef"
        :items="store.items.value"
        :mode="mode"
        :theme="theme"
        :draggable="draggable"
        @select="handleSelect"
        @contextmenu="handleContextMenu"
      />
    </div>

    <!-- 选中信息 -->
    <div v-if="selectedBookmark" class="selected-info">
      <h3>选中的书签</h3>
      <pre>{{ JSON.stringify(selectedBookmark, null, 2) }}</pre>
    </div>

    <!-- 状态信息 -->
    <div class="state-info">
      <h3>当前状态</h3>
      <p>选中 ID: {{ store.selectedId.value || '无' }}</p>
      <p>展开的文件夹: {{ store.expandedIds.value.join(', ') || '无' }}</p>
      <p>书签数量: {{ store.items.value.length }}</p>
    </div>
  </div>
</template>

<style scoped>
.bookmark-demo {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.bookmark-demo.dark-mode {
  background-color: #1e1e1e;
  color: #e0e0e0;
}

h1 {
  margin-bottom: 20px;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.dark-mode .controls {
  background-color: #2d2d2d;
}

.controls button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #1976d2;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.controls button:hover {
  background-color: #1565c0;
}

.controls label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.bookmark-container {
  margin-bottom: 20px;
}

.bookmark-container h2 {
  margin-bottom: 10px;
}

.selected-info,
.state-info {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.dark-mode .selected-info,
.dark-mode .state-info {
  background-color: #2d2d2d;
}

.selected-info pre {
  background-color: #e0e0e0;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}

.dark-mode .selected-info pre {
  background-color: #1e1e1e;
}

.state-info p {
  margin: 5px 0;
}
</style>

