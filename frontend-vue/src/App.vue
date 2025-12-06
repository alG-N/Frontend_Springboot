<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const cartCount = ref(0)
const isLoggedIn = computed(() => authStore.isAuthenticated)
const username = computed(() => authStore.user?.username)
const isAdmin = computed(() => authStore.isAdmin)

const loadCartCount = async () => {
  if (isLoggedIn.value) {
    try {
      const response = await fetch('http://localhost:8080/api/cart', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        cartCount.value = data.items?.length || 0
      }
    } catch (error) {
      console.error('Error loading cart:', error)
    }
  }
}

const logout = async () => {
  try {
    await fetch('http://localhost:8080/logout', {
      method: 'POST',
      credentials: 'include'
    })
    authStore.logout()
    window.location.href = '/'
  } catch (error) {
    console.error('Logout error:', error)
  }
}

onMounted(() => {
  authStore.checkAuth()
  loadCartCount()
})
</script>

<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-left">
        <RouterLink to="/" class="logo">SHOP</RouterLink>
        <RouterLink to="/products">Sản phẩm</RouterLink>
      </div>
      <div class="nav-right">
        <template v-if="isLoggedIn">
          <span class="username">Xin chào, {{ username }}</span>
          <RouterLink to="/orders">Đơn hàng</RouterLink>
          <RouterLink v-if="isAdmin" to="/admin">Quản trị</RouterLink>
          <button @click="logout" class="btn-link">Đăng xuất</button>
        </template>
        <template v-else>
          <RouterLink to="/login">Đăng nhập</RouterLink>
          <RouterLink to="/register">Đăng ký</RouterLink>
        </template>
        <RouterLink to="/cart" class="btn-cart">
          Giỏ hàng
          <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
        </RouterLink>
      </div>
    </nav>

    <main>
      <RouterView @cart-updated="loadCartCount" />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: #333;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-left, .nav-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.navbar a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.navbar a:hover {
  color: #ddd;
}

.navbar a.router-link-active {
  color: #4caf50;
}

.username {
  color: #ddd;
}

.btn-link {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
}

.btn-link:hover {
  color: #ddd;
}

.btn-cart {
  background: #4caf50;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  position: relative;
}

.btn-cart:hover {
  background: #388e3c;
}

.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #f44336;
  color: white;
  border-radius: 50%;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  min-width: 20px;
  text-align: center;
}

main {
  flex: 1;
  background: #f5f5f5;
}
</style>