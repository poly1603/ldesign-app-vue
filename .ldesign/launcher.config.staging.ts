import { defineConfig } from '@ldesign/launcher'

/**
 * 预发布环境 Launcher 配置
 *
 * 此配置会与基础配置（launcher.config.ts）深度合并
 * 预发布环境特点：
 * - 接近生产环境的配置
 * - 保留 sourcemap 用于调试
 * - 保留部分日志
 * - 用于最终测试和验证
 */
export default defineConfig({
  /**
   * 开发服务器配置
   */
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: false,
    cors: true,
    strictPort: false,

    // 代理配置 - 预发布环境 API 代理
    proxy: {
      '/api': {
        target: 'https://staging-api.example.com',
        changeOrigin: true,
        secure: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },

  /**
   * 预览服务器配置
   */
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: false,
    open: false,
    cors: true,
  },

  /**
   * 构建配置
   */
  build: {
    outDir: 'dist',
    sourcemap: true, // 预发布环境保留 sourcemap 用于调试
    minify: 'terser', // 启用压缩
    target: 'esnext',
    emptyOutDir: true,

    // Terser 压缩选项（比生产环境宽松）
    terserOptions: {
      compress: {
        drop_console: false, // 保留 console（用于调试）
        drop_debugger: true,
        pure_funcs: ['console.debug'], // 只移除 debug 日志
      },
      format: {
        comments: false,
      },
    },

    // 代码分割配置
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router'],
          'ldesign-engine': ['@ldesign/engine-vue3'],
          'ldesign-router': ['@ldesign/router-vue'],
        },

        // 文件命名（带 hash）
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },

    reportCompressedSize: true,
    chunkSizeWarningLimit: 500,
  },

  /**
   * 路径别名配置
   */
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@views': '/src/views',
      '@utils': '/src/utils',
      '@assets': '/src/assets',
      '@styles': '/src/styles',
    },
  },

  /**
   * CSS 配置
   */
  css: {
    devSourcemap: true, // 预发布环境生成 CSS sourcemap
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },

  /**
   * 依赖优化配置
   */
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@ldesign/engine-vue3',
      '@ldesign/router-vue',
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
    logLevel: 'info', // 预发布环境显示信息级别日志
    clearScreen: false,

    // 环境变量校验
    env: {
      required: [
        'VITE_API_BASE_URL',
      ],
      optional: [
        'VITE_APP_TITLE',
        'VITE_SENTRY_DSN',
      ],
    },
  },

  /**
   * 定义全局常量
   */
  define: {
    __DEV__: false,
    __PROD__: false,
    __TEST__: false,
    __STAGING__: true,
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
  },
})
