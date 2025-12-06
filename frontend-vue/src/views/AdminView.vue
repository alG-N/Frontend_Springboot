<script setup>
import { ref, onMounted } from 'vue'

const activeTab = ref('products')
const products = ref([])
const orders = ref([])
const loading = ref(false)

// Product form
const productForm = ref({
  id: null,
  name: '',
  price: 0,
  description: '',
  stock: 0
})
const showProductForm = ref(false)

const loadProducts = async () => {
  loading.value = true
  try {
    const response = await fetch('http://localhost:8080/api/products', {
      credentials: 'include'
    })
    if (response.ok) {
      products.value = await response.json()
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

const loadOrders = async () => {
  loading.value = true
  try {
    const response = await fetch('http://localhost:8080/api/orders/all', {
      credentials: 'include'
    })
    if (response.ok) {
      orders.value = await response.json()
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

const createProduct = () => {
  productForm.value = { id: null, name: '', price: 0, description: '', stock: 0 }
  showProductForm.value = true
}

const editProduct = (product) => {
  productForm.value = { ...product }
  showProductForm.value = true
}

const saveProduct = async () => {
  try {
    const url = productForm.value.id 
      ? `http://localhost:8080/api/products/${productForm.value.id}`
      : 'http://localhost:8080/api/products'
    
    const response = await fetch(url, {
      method: productForm.value.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productForm.value),
      credentials: 'include'
    })

    if (response.ok) {
      alert('Lưu sản phẩm thành công!')
      showProductForm.value = false
      await loadProducts()
    }
  } catch (error) {
    alert('Lỗi: ' + error.message)
  }
}

const deleteProduct = async (id) => {
  if (!confirm('Xóa sản phẩm này?')) return
  
  try {
    const response = await fetch(`http://localhost:8080/api/products/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    if (response.ok) {
      alert('Đã xóa sản phẩm!')
      await loadProducts()
    }
  } catch (error) {
    alert('Lỗi: ' + error.message)
  }
}

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
      credentials: 'include'
    })
    if (response.ok) {
      alert('Cập nhật trạng thái thành công!')
      await loadOrders()
    }
  } catch (error) {
    alert('Lỗi: ' + error.message)
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('vi-VN')
}

onMounted(() => {
  loadProducts()
  loadOrders()
})
</script>

<template>
  <div class="admin-page">
    <div class="container">
      <h1>Quản trị hệ thống</h1>

      <div class="tabs">
        <button 
          :class="{ active: activeTab === 'products' }"
          @click="activeTab = 'products'"
        >
          Quản lý sản phẩm
        </button>
        <button 
          :class="{ active: activeTab === 'orders' }"
          @click="activeTab = 'orders'"
        >
          Quản lý đơn hàng
        </button>
      </div>

      <!-- Products Tab -->
      <div v-if="activeTab === 'products'" class="tab-content">
        <div class="actions">
          <button @click="createProduct" class="btn-primary">
            + Thêm sản phẩm mới
          </button>
        </div>

        <div v-if="showProductForm" class="modal">
          <div class="modal-content">
            <h2>{{ productForm.id ? 'Sửa' : 'Thêm' }} sản phẩm</h2>
            <form @submit.prevent="saveProduct">
              <div class="form-group">
                <label>Tên sản phẩm</label>
                <input v-model="productForm.name" required />
              </div>
              <div class="form-group">
                <label>Giá</label>
                <input v-model.number="productForm.price" type="number" required />
              </div>
              <div class="form-group">
                <label>Mô tả</label>
                <textarea v-model="productForm.description" rows="3"></textarea>
              </div>
              <div class="form-group">
                <label>Tồn kho</label>
                <input v-model.number="productForm.stock" type="number" required />
              </div>
              <div class="form-actions">
                <button type="button" @click="showProductForm = false">Hủy</button>
                <button type="submit" class="btn-primary">Lưu</button>
              </div>
            </form>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.id }}</td>
              <td>{{ product.name }}</td>
              <td>{{ formatPrice(product.price) }}đ</td>
              <td>{{ product.stock }}</td>
              <td>
                <button @click="editProduct(product)" class="btn-edit">Sửa</button>
                <button @click="deleteProduct(product.id)" class="btn-delete">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Orders Tab -->
      <div v-if="activeTab === 'orders'" class="tab-content">
        <div class="orders-list">
          <div v-for="order in orders" :key="order.id" class="order-card">
            <div class="order-header">
              <div>
                <strong>Đơn hàng #{{ order.id }}</strong>
                <p>Khách hàng: {{ order.username }}</p>
                <p>Ngày: {{ formatDate(order.createdDate) }}</p>
              </div>
              <select 
                :value="order.status" 
                @change="updateOrderStatus(order.id, $event.target.value)"
                class="status-select"
              >
                <option value="PENDING">Chờ xác nhận</option>
                <option value="CONFIRMED">Đã xác nhận</option>
                <option value="SHIPPING">Đang giao</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
            </div>
            <div class="order-details">
              <p><strong>Địa chỉ:</strong> {{ order.shippingAddress }}</p>
              <p><strong>Tổng tiền:</strong> {{ formatPrice(order.totalAmount) }}đ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-page {
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

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #eee;
}

.tabs button {
  padding: 1rem 2rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
  border-bottom: 3px solid transparent;
}

.tabs button.active {
  color: #2196f3;
  border-bottom-color: #2196f3;
}

.tab-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
}

.actions {
  margin-bottom: 1.5rem;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:hover {
  background: #388e3c;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.data-table th {
  background: #f5f5f5;
  font-weight: 600;
}

.btn-edit,
.btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
}

.btn-edit {
  background: #2196f3;
  color: white;
}

.btn-delete {
  background: #f44336;
  color: white;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.form-actions button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-card {
  border: 1px solid #eee;
  padding: 1rem;
  border-radius: 4px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.status-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.order-details p {
  margin: 0.5rem 0;
}
</style>