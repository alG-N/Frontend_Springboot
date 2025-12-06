<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const result = await authStore.login(username.value, password.value)
    
    if (result.success) {
      router.push('/')
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = 'Có lỗi xảy ra. Vui lòng thử lại!'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <h1>Đăng nhập</h1>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Tên đăng nhập</label>
          <input 
            v-model="username" 
            type="text" 
            required 
            :disabled="loading"
            placeholder="Nhập tên đăng nhập"
          />
        </div>

        <div class="form-group">
          <label>Mật khẩu</label>
          <input 
            v-model="password" 
            type="password" 
            required 
            :disabled="loading"
            placeholder="Nhập mật khẩu"
          />
        </div>

        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
        </button>
      </form>

      <div class="links">
        <p>Chưa có tài khoản? <RouterLink to="/register">Đăng ký ngay</RouterLink></p>
        <p><RouterLink to="/">← Về trang chủ</RouterLink></p>
      </div>

      <div class="test-accounts">
        <p><strong>Tài khoản test:</strong></p>
        <p>Admin: admin / 123456</p>
        <p>User: user1 / 123456</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: calc(100vh - 70px);
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.login-container {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
}

.error-message {
  background: #f44336;
  color: white;
  padding: 0.75rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.btn-submit {
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.btn-submit:hover:not(:disabled) {
  background: #5568d3;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.links {
  text-align: center;
  margin-top: 1rem;
}

.links p {
  margin: 0.5rem 0;
}

.links a {
  color: #667eea;
  text-decoration: none;
}

.links a:hover {
  text-decoration: underline;
}

.test-accounts {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #ddd;
  color: #999;
  font-size: 0.9rem;
}

.test-accounts p {
  margin: 0.25rem 0;
}
</style>