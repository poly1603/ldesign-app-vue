<script setup lang="ts">
/**
 * 应用根组件
 *
 * 使用 useTemplate 动态加载布局模板，支持用户手动切换布局
 * - 自动检测设备类型（desktop/tablet/mobile）
 * - 集成 TemplateSelector 组件，支持用户手动选择布局模板
 * - 与 Login.vue 使用相同的模板管理方式
 * - 集成 LEAP 系统认证和菜单
 */
import { computed, markRaw, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ThemeColorPicker, ThemeModeSwitcher } from '@ldesign/color-vue'
import { LanguageSwitcher, useI18n } from '@ldesign/i18n-vue'
import { LMenu } from '@ldesign/menu-vue'
import '@ldesign/menu-vue/styles'
import { SizeSwitcher } from '@ldesign/size-vue'
import { TemplateSwitcher, useTemplate } from '@ldesign/template-vue'
import { ChromeTabs, useRouteTabs } from '@ldesign/bookmark-vue'
import { LBreadcrumb } from '@ldesign/breadcrumb-vue'
import '@ldesign/breadcrumb-vue/styles'
import { useNotification, LNotification, LToast, LMessage } from '@ldesign/notification-vue'
import LogoutModal from './components/LogoutModal.vue'

// 导入 Lucide 图标组件
import {
  Archive,
  Bell,
  Database,
  FileText,
  Globe,
  Home,
  KeyRound, // 用于登录按钮图标
  LayoutDashboard as LayoutDashboardIcon,
  Lock,
  LogOut, // 用于登出按钮图标
  Package,
  Palette,
  Ruler,
  Smartphone,
  User, // 用于用户头像图标
} from 'lucide-vue-next'
import { provideApiManager } from '@ldesign/api-vue'
import { servers, apis } from './api'
import httpClient from './api/http'
import { useAuth } from './composables/useAuth'

const MAX_TABBAR_PRIMARY = 4

/** 登录按钮图标组件 */
const LoginIcon = markRaw(KeyRound)
/** 登出按钮图标组件 */
const LogoutIcon = markRaw(LogOut)
/** 用户图标组件 */
const UserIcon = markRaw(User)

// 认证状态管理
const auth = useAuth()
const notification = useNotification()

provideApiManager({
  servers,
  apis,
  httpClientFactory: async () => httpClient,
})

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

/**
 * 路由页签管理
 * 自动监听路由变化，管理页签的添加、删除、切换
 */
const {
  tabs,
  activeKey,
  refreshKey,
  switchTab,
  removeTab,
  closeOthers,
  closeLeft,
  closeRight,
  closeAll,
  refreshTab,
  togglePin,
} = useRouteTabs({
  router,
  homePath: '/',
  homeTitle: '首页',
  excludes: ['/login', '/404', '/403', '/500'],
})

/** 判断是否为全屏页面 */
function isPathInMenu(path: string): boolean {
  const dfs = (items: LMenuItemData[] | undefined): boolean => {
    if (!items || items.length === 0) return false
    for (const it of items) {
      if (it.key === path) return true
      if (dfs(it.children)) return true
    }
    return false
  }
  return dfs(menuItems.value)
}

const isNotFoundRoute = computed(() => {
  if (route.path === '/404') return true
  return route.matched.length === 1 && route.matched[0]?.name === 'NotFound'
})

const isFullscreenPage = computed(() => {
  if (route.path === '/login') return true
  if (!isNotFoundRoute.value) return false

  // 菜单/认证未准备好时，先保留布局，避免菜单路由短暂未注册导致全屏 404
  if (!auth.initialized.value) return false
  if (!auth.loggedIn.value) return true
  if (!menuItems.value || menuItems.value.length === 0) return false

  // 已登录且菜单已加载：菜单路由未注册 => 内容区 404；其他未知路由 => 全屏 404
  return !isPathInMenu(route.path)
})

/**
 * 使用 useTemplate 动态加载布局模板组件
 *
 * 简化模式：只传分类名 'layout'，自动检测设备类型
 * - 自动检测当前设备类型（desktop/tablet/mobile）
 * - 窗口大小变化时自动切换到对应设备的模板
 * - 优先使用缓存中的用户选择
 */
const {
  component: LayoutComponent,
  loading: layoutLoading,
  template: currentTemplateMeta,
  deviceType,
} = useTemplate('layout', {
  immediate: true,
  onChange: (info) => {
    console.log('[App] 模板切换:', info)
  },
})

const viewModules = import.meta.glob('./views/**/*.vue')
const pageModules = import.meta.glob('./pages/**/*.vue')
const allPageModules: Record<string, any> = { ...viewModules, ...pageModules }

