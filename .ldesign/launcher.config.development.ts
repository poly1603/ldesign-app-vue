import { defineConfig } from '@ldesign/launcher'

/**
 * 开发环境 Launcher 配置
 *
 * 此配置会与基础配置（launcher.config.ts）深度合并
 * 开发环境特点：
 * - 详细的日志输出
 * - 启用 sourcemap
 * - 自动打开浏览器
 * - 允许外部访问（0.0.0.0）
 * - 不压缩代码
 */
export default defineConfig({
  /**
   * 开发服务器配置
   */
  server: {
    host: '0.0.0.0', // 允许外部访问（手机、其他设备）
    port: 4000, // 开发服务器端口
    open: true, // 自动打开浏览器
    cors: true, // 启用 CORS
    strictPort: false, // 端口被占用时自动使用下一个可用端口

    // 代理配置 - 开发环境 API 代理
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
      '/ws': {
        target: 'ws://localhost:8080',
        ws: true,
      },
    },

    // HMR 配置
    hmr: {
      overlay: true, // 显示错误覆盖层
      // clientPort 会自动使用服务器端口，不需要手动指定
    },
  },

  /**
   * 预览服务器配置
   */
  preview: {
    host: '0.0.0.0',
    port: 4300,
    strictPort: false,
    open: true,
    cors: true,
  },

  /**
   * 构建配置
   */
  build: {
    outDir: 'dist',
    sourcemap: true, // 开发环境生成 sourcemap
    minify: false, // 开发环境不压缩（方便调试）
    target: 'esnext',
    emptyOutDir: true,

    // 代码分割配置
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router'],
          'ldesign-engine': ['@ldesign/engine-vue3'],
          'ldesign-router': ['@ldesign/router-vue'],
        },
      },
    },
  },

  /**
   * 路径别名配置
   *
   * 注意：使用数组格式，以便与基础配置（launcher.config.ts）正确合并
   */
  resolve: {
    alias: [
      { find: '@components', replacement: '/src/components' },
      { find: '@views', replacement: '/src/views' },
      { find: '@utils', replacement: '/src/utils' },
      { find: '@assets', replacement: '/src/assets' },
      { find: '@styles', replacement: '/src/styles' },
      { find: '@test', replacement: '/src/test' }, // 测试别名
      { find: '@lib', replacement: '/src/lib' }, // 新增库别名 - 测试热更新
      { find: '@hooks4', replacement: '/src/hooks' }, // 测试 Launcher 配置热更新（别名变更）
    ],
    // 关键：避免重复依赖导致的 Symbol 注入失败
    dedupe: ['vue', '@ldesign/i18n-vue', '@ldesign/engine-vue3', '@ldesign/router-vue', '@ldesign/i18n-core'],
  },

  /**
   * CSS 配置
   */
  css: {
    devSourcemap: true, // CSS sourcemap
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },

  /**
   * 依赖优化配置
   *
   * 排除 @ldesign 包，使用源码直接开发，实现实时更新
   */
  optimizeDeps: {
    force: true, // 强制重新优化依赖
    include: [
      'vue',
      'vue-router',
    ],
    exclude: [
      '@ldesign/engine-core',
      '@ldesign/engine-vue3',
      '@ldesign/router-core',
      '@ldesign/router-vue',
      '@ldesign/i18n-core',
      '@ldesign/i18n-vue',
      '@ldesign/color-core',
      '@ldesign/color-vue',
      '@ldesign/size-core',
      '@ldesign/size-vue',
      '@ldesign/device-core',
      '@ldesign/device-vue',
    ],
  },

  /**
   * 环境变量配置
   */
  envPrefix: 'VITE_',

  /**
   * Launcher 特定配置
   */
  launcher: {
    autoRestart: true, // 开发环境启用配置文件监听和自动重启
    logLevel: 'debug', // 开发环境详细日志
    clearScreen: false, // 不清屏，保留历史日志

    // 环境变量校验
    env: {
      required: [], // 开发环境不强制要求环境变量
      optional: [
        'VITE_API_BASE_URL',
        'VITE_APP_TITLE',
        'VITE_ENABLE_MOCK',
      ],
    },
  },

  /**
   * 定义全局常量
   */
  define: {
    __DEV__: true,
    __PROD__: false,
    __TEST__: false,
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
  },
})
