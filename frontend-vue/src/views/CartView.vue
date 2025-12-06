<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const emit = defineEmits(['cart-updated'])

const cartItems = ref([])
const loading = ref(true)

const totalAmount = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    return sum + (item.price * item.quantity)
  }, 0)
})

const loadCart = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/cart', {
      credentials: 'include'
    })
    if (response.ok) {
      const data = await response.json()
      cartItems.value = data.items || []
    }
  } catch (error) {
    console.error('Error loading cart:', error)
  } finally {
    loading.value = false
  }
}

const updateQuantity = async (productId, newQuantity) => {
  if (newQuantity < 1) return

  try {
    const response = await fetch(`http://localhost:8080/api/cart/update/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: parseInt(newQuantity) }),
      credentials: 'include'
    })
    if (response.ok) {
      await loadCart()
      emit('cart-updated')
    }
  } catch (error) {
    console.error('Error updating quantity:', error)
  }
}

const removeItem = async (productId) => {
  if (!confirm('Xóa sản phẩm này khỏi giỏ hàng?')) return

  try {
    const response = await fetch(`http://localhost:8080/api/cart/remove/${productId}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    if (response.ok) {
      await loadCart()
      emit('cart-updated')
    }
  } catch (error) {
    console.error('Error removing item:', error)
  }
}

const clearCart = async () => {
  if (!confirm('Xóa toàn bộ giỏ hàng?')) return

  try {
    const response = await fetch('http://localhost:8080/api/cart/clear', {
      method: 'DELETE',
      credentials: 'include'
    })
    if (response.ok) {
      await loadCart()
      emit('cart-updated')
    }
  } catch (error) {
    console.error('Error clearing cart:', error)
  }
}

const checkout = async () => {
  const address = prompt('Nhập địa chỉ giao hàng:')
  if (!address || address.trim() === '') {
    alert('Vui lòng nhập địa chỉ giao hàng!')
    return
  }

  try {
    const orderData = {
      shippingAddress: address,
      items: cartItems.value.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    }

    const response = await fetch('http://localhost:8080/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
      credentials: 'include'
    })

    if (response.ok) {
      const order = await response.json()
      alert(`Đặt hàng thành công! Mã đơn hàng: #${order.id}`)
      
      await fetch('http://localhost:8080/api/cart/clear', {
        method: 'DELETE',
        credentials: 'include'
      })
      
      emit('cart-updated')
      router.push('/orders')
    } else {
      alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!')
    }
  } catch (error) {
    console.error('Checkout error:', error)
    alert('Có lỗi xảy ra: ' + error.message)
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price)
}

onMounted(() => {
  loadCart()
})
</script>

<template>
  <div class="cart-page">
    <div class="container">
      <h1>Giỏ hàng của bạn</h1>

      <div v-if="loading" class="loading">
        Đang tải giỏ hàng...
      </div>

      <div v-else-if="cartItems.length === 0" class="empty-cart">
        <h2>Giỏ hàng trống</h2>
        <p>Hãy thêm sản phẩm vào giỏ hàng!</p>
        <RouterLink to="/products" class="btn-primary">Mua sắm ngay</RouterLink>
      </div>

      <div v-else class="cart-content">
        <div class="cart-items">
          <div v-for="item in cartItems" :key="item.productId" class="cart-item">
            <div class="item-image">No Image</div>
            <div class="item-info">
              <h3>{{ item.productName }}</h3>
              <p class="item-price">{{ formatPrice(item.price) }}đ</p>
            </div>
            <div class="quantity-control">
              <button @click="updateQuantity(item.productId, item.quantity - 1)">-</button>
              <input 
                type="number" 
                :value="item.quantity" 
                @change="updateQuantity(item.productId, $event.target.value)"
                min="1"
              />
              <button @click="updateQuantity(item.productId, item.quantity + 1)">+</button>
            </div>
            <div class="item-total">
              {{ formatPrice(item.price * item.quantity) }}đ
            </div>
            <button @click="removeItem(item.productId)" class="btn-remove">Xóa</button>
          </div>
        </div>

        <div class="cart-summary">
          <div class="summary-actions">
            <button @click="clearCart" class="btn-clear">Xóa giỏ hàng</button>
            <RouterLink to="/products" class="btn-continue">Tiếp tục mua</RouterLink>
          </div>
          <div class="total-price">
            Tổng cộng: {{ formatPrice(totalAmount) }}đ
          </div>
          <button @click="checkout" class="btn-checkout">Đặt hàng</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
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

.empty-cart {
  background: white;
  padding: 3rem;
  border-radius: 8px;
  text-align: center;
}

.empty-cart h2 {
  margin-bottom: 1rem;
  color: #666;
}

.empty-cart p {
  margin-bottom: 2rem;
  color: #999;
}

.cart-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
}

.cart-items {
  margin-bottom: 2rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  align-items: center;
}

.item-image {
  width: 100px;
  height: 100px;
  background: #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.item-info h3 {
  margin-bottom: 0.5rem;
  color: #333;
}

.item-price {
  color: #e53935;
  font-weight: bold;
  font-size: 1.2rem;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-control button {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.quantity-control button:hover {
  background: #f5f5f5;
}

.quantity-control input {
  width: 60px;
  text-align: center;
  border: 1px solid #ddd;
  padding: 0.25rem;
  border-radius: 4px;
}

.item-total {
  color: #e53935;
  font-weight: bold;
  font-size: 1.2rem;
  min-width: 120px;
  text-align: right;
}

.btn-remove {
  background: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-remove:hover {
  background: #d32f2f;
}

.cart-summary {
  padding-top: 2rem;
  border-top: 2px solid #eee;
}

.summary-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.btn-clear {
  padding: 0.75rem 2rem;
  background: #ff9800;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-clear:hover {
  background: #f57c00;
}

.btn-continue {
  padding: 0.75rem 2rem;
  background: #2196f3;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.btn-continue:hover {
  background: #1976d2;
}

.total-price {
  font-size: 2rem;
  color: #e53935;
  font-weight: bold;
  margin: 1rem 0;
  text-align: right;
}

.btn-checkout {
  width: 100%;
  padding: 1rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
}

.btn-checkout:hover {
  background: #388e3c;
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
</style>