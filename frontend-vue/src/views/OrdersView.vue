<script setup>
import { ref, onMounted } from 'vue'

const orders = ref([])
const loading = ref(true)

const loadOrders = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/orders', {
      credentials: 'include'
    })
    if (response.ok) {
      orders.value = await response.json()
    }
  } catch (error) {
    console.error('Error loading orders:', error)
  } finally {
    loading.value = false
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('vi-VN')
}

const getStatusColor = (status) => {
  const colors = {
    'PENDING': '#ff9800',
    'CONFIRMED': '#2196f3',
    'SHIPPING': '#9c27b0',
    'COMPLETED': '#4caf50',
    'CANCELLED': '#f44336'
  }
  return colors[status] || '#999'
}

const getStatusText = (status) => {
  const texts = {
    'PENDING': 'Chờ xác nhận',
    'CONFIRMED': 'Đã xác nhận',
    'SHIPPING': 'Đang giao',
    'COMPLETED': 'Hoàn thành',
    'CANCELLED': 'Đã hủy'
  }
  return texts[status] || status
}

onMounted(() => {
  loadOrders()
})
</script>

<template>
  <div class="orders-page">
    <div class="container">
      <h1>Đơn hàng của tôi</h1>

      <div v-if="loading" class="loading">
        Đang tải đơn hàng...
      </div>

      <div v-else-if="orders.length === 0" class="empty">
        <h2>Chưa có đơn hàng nào</h2>
        <p>Hãy đặt hàng ngay!</p>
        <RouterLink to="/products" class="btn-primary">Mua sắm ngay</RouterLink>
      </div>

      <div v-else class="orders-list">
        <div v-for="order in orders" :key="order.id" class="order-card">
          <div class="order-header">
            <div class="order-id">Đơn hàng #{{ order.id }}</div>
            <div 
              class="order-status" 
              :style="{ background: getStatusColor(order.status) }"
            >
              {{ getStatusText(order.status) }}
            </div>
          </div>

          <div class="order-info">
            <p><strong>Ngày đặt:</strong> {{ formatDate(order.createdDate) }}</p>
            <p><strong>Địa chỉ:</strong> {{ order.shippingAddress }}</p>
          </div>

          <div class="order-items">
            <h3>Sản phẩm:</h3>
            <div v-for="item in order.items" :key="item.id" class="order-item">
              <div class="item-info">
                <span class="item-name">{{ item.productName }}</span>
                <span class="item-quantity">x{{ item.quantity }}</span>
              </div>
              <div class="item-price">
                {{ formatPrice(item.price * item.quantity) }}đ
              </div>
            </div>
          </div>

          <div class="order-total">
            <strong>Tổng cộng:</strong> {{ formatPrice(order.totalAmount) }}đ
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orders-page {
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
}

.empty {
  background: white;
  padding: 3rem;
  border-radius: 8px;
  text-align: center;
}

.empty h2 {
  margin-bottom: 1rem;
  color: #666;
}

.empty p {
  margin-bottom: 2rem;
  color: #999;
}

.btn-primary {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: #4caf50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.btn-primary:hover {
  background: #388e3c;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #eee;
}

.order-id {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.order-status {
  padding: 0.5rem 1rem;
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.order-info p {
  margin: 0.5rem 0;
  color: #666;
}

.order-items {
  margin: 1.5rem 0;
}

.order-items h3 {
  margin-bottom: 1rem;
  color: #555;
  font-size: 1.1rem;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.item-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.item-name {
  color: #333;
}

.item-quantity {
  color: #999;
}

.item-price {
  color: #e53935;
  font-weight: bold;
}

.order-total {
  text-align: right;
  font-size: 1.3rem;
  color: #e53935;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #eee;
}
</style>