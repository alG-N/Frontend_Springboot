import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')

  const login = async (username, password) => {
    loading.value = true
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username,
          password
        }),
        credentials: 'include'
      })

      if (response.ok) {
        await checkAuth()
        return { success: true }
      } else {
        return { success: false, error: 'Tên đăng nhập hoặc mật khẩu không đúng' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Có lỗi xảy ra khi đăng nhập' }
    } finally {
      loading.value = false
    }
  }

  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/user/current', {
        credentials: 'include'
      })
      
      if (response.ok) {
        user.value = await response.json()
      } else {
        user.value = null
      }
    } catch (error) {
      console.error('Check auth error:', error)
      user.value = null
    }
  }

  const logout = () => {
    user.value = null
  }

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    checkAuth,
    logout
  }
})