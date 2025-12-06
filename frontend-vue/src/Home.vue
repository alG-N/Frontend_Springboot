<template>
  <div class="home">
    <div class="hero">
      <h1>Chào mừng đến với Shop</h1>
      <p>Mua sắm trực tuyến dễ dàng và tiện lợi</p>
      <router-link to="/products" class="btn">Xem sản phẩm</router-link>
    </div>
    
    <div class="container">
      <h2>Sản phẩm nổi bật</h2>
      
      <div v-if="loading" class="loading">Đang tải...</div>
      
      <div v-else class="product-grid">
        <div v-for="product in products.slice(0, 4)" :key="product.id" class="product-card">
          <div class="product-image">No Image</div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="price">{{ formatPrice(product.price) }} đ</p>
            <router-link :to="`/products/${product.id}`" class="btn">Xem chi tiết</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { productAPI } from '../services/api';

export default {
  name: 'Home',
  setup() {
    const products = ref([]);
    const loading = ref(true);
    
    const loadProducts = async () => {
      try {
        const response = await productAPI.getAll();
        products.value = response.data;
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const formatPrice = (price) => {
      return new Intl.NumberFormat('vi-VN').format(price);
    };
    
    onMounted(() => {
      loadProducts();
    });
    
    return { products, loading, formatPrice };
  }
};
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 5rem 2rem;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.3rem;
  margin-bottom: 2rem;
}

.container {
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 1rem;
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
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
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 100%;
  height: 200px;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.product-info {
  padding: 1rem;
}

.product-info h3 {
  margin-bottom: 0.5rem;
}

.price {
  color: #e53935;
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0.5rem 0;
}

.btn {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: #2196f3;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.3s;
}

.btn:hover {
  background: #1976d2;
}
</style>