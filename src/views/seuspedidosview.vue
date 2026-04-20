<template>
  <nav class="navbar">
    <div class="navbar-content">
      <div class="actions">
        <div class="perfil">👤 Perfil</div>
      </div>
    </div>
  </nav>

  <div class="container">
    <h1 class="titulo">Meus Pedidos</h1>

    <div v-if="pedidos.length === 0" class="empty-state">
      <p>Você ainda não tem pedidos. Finalize uma compra para ver o pedido aqui.</p>
    </div>

    <div v-else class="pedidos-list">
      <div v-for="pedido in pedidos" :key="pedido.id" class="pedido-card">
        <div class="pedido-header">
          <div>
            <p class="pedido-id">Pedido {{ pedido.id }}</p>
            <p class="pedido-date">{{ pedido.date }}</p>
          </div>
          <span :class="['pedido-status', statusClass(pedido.status)]">{{ pedido.status }}</span>
        </div>

        <div class="pedido-content">
          <div class="pedido-preview">
            <img :src="pedido.image" alt="Imagem do produto" class="pedido-image" />
            <div class="pedido-texto">
              <p class="pedido-description">{{ pedido.description }}</p>
              <p class="pedido-loja">{{ pedido.storeName }}</p>
              <p class="pedido-payment">Forma de pagamento: {{ pedido.paymentMethod }}</p>
              <p v-if="pedido.cardMask" class="pedido-card">Cartão: {{ pedido.cardMask }}</p>
            </div>
          </div>

          <div class="pedido-dados">
            <div class="pedido-dado">
              <span>Total</span>
              <strong>R$ {{ pedido.total.toFixed(2) }}</strong>
            </div>
            <div class="pedido-dado">
              <span>Itens</span>
              <strong>{{ pedido.totalItems }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { pedidos } from '@/stores/pedidos'

const statusClass = (status) => {
  return status === 'Falha no pagamento' ? 'failed' : 'processed'
}
</script>

<style scoped>
.navbar {
  background: #ffffff;
  padding: 14px 0;
  border-bottom: 1px solid #eee;
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px 20px;
}

.titulo {
  text-align: center;
  margin-bottom: 24px;
  font-size: 30px;
  color: #101110;
}

.empty-state {
  background: #fff;
  padding: 28px;
  border-radius: 18px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.05);
  text-align: center;
  color: #555;
}

.pedidos-list {
  display: grid;
  gap: 22px;
}

.pedido-card {
  background: #ffffff;
  padding: 24px;
  border-radius: 18px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.05);
  border: 1px solid #ececec;
}

.pedido-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.pedido-id {
  font-weight: 700;
  color: #111;
  margin-bottom: 6px;
}

.pedido-date {
  color: #777;
  font-size: 14px;
}

.pedido-status {
  padding: 10px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
}

.pedido-status.processed {
  background: #e6f9ed;
  color: #1a7f2e;
}

.pedido-status.failed {
  background: #ffe3e6;
  color: #a11f2f;
}

.pedido-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pedido-preview {
  display: flex;
  gap: 18px;
  align-items: start;
}

.pedido-image {
  width: 110px;
  height: 110px;
  object-fit: cover;
  border-radius: 18px;
  border: 1px solid #eee;
}

.pedido-texto {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pedido-description {
  font-size: 18px;
  font-weight: 700;
  color: #111;
}

.pedido-loja,
.pedido-payment,
.pedido-card {
  color: #555;
  font-size: 14px;
}

.pedido-dados {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.pedido-dado {
  background: #f8fafc;
  padding: 18px;
  border-radius: 14px;
  border: 1px solid #e6e9ef;
}

.pedido-dado span {
  display: block;
  color: #777;
  margin-bottom: 8px;
}

.pedido-dado strong {
  display: block;
  font-size: 18px;
  color: #111;
}
</style>
