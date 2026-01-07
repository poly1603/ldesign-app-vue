<template>
  <div class="crypto-demo page-container">
    <div class="page-header section-card">
      <div class="header-content">
        <div class="header-icon">
          <Lock class="icon-hero" />
        </div>
        <div>
          <h1 class="page-title">加密功能演示</h1>
          <p class="page-desc">展示 @ldesign/crypto-vue 的功能，包括 AES 加密、哈希运算和安全存储。</p>
        </div>
      </div>
    </div>

    <!-- 基础加密/解密 -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">
          <KeyRound class="section-icon" />
          基础加密/解密
        </h2>
      </div>
      <div class="form-group">
        <label class="form-label">原始数据：</label>
        <input v-model="plainText" type="text" placeholder="输入要加密的文本" class="input" />
      </div>

      <div class="form-group">
        <label class="form-label">密钥：</label>
        <input v-model="secretKey" type="password" placeholder="输入密钥" class="input" />
      </div>

      <div class="button-group">
        <button class="action-btn primary" @click="handleEncrypt" :disabled="loading">
          <Lock class="btn-icon" />
          {{ loading ? '加密中...' : '加密' }}
        </button>
        <button class="action-btn secondary" @click="handleDecrypt" :disabled="loading || !encryptedText">
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
          <button class="action-btn small danger" @click="clearError">清除</button>
        </div>
      </div>
    </div>

    <!-- 哈希功能 -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">
          <Hash class="section-icon" />
          哈希功能
        </h2>
      </div>
      <div class="form-group">
        <label class="form-label">输入文本：</label>
        <input v-model="hashInput" type="text" placeholder="输入要哈希的文本" class="input" />
      </div>

      <div class="button-group">
        <button class="action-btn" @click="handleHash('md5')">MD5</button>
        <button class="action-btn" @click="handleHash('sha256')">SHA-256</button>
        <button class="action-btn" @click="handleHash('sha512')">SHA-512</button>
      </div>

      <div v-if="hashResult" class="result-box">
        <h3>哈希结果 ({{ hashAlgorithm }})：</h3>
        <code class="code-block">{{ hashResult }}</code>
      </div>
    </div>

    <!-- 本地存储加密 -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">
          <Save class="section-icon" />
          本地存储加密
        </h2>
      </div>
      <div class="form-group">
        <label class="form-label">存储键名：</label>
        <input v-model="storageKey" type="text" placeholder="输入键名" class="input" />
      </div>

      <div class="form-group">
        <label class="form-label">存储值：</label>
        <input v-model="storageValue" type="text" placeholder="输入要存储的值" class="input" />
      </div>

      <div class="button-group">
        <button class="action-btn primary" @click="handleSaveEncrypted">
          <Save class="btn-icon" />
          加密并保存
        </button>
        <button class="action-btn secondary" @click="handleLoadEncrypted">
          <Unlock class="btn-icon" />
          读取并解密
        </button>
        <button class="action-btn danger" @click="handleClearStorage">
          <Trash2 class="btn-icon" />
          清除
        </button>
      </div>

      <div v-if="loadedValue" class="result-box success">
        <h3>读取的值：</h3>
        <code class="code-block">{{ loadedValue }}</code>
      </div>
    </div>
  </div>
</template>

<style scoped>
.crypto-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--size-space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--size-space-lg);
}

/* Page Header */
.page-header {
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800));
  color: white;
  padding: var(--size-space-xl);
  border-radius: var(--size-radius-lg);
  border: none;
}

.header-content {
  display: flex;
  align-items: center;
  gap: var(--size-space-lg);
}

.header-icon {
  background: rgba(255, 255, 255, 0.2);
  padding: var(--size-space-md);
  border-radius: var(--size-radius-round);
  display: flex;
}

.icon-hero {
  width: 48px;
  height: 48px;
  color: white;
}

.page-title {
  font-size: var(--size-font-2xl);
  font-weight: 700;
  margin: 0 0 var(--size-space-xs);
  color: white;
}

.page-desc {
  font-size: var(--size-font-md);
  opacity: 0.9;
  margin: 0;
  max-width: 600px;
}

/* Section Card */
.section-card {
  background: var(--color-bg-container);
  border-radius: var(--size-radius-lg);
  padding: var(--size-space-lg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-border-secondary);
}

.section-header {
  margin-bottom: var(--size-space-md);
  border-bottom: 1px solid var(--color-border-secondary);
  padding-bottom: var(--size-space-sm);
}

.section-title {
  font-size: var(--size-font-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--size-space-sm);
  margin: 0;
}

.section-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary-500);
}

/* Form & Inputs */
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
  transition: all 0.2s;
}

.input:focus {
  border-color: var(--color-primary-500);
  outline: none;
  box-shadow: 0 0 0 2px var(--color-primary-100);
}

/* Buttons */
.button-group {
  display: flex;
  gap: var(--size-space-md);
  margin-bottom: var(--size-space-md);
  flex-wrap: wrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: var(--size-radius-md);
  background: var(--color-bg-container);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  cursor: pointer;
  font-size: var(--size-font-sm);
  transition: all 0.2s;
  font-weight: 500;
  flex: 1;
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.action-btn:hover:not(:disabled) {
  background: var(--color-bg-hover);
  transform: translateY(-1px);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-btn.primary {
  background: var(--color-primary-500);
  color: white;
  border-color: var(--color-primary-500);
}

.action-btn.primary:hover:not(:disabled) {
  background: var(--color-primary-600);
}

.action-btn.secondary {
  background: var(--color-bg-page);
}

.action-btn.danger {
  background: var(--color-error-50);
  color: var(--color-error-600);
  border-color: var(--color-error-200);
}

.action-btn.danger:hover:not(:disabled) {
  background: var(--color-error-100);
}

.action-btn.small {
  padding: 4px 8px;
  font-size: var(--size-font-xs);
  flex: 0 0 auto;
}

/* Result Box */
.result-box {
  margin-top: var(--size-space-md);
  padding: var(--size-space-md);
  background: var(--color-bg-page);
  border-radius: var(--size-radius-md);
  border: 1px solid var(--color-border);
}

.result-box h3 {
  margin: 0 0 8px 0;
  color: var(--color-text-secondary);
  font-size: var(--size-font-sm);
}

.result-box.success {
  background: var(--color-success-bg);
  border-color: var(--color-success-border);
}

.result-box.error {
  background: var(--color-error-bg);
  border-color: var(--color-error-border);
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
  font-size: var(--size-font-sm);
}

.msg-icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 768px) {
  .crypto-demo {
    padding: var(--size-space-md);
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .button-group {
    flex-direction: column;
  }
}
</style>
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
