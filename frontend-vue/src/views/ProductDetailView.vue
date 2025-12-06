<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const emit = defineEmits(['cart-updated'])

const product = ref(null)
const quantity = ref(1)
const loading = ref(true)
const showSuccess = ref(false)

const loadProduct = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/products/${route.params.id}`, {
      credentials: 'include'
    })
    if (response.ok) {
      product.value = await response.json()
    } else {
      router.push('/products')
    }
  } catch (error) {
    console.error('Error loading product:', error)
    router.push('/products')
  } finally {
    loading.value = false
  }
}

const addToCart = async () => {
  try {
    const cartItem = {
      productId: product.value.id,
      productName: product.value.name,
      price: product.value.price,
      quantity: quantity.value,
      image: product.value.image
    }

    const response = await fetch('http://localhost:8080/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cartItem),
      credentials: 'include'
    })

    if (response.ok) {
      showSuccess.value = true
      emit('cart-updated')
      setTimeout(() => {
        showSuccess.value = false
      }, 3000)
    }
  } catch (error) {
    console.error('Error adding to cart:', error)
    alert('Có lỗi xảy ra. Vui lòng thử lại!')
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price)
}

onMounted(() => {
  loadProduct()
})
</script>

<template>
  <div class="product-detail-page">
    <div class="container">
      <div v-if="loading" class="loading">
        Đang tải sản phẩm...
      </div>

      <div v-else-if="product" class="product-detail">
        <div class="product-image-section">
          <div class="product-image">
            <span v-if="!product.image">No Image</span>
          </div>
        </div>

        <div class="product-info-section">
          <div v-if="showSuccess" class="success-message">
            ✓ Đã thêm vào giỏ hàng!
          </div>

          <h1>{{ product.name }}</h1>
          
          <div class="product-price">
            {{ formatPrice(product.price) }}đ
          </div>

          <div class="product-description">
            <h3>Mô tả sản phẩm</h3>
            <p>{{ product.description || 'Chưa có mô tả' }}</p>
          </div>

          <div class="quantity-section">
            <label>Số lượng:</label>
            <input 
              v-model.number="quantity" 
              type="number" 
              min="1" 
              class="quantity-input"
            />
          </div>

          <div class="action-buttons">
            <RouterLink to="/products" class="btn-back">
              ← Quay lại
            </RouterLink>
            <button @click="addToCart" class="btn-add-cart">
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-detail-page {
  padding: 2rem 0;
  min-height: calc(100vh - 70px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #999;
  font-size: 1.2rem;
}

.product-detail {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.product-image {
  width: 100%;
  height: 400px;
  background: #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 1.5rem;
}

.product-info-section h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
}

.product-price {
  color: #e53935;
  font-size: 2rem;
  font-weight: bold;
  margin: 1rem 0;
}

.product-description {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 4px;
}

.product-description h3 {
  margin-bottom: 0.5rem;
  color: #555;
}

.product-description p {
  line-height: 1.6;
  color: #666;
}

.quantity-section {
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quantity-section label {
  font-weight: 500;
  color: #555;
}

.quantity-input {
  width: 100px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-back {
  padding: 0.75rem 2rem;
  background: #2196f3;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.3s;
}

.btn-back:hover {
  background: #1976d2;
}

.btn-add-cart {
  flex: 1;
  padding: 0.75rem 2rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-add-cart:hover {
  background: #388e3c;
}

.success-message {
  background: #4caf50;
  color: white;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .product-detail {
    grid-template-columns: 1fr;
  }
}
</style>