/** 图标组件映射 - 使用 markRaw 避免响应式警告 */
const HomeIcon = markRaw(Home)
const PaletteIcon = markRaw(Palette)
const RulerIcon = markRaw(Ruler)
const GlobeIcon = markRaw(Globe)
const SmartphoneIcon = markRaw(Smartphone)
const DatabaseIcon = markRaw(Database)
const LockIcon = markRaw(Lock)
const ArchiveIcon = markRaw(Archive)
const FileTextIcon = markRaw(FileText)
const BellIcon = markRaw(Bell)
const LayoutDashboardIconComp = markRaw(LayoutDashboardIcon)
const PackageIcon = markRaw(Package)

const iconComponents: Record<string, any> = {
  home: HomeIcon,
  palette: PaletteIcon,
  ruler: RulerIcon,
  globe: GlobeIcon,
  smartphone: SmartphoneIcon,
  database: DatabaseIcon,
  lock: LockIcon,
  archive: ArchiveIcon,
  fileText: FileTextIcon,
  bell: BellIcon,
  layoutDashboard: LayoutDashboardIconComp,
  package: PackageIcon,
}

/**
 * 根据图标名称获取组件
 * 支持 Lucide 图标名称或 iconComponents 中的 key
 */
function getIconComponent(iconName?: string): any {
  if (!iconName) return undefined
  // 尝试从映射中获取
  return iconComponents[iconName] || iconComponents[iconName.toLowerCase()] || undefined
}

/**
 * LMenu 菜单项接口
 * 符合 @ldesign/menu-vue 的 MenuItem 结构
 * 扩展 meta 字段用于存储路由注册所需信息
 */
interface LMenuItemData {
  key: string
  label: string
  type?: 'item' | 'submenu' | 'group' | 'divider'
  icon?: any
  disabled?: boolean
  children?: LMenuItemData[]
  /** 扩展元数据，用于路由注册 */
  meta?: {
    /** 菜单 ID */
    id?: string
    /** 路由名称 (PascalCase) */
    name?: string
    /** Vue 组件路径 */
    component?: string
    /** 组件名称 */
    componentName?: string
    /** 资源类型 */
    resourceType?: string
    /** 自定义配置 */
    props?: Record<string, unknown>
  }
}

/**
 * 将 API 返回的菜单数据转换为 LMenu 需要的格式
 */
function transformApiMenuToLMenu(apiMenus: any[], parentKey = 'root'): LMenuItemData[] {
  if (!apiMenus || apiMenus.length === 0) return []

  return apiMenus.map((item, index) => {
    const hasChildren = item.children && item.children.length > 0

    const rawPath = item.path ?? item.url ?? item.route
    const rawId = item.id ?? item.menuId ?? item.menu_id ?? item.code
    let normalizedKey = ''

    if (typeof rawPath === 'string' && rawPath.trim().length > 0) {
      const p = rawPath.trim()
      normalizedKey = p.startsWith('/') ? p : `/${p}`
    }
    else if (rawId !== undefined && rawId !== null && String(rawId).length > 0) {
      normalizedKey = `id:${rawId}`
    }
    else if (typeof item.name === 'string' && item.name.length > 0) {
      normalizedKey = `name:${item.name}`
    }
    else if (typeof item.title === 'string' && item.title.length > 0) {
      normalizedKey = `title:${item.title}`
    }
    else {
      normalizedKey = `${parentKey}:${index}`
    }

    const menuItem: LMenuItemData = {
      key: normalizedKey,
      label: item.title || item.name || '',
      type: hasChildren ? 'submenu' : 'item',
      icon: getIconComponent(item.icon),
      meta: {
        id: item.id,
        name: item.name,
        component: item.component,
        componentName: item.componentName,
        resourceType: item.resourceType,
        props: item.meta?.props,
      },
    }

    if (hasChildren) {
      menuItem.children = transformApiMenuToLMenu(item.children, normalizedKey)
    }

    return menuItem
  })
}

/**
 * 菜单数据
 * - 已登录且有 API 菜单：使用 API 菜单
 * - 否则：返回空数组
 */
const menuItems = computed<LMenuItemData[]>(() => {
  if (!auth.loggedIn.value) return []
  if (!auth.menuList.value || auth.menuList.value.length === 0) return []
  return transformApiMenuToLMenu(auth.menuList.value as any[])
})

/** 当前选中的菜单项 key */
const selectedMenuKey = computed(() => route.path)

/**
 * 根据路由路径查找父级菜单 key
 * @param path - 当前路由路径
 * @returns 父级菜单 key 数组
 */
