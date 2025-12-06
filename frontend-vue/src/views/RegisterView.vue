<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  username: '',
  password: '',
  fullname: '',
  email: ''
})
const error = ref('')
const loading = ref(false)

const handleRegister = async () => {
  error.value = ''
  loading.value = true

  try {
    const response = await fetch('http://localhost:8080/api/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })

    if (response.ok) {
      alert('Đăng ký thành công! Vui lòng đăng nhập.')
      router.push('/login')
    } else {
      const data = await response.text()
      error.value = data || 'Đăng ký thất bại'
    }
  } catch (err) {
    error.value = 'Có lỗi xảy ra. Vui lòng thử lại!'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="register-page">
    <div class="register-container">
      <h1>Đăng ký tài khoản</h1>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Tên đăng nhập</label>
          <input 
            v-model="form.username" 
            type="text" 
            required 
            :disabled="loading"
            placeholder="Nhập tên đăng nhập"
          />
        </div>

        <div class="form-group">
          <label>Mật khẩu</label>
          <input 
            v-model="form.password" 
            type="password" 
            required 
            :disabled="loading"
            placeholder="Nhập mật khẩu"
          />
        </div>

        <div class="form-group">
          <label>Họ tên</label>
          <input 
            v-model="form.fullname" 
            type="text" 
            required 
            :disabled="loading"
            placeholder="Nhập họ tên"
          />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input 
            v-model="form.email" 
            type="email" 
            required 
            :disabled="loading"
            placeholder="Nhập email"
          />
        </div>

        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? 'Đang đăng ký...' : 'Đăng ký' }}
        </button>
      </form>

      <div class="links">
        <p>Đã có tài khoản? <RouterLink to="/login">Đăng nhập</RouterLink></p>
        <p><RouterLink to="/">← Về trang chủ</RouterLink></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  min-height: calc(100vh - 70px);
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.register-container {
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
</style>