<template>
  <div class="crypto-demo page-shell section-stack">
    <div class="header-section">
      <h1 class="page-title">
        <Lock class="icon-title" />
        加密功能演示
      </h1>
      <p class="page-desc">展示 @ldesign/crypto-vue 的功能，包括 AES 加密、哈希运算和安全存储。</p>
    </div>

    <section class="section-card">
      <h2 class="section-title">
        <KeyRound class="section-icon" />
        1. 基础加密/解密
      </h2>
      <div class="form-group">
        <label class="form-label">原始数据：</label>
        <input v-model="plainText" type="text" placeholder="输入要加密的文本" class="input" />
      </div>

      <div class="form-group">
        <label class="form-label">密钥：</label>
        <input v-model="secretKey" type="password" placeholder="输入密钥" class="input" />
      </div>

      <div class="button-group">
        <button class="btn primary" @click="handleEncrypt" :disabled="loading">
          <Lock class="btn-icon" />
          {{ loading ? '加密中...' : '加密' }}
        </button>
        <button class="btn" @click="handleDecrypt" :disabled="loading || !encryptedText">
          <Unlock class="btn-icon" />
          {{ loading ? '解密中...' : '解密' }}
        </button>
      </div>

      <div v-if="encryptedText" class="result-box">
        <h3>加密结果：</h3>
        <code class="code-block">{{ encryptedText }}</code>
      </div>

      <div v-if="decryptedText" class="result-box success">
        <h3>解密结果：</h3>
        <code class="code-block">{{ decryptedText }}</code>
      </div>

      <div v-if="error" class="result-box error">
        <div class="flex-between">
          <span class="error-msg">
            <XCircle class="msg-icon" />
            错误：{{ error }}
          </span>
          <button class="btn small danger" @click="clearError">清除</button>
        </div>
      </div>
    </section>

    <section class="section-card">
      <h2 class="section-title">
        <Hash class="section-icon" />
        2. 哈希功能
      </h2>
      <div class="form-group">
        <label class="form-label">输入文本：</label>
        <input v-model="hashInput" type="text" placeholder="输入要哈希的文本" class="input" />
      </div>

      <div class="button-group">
        <button class="btn" @click="handleHash('md5')">MD5</button>
        <button class="btn" @click="handleHash('sha256')">SHA-256</button>
        <button class="btn" @click="handleHash('sha512')">SHA-512</button>
      </div>

      <div v-if="hashResult" class="result-box">
        <h3>哈希结果 ({{ hashAlgorithm }})：</h3>
        <code class="code-block">{{ hashResult }}</code>
      </div>
    </section>

    <section class="section-card">
      <h2 class="section-title">
        <Save class="section-icon" />
        3. 本地存储加密
      </h2>
      <div class="form-group">
        <label class="form-label">存储键名：</label>
        <input v-model="storageKey" type="text" placeholder="输入键名" class="input" />
      </div>

      <div class="form-group">
        <label class="form-label">存储值：</label>
        <input v-model="storageValue" type="text" placeholder="输入要存储的值" class="input" />
      </div>

      <div class="button-group">
        <button class="btn primary" @click="handleSaveEncrypted">
          <Save class="btn-icon" />
          加密并保存
        </button>
        <button class="btn" @click="handleLoadEncrypted">
          <Unlock class="btn-icon" />
          读取并解密
        </button>
        <button class="btn danger" @click="handleClearStorage">
          <Trash2 class="btn-icon" />
          清除
        </button>
      </div>

      <div v-if="loadedValue" class="result-box success">
        <h3>读取的值：</h3>
        <code class="code-block">{{ loadedValue }}</code>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCrypto, useHash } from '@ldesign/crypto-vue'
import {
  Lock,
  Unlock,
  KeyRound,
  Hash,
  Save,
  Trash2,
  XCircle
} from 'lucide-vue-next'

// 基础加密/解密
const plainText = ref('Hello, LDesign!')
const secretKey = ref('my-secret-key-123')
const encryptedText = ref('')
const decryptedText = ref('')

const { encrypt, decrypt, loading, error, clearError } = useCrypto()

