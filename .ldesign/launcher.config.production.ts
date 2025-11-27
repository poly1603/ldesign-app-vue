import { defineConfig } from '@ldesign/launcher'

/**
 * 生产环境 Launcher 配置
 *
 * 此配置会与基础配置（launcher.config.ts）深度合并
 * 生产环境特点：
 * - 最小日志级别
 * - 启用代码压缩
 * - 不生成 sourcemap（安全考虑）
 * - 清空输出目录
 * - 优化打包体积
 */
export default defineConfig({
  /**
   * 开发服务器配置（生产环境一般不使用，但可用于调试）
   */
  server: {
    host: 'localhost',
    port: 3000,
    open: false,
    cors: false,
    strictPort: true,
  },

  /**
   * 预览服务器配置
   * 修改为与 development 一致的端口 4200
   */
  preview: {
    host: '0.0.0.0',
    port: 4200, // 修改为 4200，与 development 保持一致
    strictPort: false, // 修改为 false，端口被占用时自动切换
    open: true, // 修改为 true，自动打开浏览器
    cors: true, // 修改为 true，启用 CORS
  },

  /**
   * 构建配置
   */
  build: {
    outDir: 'dist',
    sourcemap: false, // 生产环境不生成 sourcemap
    minify: 'terser', // 使用 terser 压缩（更好的压缩率）
    target: 'esnext',
    emptyOutDir: true,

    // Terser 压缩选项
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console
        drop_debugger: true, // 移除 debugger
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      format: {
        comments: false, // 移除注释
      },
    },

    // 代码分割配置
    rollupOptions: {
      output: {
        // 更细粒度的代码分割
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

    // 打包体积分析
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500, // 500KB 警告阈值
  },

  /**
   * 路径别名配置
   * 生产环境也应该与开发环境保持一致，确保构建后的代码能正确解析所有引用
   */
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@views': '/src/views',
      '@utils': '/src/utils',
      '@assets': '/src/assets',
      '@styles': '/src/styles',
      '@test': '/src/test',
      '@lib': '/src/lib',
      '@hooks4': '/src/hooks',
    },
    // 关键：避免重复依赖导致的 Symbol 注入失败（生产环境同样需要）
    dedupe: ['vue', '@ldesign/i18n-vue', '@ldesign/engine-vue3', '@ldesign/router-vue', '@ldesign/i18n-core'],
  },

  /**
   * CSS 配置
   */
  css: {
    devSourcemap: false, // 生产环境不生成 CSS sourcemap
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
    logLevel: 'warn', // 生产环境只显示警告和错误
    clearScreen: true, // 清屏，保持输出简洁

    // 环境变量校验
    env: {
      required: [
        'VITE_API_BASE_URL', // 生产环境必须提供 API 地址
      ],
      optional: [
        'VITE_APP_TITLE',
        'VITE_SENTRY_DSN',
        'VITE_GA_ID',
      ],
    },
  },

  /**
   * 定义全局常量
   */
  define: {
    __DEV__: false,
    __PROD__: true,
    __TEST__: false,
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
  },
})