function findParentKeys(path: string): string[] {
  const stack: string[] = []

  function dfs(items: LMenuItemData[]): boolean {
    for (const item of items) {
      if (item.key === path) {
        return true
      }
      if (item.children && item.children.length > 0) {
        stack.push(item.key)
        const found = dfs(item.children)
        if (found) return true
        stack.pop()
      }
    }
    return false
  }

  dfs(menuItems.value)
  return stack
}

/**
 * 根据当前路由生成面包屑数据
 * @param currentPath - 当前路由路径
 * @param currentRoute - 当前路由对象（用于获取 meta 信息）
 * @returns 面包屑项数组
 */
function buildBreadcrumbItems(currentPath: string, currentRoute: typeof route) {
  const items: Array<{ key: string, label: string, path?: string }> = []

  // 首页始终显示
  items.push({ key: '/', label: t('nav.home'), path: '/' })

  // 如果当前就是首页，直接返回
  if (currentPath === '/') {
    return items
  }

  // 递归查找当前路由对应的菜单路径
  const pathItems: LMenuItemData[] = []

  function dfs(items: LMenuItemData[]): boolean {
    for (const item of items) {
      pathItems.push(item)
      if (item.key === currentPath) {
        return true
      }
      if (item.children && item.children.length > 0) {
        const found = dfs(item.children)
        if (found) return true
      }
      pathItems.pop()
    }
    return false
  }

  if (dfs(menuItems.value) && pathItems.length > 0) {
    for (let i = 0; i < pathItems.length; i++) {
      const it = pathItems[i]
      const isLast = i === pathItems.length - 1
      items.push({
        key: it.key,
        label: it.label,
        path: isLast ? it.key : undefined,
      })
    }
    return items
  }

  // 如果没找到匹配的菜单，显示路由的 meta.title
  if (currentRoute.meta?.title) {
    items.push({ key: currentPath, label: String(currentRoute.meta.title), path: currentPath })
  }

  return items
}

/** 面包屑项列表（响应路由变化） */
const breadcrumbItems = ref(buildBreadcrumbItems(route.path, route))

// 监听路由变化更新面包屑
watch(
  () => route.path,
  (newPath) => {
    breadcrumbItems.value = buildBreadcrumbItems(newPath, route)
  },
  { immediate: true },
)

/**
 * 当前展开的菜单项 key 列表
 * 在组件创建时立即根据当前路由初始化展开状态
 */
const openKeys = ref<string[]>(findParentKeys(route.path))

/**
 * 监听路由变化，自动展开当前路由对应的父级菜单
 * 这确保了页面刷新后父菜单能正确展开
 */
watch(
  () => route.path,
  (newPath) => {
    const parentKeys = findParentKeys(newPath)
    // 合并新的父级 key，避免关闭用户手动展开的其他菜单
    for (const key of parentKeys) {
      if (!openKeys.value.includes(key)) {
        openKeys.value.push(key)
      }
    }
  },
  { immediate: true }
)

function resolveMenuComponentLoader(componentPath?: string, componentName?: string) {
  const normalize = (p: string) => p.replace(/\\/g, '/').trim()

  const candidates: string[] = []

  const addCandidate = (p: string) => {
    const s = p.trim()
    if (!s) return
    candidates.push(s)
  }

  const fromComponentPath = (raw: string) => {
    let p = normalize(raw)
    if (p.startsWith('/')) p = p.slice(1)
    if (p.startsWith('src/')) p = p.slice(3)
    if (!p.endsWith('.vue')) p = `${p}.vue`

    if (p.startsWith('./')) addCandidate(p)
    addCandidate(`./${p}`)
    addCandidate(`./views/${p.replace(/^\.\/?/, '')}`)
    addCandidate(`./pages/${p.replace(/^\.\/?/, '')}`)
  }

  if (typeof componentPath === 'string' && componentPath.trim().length > 0) {
    fromComponentPath(componentPath)
  }

  if (typeof componentName === 'string' && componentName.trim().length > 0) {
    const base = `${componentName.trim()}.vue`
    const hit = Object.keys(allPageModules).find(k => k.endsWith(`/${base}`))
    if (hit) addCandidate(hit)
  }

  for (const key of candidates) {
    if (allPageModules[key]) return allPageModules[key]
  }

  // fuzzy fallback
  if (typeof componentPath === 'string' && componentPath.trim().length > 0) {
    const base = normalize(componentPath).split('/').filter(Boolean).pop() || ''
    const baseVue = base.endsWith('.vue') ? base : `${base}.vue`
    const hit = Object.keys(allPageModules).find(k => k.endsWith(`/${baseVue}`))
    if (hit) return allPageModules[hit]
  }

  return undefined
}

