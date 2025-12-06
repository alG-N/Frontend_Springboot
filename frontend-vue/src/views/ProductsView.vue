<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const products = ref([])
const loading = ref(true)

const loadProducts = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/products', {
      credentials: 'include'
    })
    if (response.ok) {
      products.value = await response.json()
    }
  } catch (error) {
    console.error('Error loading products:', error)
  } finally {
    loading.value = false
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price)
}

const viewDetail = (id) => {
  router.push(`/products/${id}`)
}

onMounted(() => {
  loadProducts()
})
</script>

<template>
  <div class="products">
    <div class="container">
      <h1>Danh sách sản phẩm</h1>

      <div v-if="loading" class="loading">
        Đang tải sản phẩm...
      </div>

      <div v-else class="product-grid">
        <div 
          v-for="product in products" 
          :key="product.id" 
          class="product-card"
          @click="viewDetail(product.id)"
        >
          <div class="product-image">
            <span v-if="!product.image">No Image</span>
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-price">{{ formatPrice(product.price) }}đ</p>
            <button class="btn-detail">Xem chi tiết</button>
          </div>
        </div>
      </div>

      <div v-if="products.length === 0 && !loading" class="empty">
        Chưa có sản phẩm nào
      </div>
    </div>
  </div>
</template>

<style scoped>
.products {
  padding: 2rem 0;
  min-height: calc(100vh - 70px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #999;
  font-size: 1.2rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.product-image {
  width: 100%;
  height: 200px;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 1.2rem;
}

.product-info {
  padding: 1rem;
}

.product-name {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  color: #e53935;
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0.5rem 0;
}

.btn-detail {
  width: 100%;
  padding: 0.5rem 1rem;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.btn-detail:hover {
  background: #1976d2;
}

.empty {
  text-align: center;
  padding: 3rem;
  color: #999;
  font-size: 1.2rem;
}
</style>