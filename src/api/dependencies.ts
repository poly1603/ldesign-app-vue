/**
 * 依赖管理 API
 * Dependency Management API
 */

export interface Dependency {
  name: string
  version: string
  currentVersion?: string
  latestVersion?: string
  type: 'dependencies' | 'devDependencies'
  description?: string
}

export interface NpmrcConfig {
  registry?: string
  scopes?: Record<string, string>
  customConfig?: string
}

/**
 * 获取项目依赖列表
 * Get project dependencies
 */
export async function getDependencies(): Promise<Dependency[]> {
  try {
    // 在实际应用中，这里应该调用后端 API
    // In real application, this should call backend API
    const response = await fetch('/api/dependencies')
    if (!response.ok) {
      throw new Error('Failed to fetch dependencies')
    }
    return await response.json()
  }
  catch (error) {
    console.error('[API] Failed to get dependencies:', error)
    // 返回模拟数据用于演示
    // Return mock data for demo
    return getMockDependencies()
  }
}

/**
 * 安装依赖
 * Install dependency
 */
export async function installDependency(
  name: string,
  version?: string,
  type: 'dependencies' | 'devDependencies' = 'dependencies',
): Promise<{ success: boolean, message: string }> {
  try {
    const response = await fetch('/api/dependencies/install', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, version, type }),
    })

    if (!response.ok) {
      throw new Error('Failed to install dependency')
    }

    return await response.json()
  }
  catch (error) {
    console.error('[API] Failed to install dependency:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '安装失败',
    }
  }
}

/**
 * 升级依赖
 * Upgrade dependency
 */
export async function upgradeDependency(
  name: string,
  version: string,
): Promise<{ success: boolean, message: string }> {
  try {
    const response = await fetch('/api/dependencies/upgrade', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, version }),
    })

    if (!response.ok) {
      throw new Error('Failed to upgrade dependency')
    }

    return await response.json()
  }
  catch (error) {
    console.error('[API] Failed to upgrade dependency:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '升级失败',
    }
  }
}

/**
 * 删除依赖
 * Remove dependency
 */
export async function removeDependency(
  name: string,
): Promise<{ success: boolean, message: string }> {
  try {
    const response = await fetch(`/api/dependencies/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to remove dependency')
    }

    return await response.json()
  }
  catch (error) {
    console.error('[API] Failed to remove dependency:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '删除失败',
    }
  }
}

/**
 * 获取 .npmrc 配置
 * Get .npmrc configuration
 */
export async function getNpmrcConfig(): Promise<NpmrcConfig> {
  try {
    const response = await fetch('/api/dependencies/npmrc')
    if (!response.ok) {
      throw new Error('Failed to fetch npmrc config')
    }
    return await response.json()
  }
  catch (error) {
    console.error('[API] Failed to get npmrc config:', error)
    return {
      registry: 'https://registry.npmjs.org/',
      scopes: {},
      customConfig: '',
    }
  }
}

/**
 * 更新 .npmrc 配置
 * Update .npmrc configuration
 */
export async function updateNpmrcConfig(
  config: NpmrcConfig,
): Promise<{ success: boolean, message: string }> {
  try {
    const response = await fetch('/api/dependencies/npmrc', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    })

    if (!response.ok) {
      throw new Error('Failed to update npmrc config')
    }

    return await response.json()
  }
  catch (error) {
    console.error('[API] Failed to update npmrc config:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '更新失败',
    }
  }
}

/**
 * 检查依赖更新
 * Check for dependency updates
 */
export async function checkDependencyUpdates(
  name: string,
): Promise<{ latestVersion: string, currentVersion: string }> {
  try {
    const response = await fetch(`/api/dependencies/${encodeURIComponent(name)}/check-updates`)
    if (!response.ok) {
      throw new Error('Failed to check updates')
    }
    return await response.json()
  }
  catch (error) {
    console.error('[API] Failed to check updates:', error)
    return {
      latestVersion: 'unknown',
      currentVersion: 'unknown',
    }
  }
}

/**
 * 模拟依赖数据（用于演示）
 * Mock dependency data (for demo)
 */
function getMockDependencies(): Dependency[] {
  return [
    {
      name: 'vue',
      version: '^3.4.0',
      currentVersion: '3.4.21',
      latestVersion: '3.4.27',
      type: 'dependencies',
      description: 'The Progressive JavaScript Framework',
    },
    {
      name: '@ldesign/engine-vue3',
      version: 'workspace:*',
      currentVersion: '1.0.0',
      latestVersion: '1.0.0',
      type: 'dependencies',
      description: 'LDesign Engine for Vue 3',
    },
    {
      name: '@ldesign/i18n-vue',
      version: 'workspace:*',
      currentVersion: '1.0.0',
      latestVersion: '1.0.0',
      type: 'dependencies',
      description: 'LDesign i18n for Vue',
    },
    {
      name: '@ldesign/router-vue',
      version: 'workspace:*',
      currentVersion: '1.0.0',
      latestVersion: '1.0.0',
      type: 'dependencies',
      description: 'LDesign Router for Vue',
    },
    {
      name: 'vite',
      version: '^7.2.2',
      currentVersion: '7.2.2',
      latestVersion: '7.2.5',
      type: 'devDependencies',
      description: 'Next generation frontend tooling',
    },
    {
      name: '@vitejs/plugin-vue',
      version: '^6.0.1',
      currentVersion: '6.0.1',
      latestVersion: '6.1.0',
      type: 'devDependencies',
      description: 'Vite plugin for Vue 3',
    },
    {
      name: 'vue-tsc',
      version: '^2.0.0',
      currentVersion: '2.0.6',
      latestVersion: '2.0.14',
      type: 'devDependencies',
      description: 'TypeScript support for Vue 3',
    },
  ]
}