function registerMenuRoutes(items: LMenuItemData[]): void {
  const existing = new Set(router.getRoutes().map(r => r.path))
  const visited = new Set<string>()

  const walk = (nodes: LMenuItemData[] | undefined) => {
    if (!nodes || nodes.length === 0) return
    for (const n of nodes) {
      const key = n.key
      const children = n.children
      const hasChildren = Array.isArray(children) && children.length > 0
      if (hasChildren) {
        walk(children)
        continue
      }

      if (typeof key !== 'string' || !key.startsWith('/')) continue
      if (visited.has(key)) continue
      visited.add(key)

      if (existing.has(key)) continue
      existing.add(key)

      const compPath = (n as any)?.meta?.component as string | undefined
      const compName = (n as any)?.meta?.componentName as string | undefined
      const loader = resolveMenuComponentLoader(compPath, compName)

      const safeName = `menu_${key.replace(/[^a-zA-Z0-9_]/g, '_')}`
      router.addRoute({
        path: key,
        name: safeName,
        component: loader ? loader : () => import('./views/NotFound.vue'),
        meta: {
          title: n.label || key,
          menu: true,
          menuKey: key,
          menuComponent: compPath,
          menuComponentName: compName,
        },
      })
    }
  }

  walk(items)
}

function ensureMenuRoutesReady(): void {
  if (!auth.loggedIn.value) return
  if (!menuItems.value || menuItems.value.length === 0) return

  registerMenuRoutes(menuItems.value)

  // 如果当前是 NotFound，但菜单路由刚注册成功，则刷新一次匹配
  if (isNotFoundRoute.value && isPathInMenu(route.path)) {
    const resolved = router.resolve(route.fullPath)
    const stillNotFound = resolved.matched.length === 1 && resolved.matched[0]?.name === 'NotFound'
    if (!stillNotFound) {
      router.replace(route.fullPath)
    }
  }
}

/**
 * 处理菜单选择事件
 */
function handleMenuSelect(params: any) {
  ensureMenuRoutesReady()
  const key = typeof params === 'string' ? params : params?.key
  // 仅当是路由型 key 才导航
  if (typeof key === 'string' && key.startsWith('/')) {
    router.push(key)
  } else if (typeof key === 'string' && key.length > 0) {
    notification.warning('菜单未配置路由', {
      content: `该菜单项(${key})未配置可跳转的路由。`,
      duration: 2000,
    })
  }
}

/**
 * 处理菜单展开/收起变化
 */
function handleOpenChange(keys: string[]) {
  openKeys.value = keys
}

/**
 * Mix/DualColumn 布局 - 当前选中的一级菜单 key
 */
const selectedRootKey = ref<string>('')

/**
 * Mix 布局 / DualColumn 布局 - 处理顶部一级菜单点击
 */
function handleRootSelect(params: any, itemArg?: any) {
  ensureMenuRoutesReady()
  const key = typeof params === 'string' ? params : params?.key
  if (!key) return
  selectedRootKey.value = key

  const findNodeByKey = (items: LMenuItemData[] | undefined, targetKey: string): LMenuItemData | undefined => {
    if (!items || items.length === 0) return undefined
    for (const it of items) {
      if (it.key === targetKey) return it
      const found = findNodeByKey(it.children, targetKey)
      if (found) return found
    }
    return undefined
  }

  const rootNode = findNodeByKey(menuItems.value, key)
  const item = rootNode || itemArg || (typeof params === 'string' ? undefined : params?.item)

  const findFirstLeafRouteKey = (nodes: any[] | undefined): string | undefined => {
    if (!nodes || nodes.length === 0) return undefined
    for (const n of nodes) {
      const children = n?.children
      const leafInChildren = findFirstLeafRouteKey(children)
      if (leafInChildren) return leafInChildren

      const k = n?.key
      const hasChildren = Array.isArray(children) && children.length > 0
      if (typeof k === 'string' && k.startsWith('/') && !hasChildren) return k
    }
    return undefined
  }

  const firstLeafRoute = findFirstLeafRouteKey(item?.children)
  if (firstLeafRoute) {
    openKeys.value = findParentKeys(firstLeafRoute)
    router.push(firstLeafRoute)
    return
  }

  if (key.startsWith('/')) {
    router.push(key)
    return
  }

  notification.warning('菜单未配置可用入口', {
    content: `该一级菜单(${key})没有可跳转的子路由。`,
    duration: 2000,
  })
}

const siderMenuItems = computed<LMenuItemData[]>(() => {
  if (templateType.value === 'mix' || templateType.value === 'dual-column') {
    return menuItems.value
  }
  return menuItems.value
})

/**
 * 根据当前路由自动设置选中的一级菜单
 */
