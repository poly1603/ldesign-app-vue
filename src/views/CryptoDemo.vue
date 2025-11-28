<template>
  <div class="crypto-demo">
    <h1>🔐 加密功能演示</h1>
    
    <div class="demo-section">
      <h2>1. 基础加密/解密</h2>
      <div class="form-group">
        <label>原始数据：</label>
        <input v-model="plainText" type="text" placeholder="输入要加密的文本" />
      </div>
      
      <div class="form-group">
        <label>密钥：</label>
        <input v-model="secretKey" type="password" placeholder="输入密钥" />
      </div>
      
      <div class="button-group">
        <button @click="handleEncrypt" :disabled="loading">
          {{ loading ? '加密中...' : '加密' }}
        </button>
        <button @click="handleDecrypt" :disabled="loading || !encryptedText">
          {{ loading ? '解密中...' : '解密' }}
        </button>
      </div>
      
      <div v-if="encryptedText" class="result">
        <h3>加密结果：</h3>
        <code>{{ encryptedText }}</code>
      </div>
      
      <div v-if="decryptedText" class="result">
        <h3>解密结果：</h3>
        <code>{{ decryptedText }}</code>
      </div>
      
      <div v-if="error" class="error">
        ❌ 错误：{{ error }}
        <button @click="clearError">清除</button>
      </div>
    </div>

    <div class="demo-section">
      <h2>2. 哈希功能</h2>
      <div class="form-group">
        <label>输入文本：</label>
        <input v-model="hashInput" type="text" placeholder="输入要哈希的文本" />
      </div>
      
      <div class="button-group">
        <button @click="handleHash('md5')">MD5</button>
        <button @click="handleHash('sha256')">SHA-256</button>
        <button @click="handleHash('sha512')">SHA-512</button>
      </div>
      
      <div v-if="hashResult" class="result">
        <h3>哈希结果 ({{ hashAlgorithm }})：</h3>
        <code>{{ hashResult }}</code>
      </div>
    </div>

    <div class="demo-section">
      <h2>3. 本地存储加密</h2>
      <div class="form-group">
        <label>存储键名：</label>
        <input v-model="storageKey" type="text" placeholder="输入键名" />
      </div>
      
      <div class="form-group">
        <label>存储值：</label>
        <input v-model="storageValue" type="text" placeholder="输入要存储的值" />
      </div>
      
      <div class="button-group">
        <button @click="handleSaveEncrypted">加密并保存</button>
        <button @click="handleLoadEncrypted">读取并解密</button>
        <button @click="handleClearStorage">清除</button>
      </div>
      
      <div v-if="loadedValue" class="result">
        <h3>读取的值：</h3>
        <code>{{ loadedValue }}</code>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCrypto, useHash } from '@ldesign/crypto-vue'

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
  padding: 20px;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
}

.demo-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.demo-section h2 {
  color: #34495e;
  margin-bottom: 15px;
  font-size: 1.2em;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

button {
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

button:hover:not(:disabled) {
  background: #2980b9;
}

button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.result {
  background: white;
  padding: 15px;
  border-radius: 4px;
  margin-top: 15px;
}

.result h3 {
  margin: 0 0 10px 0;
  color: #27ae60;
  font-size: 1em;
}

.result code {
  display: block;
  background: #ecf0f1;
  padding: 10px;
  border-radius: 4px;
  word-break: break-all;
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.error {
  background: #fee;
  color: #c33;
  padding: 15px;
  border-radius: 4px;
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error button {
  background: #e74c3c;
  padding: 5px 15px;
}

.error button:hover {
  background: #c0392b;
}
</style>