async function handleEncrypt() {
  const result = await encrypt(plainText.value, secretKey.value)
  if (result) {
    encryptedText.value = result
    decryptedText.value = ''
  }
}

async function handleDecrypt() {
  const result = await decrypt(encryptedText.value, secretKey.value)
  if (result) {
    decryptedText.value = result
  }
}

// 哈希功能
const hashInput = ref('Hello, World!')
const hashResult = ref('')
const hashAlgorithm = ref('')

const { hash: hashFn } = useHash()

async function handleHash(algorithm: 'md5' | 'sha256' | 'sha512') {
  const result = await hashFn(hashInput.value, algorithm)
  if (result) {
    hashResult.value = result
    hashAlgorithm.value = algorithm.toUpperCase()
  }
}

// 本地存储加密
const storageKey = ref('user-data')
const storageValue = ref('{"name":"张三","age":25}')
const loadedValue = ref('')

function handleSaveEncrypted() {
  // 简单示例：使用加密后存储到 localStorage
  encrypt(storageValue.value, secretKey.value).then((encrypted) => {
    if (encrypted) {
      localStorage.setItem(storageKey.value, encrypted)
      alert('保存成功！')
    }
  })
}

function handleLoadEncrypted() {
  const encrypted = localStorage.getItem(storageKey.value)
  if (encrypted) {
    decrypt(encrypted, secretKey.value).then((decrypted) => {
      if (decrypted) {
        loadedValue.value = decrypted
      }
    })
  } else {
    alert('未找到数据')
  }
}

function handleClearStorage() {
  localStorage.removeItem(storageKey.value)
  loadedValue.value = ''
  alert('已清除')
}
</script>

<style scoped>
.crypto-demo {
  max-width: 800px;
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

.section-card {
  margin-bottom: var(--size-space-lg);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--size-space-sm);
  font-size: var(--size-font-lg);
  color: var(--color-text-primary);
  margin-bottom: var(--size-space-md);
  border-bottom: 1px solid var(--color-border-secondary);
  padding-bottom: var(--size-space-sm);
  font-weight: 600;
}

.section-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary-500);
}

.form-group {
  margin-bottom: var(--size-space-md);
}

.form-label {
  display: block;
  margin-bottom: var(--size-space-xs);
  color: var(--color-text-secondary);
  font-size: var(--size-font-sm);
  font-weight: 500;
}

.input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--size-radius-md);
  font-size: var(--size-font-sm);
  background: var(--color-bg-container);
  color: var(--color-text-primary);
}

.button-group {
  display: flex;
  gap: var(--size-space-md);
  margin-bottom: var(--size-space-md);
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: var(--size-radius-md);
  background: var(--color-bg-component);
  color: var(--color-text-primary);
  cursor: pointer;
  font-size: var(--size-font-sm);
  transition: all 0.2s;
  font-weight: 500;
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.btn:hover:not(:disabled) {
  background: var(--color-bg-component-hover);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.primary {
  background: var(--color-primary-500);
  color: white;
}

.btn.primary:hover:not(:disabled) {
  background: var(--color-primary-600);
}

.btn.danger {
  background: var(--color-error-500);
  color: white;
}

.btn.danger:hover:not(:disabled) {
  background: var(--color-error-600);
}

.btn.small {
  padding: 4px 8px;
  font-size: var(--size-font-xs);
}

.result-box {
  margin-top: var(--size-space-md);
  padding: var(--size-space-md);
  background: var(--color-bg-page);
  border-radius: var(--size-radius-md);
  border: 1px solid var(--color-border);
}

.result-box.success {
  background: var(--color-success-bg);
  border-color: var(--color-success-border);
}

.result-box.error {
  background: var(--color-error-bg);
  border-color: var(--color-error-border);
}

.result-box h3 {
  margin: 0 0 8px 0;
  color: var(--color-text-secondary);
  font-size: var(--size-font-sm);
}

.code-block {
  display: block;
  background: var(--color-bg-layout);
  padding: var(--size-space-sm);
  border-radius: var(--size-radius-sm);
  word-break: break-all;
  font-family: monospace;
  font-size: var(--size-font-xs);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-msg {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-error-500);
}

.msg-icon {
  width: 16px;
  height: 16px;
}
</style>