function updateSelectedRootKey() {
  const path = route.path

  const findInChildren = (items: LMenuItemData[] | undefined): boolean => {
    if (!items || items.length === 0) return false
    for (const it of items) {
      if (it.key === path) return true
      if (findInChildren(it.children)) return true
    }
    return false
  }

  for (const root of menuItems.value) {
    if (root.key === path) {
      selectedRootKey.value = root.key
      return
    }
    if (findInChildren(root.children)) {
      selectedRootKey.value = root.key
      return
    }
  }

  selectedRootKey.value = menuItems.value[0]?.key || ''
}

// 监听路由变化更新选中的一级菜单
watch(() => route.path, updateSelectedRootKey, { immediate: true })

watch(
  [() => auth.loggedIn.value, () => auth.menuList.value],
  () => {
    ensureMenuRoutesReady()
    openKeys.value = findParentKeys(route.path)
    updateSelectedRootKey()
  },
  { immediate: true, deep: true },
)

/**
 * 判断当前模板类型
 * 用于根据不同模板渲染不同的菜单配置
 */
const templateType = computed(() => {
  const name = currentTemplateMeta.value?.name || ''
  console.log('[App] 当前模板名称:', name)
  if (name.includes('mix')) return 'mix'
  if (name.includes('top-menu')) return 'top-menu'
  if (name.includes('tab-bar')) return 'tab-bar'
  if (name.includes('drawer')) return 'drawer'
  if (name.includes('dual-column')) return 'dual-column'
  return 'sidebar' // 默认侧边栏模式
})

const topMenuMode = computed(() => (deviceType.value === 'mobile' ? 'vertical' : 'horizontal'))
const topMenuTheme = computed(() => (deviceType.value === 'mobile' ? 'light' : 'dark'))
const topMenuExpandMode = computed(() => (deviceType.value === 'mobile' ? 'inline' : 'popup'))
const topMenuInheritColor = computed(() => deviceType.value !== 'mobile')
const topMenuAccordion = computed(() => deviceType.value === 'mobile')

const siderMenuTheme = computed(() => {
  if (templateType.value === 'sidebar' && deviceType.value === 'desktop') return 'dark'
  return 'light'
})

const drawerMenuTheme = computed(() => 'light')

const tabBarMoreVisible = ref(false)

const tabBarPrimaryItems = computed(() => {
  return (menuItems.value || []).slice(0, MAX_TABBAR_PRIMARY)
})

const tabBarMoreItems = computed(() => {
  return (menuItems.value || []).slice(MAX_TABBAR_PRIMARY)
})

function openTabBarMore() {
  tabBarMoreVisible.value = true
  document.body.style.overflow = 'hidden'
}

function closeTabBarMore() {
  tabBarMoreVisible.value = false
  document.body.style.overflow = ''
}

function handleTabBarPrimarySelect(item: LMenuItemData) {
  handleRootSelect({ key: item.key, item })
}

function handleTabBarMoreSelect(params: any) {
  handleMenuSelect(params)
  closeTabBarMore()
}

const siderRenderMode = computed<'full' | 'childrenOf'>(() => {
  if (templateType.value === 'mix' || templateType.value === 'dual-column') {
    return 'childrenOf'
  }
  return 'full'
})

const siderParentKey = computed(() => {
  if (siderRenderMode.value === 'childrenOf') {
    return selectedRootKey.value
  }
  return undefined
})

const siderOpenKeys = computed(() => {
  if (siderRenderMode.value !== 'childrenOf' || !siderParentKey.value) {
    return openKeys.value
  }

  const findChildren = (items: LMenuItemData[], targetKey: string): LMenuItemData[] => {
    for (const it of items) {
      if (it.key === targetKey) return it.children || []
      if (it.children && it.children.length > 0) {
        const found = findChildren(it.children, targetKey)
        if (found.length > 0) return found
      }
    }
    return []
  }

  const subtree = findChildren(menuItems.value, siderParentKey.value)
  const valid = new Set<string>()
  const walk = (nodes: LMenuItemData[]) => {
    for (const n of nodes) {
      if (n.children && n.children.length > 0) {
        valid.add(n.key)
        walk(n.children)
      }
    }
  }
  walk(subtree)

  return openKeys.value.filter(k => k !== siderParentKey.value && valid.has(k))
})


/** 跳转到登录页 */
function goToLogin() {
  router.push('/login')
}

/** 退出登录确认弹窗状态 */
const showLogoutModal = ref(false)
const logoutLoading = ref(false)

/** 打开退出确认弹窗 */
function openLogoutModal() {
  showLogoutModal.value = true
}

/** 关闭退出确认弹窗 */
function closeLogoutModal() {
  showLogoutModal.value = false
}

