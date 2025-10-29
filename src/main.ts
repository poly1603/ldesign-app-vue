import { createApp } from 'vue'
import { createEngine } from '@ldesign/engine-core'
import { createVueAdapter } from '@ldesign/engine-vue'
import App from './App.vue'
import './style.css'

// 初始化引擎
const engine = createEngine({
  adapter: createVueAdapter({ debug: true }),
  config: {
    name: 'Vue Engine App',
    version: '0.1.0',
  },
})

engine.init()

const app = createApp(App)
app.mount('#app')