/** 确认退出登录 */
async function confirmLogout() {
  logoutLoading.value = true
  try {
    await auth.logout()
    showLogoutModal.value = false
    router.push('/login')
  } catch (e) {
    console.error('[App] 退出登录失败:', e)
  } finally {
    logoutLoading.value = false
  }
}

/**
 * 页面加载时初始化认证状态
 * 如果已登录，获取用户信息和菜单
 * 如果获取失败（登录过期等），提示用户并跳转到登录页
 */
onMounted(async () => {
  if (route.path !== '/login') {
    const result = await auth.initAuth()
    console.log('[App] 认证初始化完成:', result)

    // 如果登录已过期或获取用户信息失败，提示用户并跳转到登录页
    if (!result.success) {
      if (result.message) {
        notification.warning('登录过期', {
          content: result.message,
          duration: 3000,
        })
      }
      setTimeout(() => {
        router.push('/login')
      }, 500)
    }
  }
})

/**
 * 处理面包屑点击事件
 */
function handleBreadcrumbClick(item: { key: string, path?: string }) {
  if (item.path) {
    router.push(item.path)
  }
}
</script>

<template>
  <!-- 全屏页面（如登录页）直接渲染 -->
  <div v-if="isFullscreenPage" class="fullscreen-page">
    <router-view />
  </div>

  <!-- 布局加载中 -->
  <div v-else-if="layoutLoading" class="layout-loading">
    <span>加载布局中...</span>
  </div>

  <!-- 动态渲染布局模板组件 -->
  <component v-else-if="LayoutComponent" :is="LayoutComponent" :show-tabs="true" :show-footer="false"
    :category="'layout'" :device="deviceType">
    <!-- Logo 插槽 -->
    <template #logo="{ collapsed }">
      <div class="app-logo">
        <Palette class="logo-icon" :size="24" />
        <span v-if="!collapsed" class="logo-text">LDesign</span>
      </div>
    </template>

    <!-- ============ 顶部横向菜单 (top-menu 布局) ============ -->
    <template #menu>
      <LMenu v-if="templateType === 'top-menu' && menuItems.length > 0" :mode="topMenuMode" :theme="topMenuTheme"
        :expand-mode="topMenuExpandMode" :accordion="topMenuAccordion" :items="menuItems"
        :selected-key="selectedMenuKey" :open-keys="openKeys" :inherit-color="topMenuInheritColor"
        @select="handleMenuSelect" @open-change="handleOpenChange" />
    </template>

    <!-- ============ Mix 布局顶部一级菜单 ============ -->
    <template #top-menu>
      <LMenu v-if="templateType === 'mix' && menuItems.length > 0" mode="horizontal" render-mode="rootOnly" theme="dark"
        :items="menuItems" :selected-key="selectedRootKey" :inherit-color="true" @root-select="handleRootSelect" />
    </template>

    <!-- ============ 图标栏 (dual-column 布局) ============ -->
    <template #icon-bar>
      <LMenu v-if="templateType === 'dual-column' && menuItems.length > 0" mode="vertical" render-mode="rootOnly"
        theme="dark" :items="menuItems" :selected-key="selectedRootKey" :collapsed="true" :collapsed-width="60"
        :inherit-color="true" @root-select="handleRootSelect" />
    </template>

    <!-- ============ 侧边栏菜单 ============ -->
    <template #sider="{ collapsed }">
      <LMenu v-if="menuItems.length > 0" :items="siderMenuItems" :render-mode="siderRenderMode"
        :parent-key="siderParentKey" :collapsed="collapsed" :selected-key="selectedMenuKey"
        :open-keys="collapsed ? [] : siderOpenKeys" :expand-mode="collapsed ? 'popup' : 'inline'" :inherit-color="false"
        :theme="siderMenuTheme" @select="handleMenuSelect" @open-change="handleOpenChange" />
    </template>

    <!-- ============ 移动端抽屉菜单 ============ -->
    <template #drawer>
      <LMenu v-if="menuItems.length > 0" :items="menuItems" :selected-key="selectedMenuKey" :open-keys="openKeys"
        :theme="drawerMenuTheme" :inherit-color="false" @select="handleMenuSelect" @open-change="handleOpenChange" />
    </template>

    <template #tab-bar>
      <div v-if="menuItems.length > 0" class="app-tabbar">
        <div class="app-tabbar__primary">
          <button v-for="it in tabBarPrimaryItems" :key="it.key" class="app-tabbar__item"
            :class="{ 'is-active': selectedRootKey === it.key }" @click="handleTabBarPrimarySelect(it)" type="button">
            <span class="app-tabbar__label">{{ it.label }}</span>
          </button>

          <button v-if="tabBarMoreItems.length > 0" class="app-tabbar__item app-tabbar__more"
            :class="{ 'is-active': tabBarMoreVisible }" type="button" @click="openTabBarMore">
            <span class="app-tabbar__label">更多</span>
          </button>
        </div>

        <Teleport to="body">
          <Transition name="tabbar-more-fade">
            <div v-if="tabBarMoreVisible" class="app-tabbar__overlay" @click="closeTabBarMore" />
          </Transition>
          <Transition name="tabbar-more-slide">
            <div v-if="tabBarMoreVisible" class="app-tabbar__sheet">
              <div class="app-tabbar__sheet-header">
                <div class="app-tabbar__sheet-title">更多</div>
                <button class="app-tabbar__sheet-close" type="button" @click="closeTabBarMore">×</button>
              </div>
              <div class="app-tabbar__sheet-body">
                <LMenu v-if="tabBarMoreItems.length > 0" mode="vertical" expand-mode="inline" :accordion="true"
                  :items="tabBarMoreItems" :selected-key="selectedMenuKey" :open-keys="openKeys" theme="light"
                  :inherit-color="false" @select="handleTabBarMoreSelect" @open-change="handleOpenChange" />
              </div>
            </div>
          </Transition>
        </Teleport>
      </div>
    </template>

    <!-- 页签栏插槽 - 使用 @ldesign/bookmark-vue 的 ChromeTabs 组件 -->
    <template #tabs>
      <ChromeTabs v-model:tabs="tabs" :active-key="activeKey" variant="chrome" @change="switchTab" @close="removeTab"
        @toggle-pin="togglePin" @refresh="refreshTab" @close-left="closeLeft" @close-right="closeRight"
        @close-others="closeOthers" @close-all="closeAll" />
    </template>

    <!-- 顶栏右侧操作区 -->
    <template #header-right="{ variant }">
      <div class="header-actions" :data-variant="variant">
        <LanguageSwitcher :variant="variant" />
        <ThemeColorPicker :variant="variant" :translate="t" :locale="locale" />
        <ThemeModeSwitcher :variant="variant" :translate="t" :locale="locale" />
        <SizeSwitcher :variant="variant" :translate="t" :locale="locale" />
        <TemplateSwitcher :variant="variant" category="layout" :translate="t" />

        <!-- 已登录时显示用户信息和登出按钮 -->
        <template v-if="auth.loggedIn.value">
          <div class="user-info">
            <component :is="UserIcon" :size="16" />
            <span class="username">{{ auth.displayName.value || '用户' }}</span>
          </div>
          <button class="logout-btn" @click="openLogoutModal">
            <component :is="LogoutIcon" :size="16" />
            退出
          </button>
        </template>

        <!-- 未登录时显示登录按钮 -->
        <button v-else class="login-btn" @click="goToLogin">
          <component :is="LoginIcon" :size="16" />
          {{ t('nav.login') }}
        </button>
      </div>
    </template>

    <!-- 主内容区 -->
    <template #default>
      <!-- 面包屑导航 -->
      <div class="page-breadcrumb">
        <LBreadcrumb :items="breadcrumbItems" separator="/" :show-home="false" @click="handleBreadcrumbClick" />
      </div>
      <!-- 页面内容 -->
      <router-view :key="`${route.fullPath}-${refreshKey}`" />
    </template>
  </component>

  <!-- 退出登录确认弹窗 -->
  <LogoutModal :visible="showLogoutModal" :loading="logoutLoading" @confirm="confirmLogout"
    @cancel="closeLogoutModal" />

  <!-- 全局通知组件容器 -->
  <LNotification />
  <LToast />
  <LMessage />
</template>
<style>
/* ==================== 全局重置 ==================== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ==================== Body 样式 ==================== */
body {
  font-family: var(--size-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif);
  line-height: var(--size-line-relaxed, 1.6);
  background: var(--color-gray-50, #f9fafb);
  color: var(--color-gray-900, #111827);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--size-spacing-large);
}

/* 用户信息样式 */
.user-info {
  display: flex;
  align-items: center;
  gap: var(--size-space-xs, 4px);
  padding: var(--size-space-xs, 4px) var(--size-space-sm, 8px);
  border-radius: var(--size-radius-sm, 4px);
  background: var(--color-bg-container-secondary, #f5f5f5);
  color: var(--color-text-secondary, #666);
  font-size: var(--size-font-sm, 14px);
}

.user-info .username {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 登出按钮样式 */
.logout-btn {
  display: flex;
  align-items: center;
  gap: var(--size-space-xs, 4px);
  padding: var(--size-space-xs, 4px) var(--size-space-sm, 8px);
  border: 1px solid var(--color-border, #e0e0e0);
  border-radius: var(--size-radius-sm, 4px);
  background: var(--color-bg-container, #fff);
  color: var(--color-text-secondary, #666);
  font-size: var(--size-font-sm, 14px);
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  border-color: var(--color-error-500, #ef4444);
  color: var(--color-error-500, #ef4444);
  background: var(--color-error-50, #fef2f2);
}

/* ==================== Logo 样式 ==================== */
.app-logo {
  display: flex;
  align-items: center;
  gap: var(--size-space-sm, 8px);
  color: inherit;
  text-decoration: none;
}

.app-logo .logo-icon {
  flex-shrink: 0;
}

.app-logo .logo-text {
  font-size: var(--size-font-lg, 18px);
  font-weight: 600;
  white-space: nowrap;
}

/* ==================== 登录按钮样式 ==================== */
.login-btn {
  display: flex;
  align-items: center;
  gap: var(--size-space-xs, 4px);
  padding: var(--size-space-xs, 4px) var(--size-space-sm, 8px);
  border: 1px solid var(--color-primary-500, #3b82f6);
  border-radius: var(--size-radius-sm, 4px);
  background: var(--color-primary-500, #3b82f6);
  color: #fff;
  font-size: var(--size-font-sm, 14px);
  cursor: pointer;
  transition: all 0.2s ease;
}

.login-btn:hover {
  background: var(--color-primary-600, #2563eb);
  border-color: var(--color-primary-600, #2563eb);
}

/* ==================== 面包屑样式 ==================== */
.page-breadcrumb {
  padding: var(--size-space-md, 12px) var(--size-space-lg, 16px);
  margin-bottom: var(--size-space-md, 12px);
}

/* ==================== 布局加载中 ==================== */
.layout-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: var(--size-font-lg, 18px);
  color: var(--color-text-secondary, #666);
}

/* ==================== 全屏页面 ==================== */
.fullscreen-page {
  min-height: 100vh;
}

/* ==================== TabBar（移动端） ==================== */
.app-tabbar {
  width: 100%;
}

.app-tabbar__primary {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 4px;
  padding: 6px 8px;
}

.app-tabbar__item {
  appearance: none;
  border: none;
  background: transparent;
  color: rgba(31, 41, 55, 0.8);
  height: 44px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s ease, transform 0.1s ease, color 0.15s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-tabbar__item:active {
  transform: scale(0.96);
}

.app-tabbar__item.is-active {
  color: #0f172a;
  background: rgba(59, 130, 246, 0.12);
}

.app-tabbar__label {
  display: inline-block;
  max-width: 100%;
  padding: 0 6px;
}

.app-tabbar__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 1200;
}

.app-tabbar__sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  max-height: 75vh;
  background: #fff;
  border-radius: 18px 18px 0 0;
  box-shadow: 0 -16px 48px rgba(0, 0, 0, 0.18);
  z-index: 1201;
  display: flex;
  flex-direction: column;
}

.app-tabbar__sheet-header {
  height: 52px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
}

.app-tabbar__sheet-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.app-tabbar__sheet-close {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.06);
  color: rgba(15, 23, 42, 0.75);
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
}

.app-tabbar__sheet-body {
  padding: 10px 12px 16px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.tabbar-more-fade-enter-active,
.tabbar-more-fade-leave-active {
  transition: opacity 0.2s ease;
}

.tabbar-more-fade-enter-from,
.tabbar-more-fade-leave-to {
  opacity: 0;
}

.tabbar-more-slide-enter-active,
.tabbar-more-slide-leave-active {
  transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.28s ease;
}

.tabbar-more-slide-enter-from,
.tabbar-more-slide-leave-to {
  transform: translateY(18px);
  opacity: 0;
}

:root[data-theme-mode="dark"] .app-tabbar__item,
.dark .app-tabbar__item {
  color: rgba(248, 250, 252, 0.78);
}

:root[data-theme-mode="dark"] .app-tabbar__item.is-active,
.dark .app-tabbar__item.is-active {
  color: #f8fafc;
  background: rgba(59, 130, 246, 0.22);
}

:root[data-theme-mode="dark"] .app-tabbar__sheet,
.dark .app-tabbar__sheet {
  background: #0f172a;
}

:root[data-theme-mode="dark"] .app-tabbar__sheet-title,
.dark .app-tabbar__sheet-title {
  color: #f8fafc;
}

:root[data-theme-mode="dark"] .app-tabbar__sheet-header,
.dark .app-tabbar__sheet-header {
  border-bottom-color: rgba(30, 41, 59, 0.85);
}

:root[data-theme-mode="dark"] .app-tabbar__sheet-close,
.dark .app-tabbar__sheet-close {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(248, 250, 252, 0.8);
}
</style>
