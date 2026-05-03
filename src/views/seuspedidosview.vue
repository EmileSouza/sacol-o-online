<template>
  <div class="container">
    <h1>Meus Pedidos</h1>

    <div v-if="carregando" class="loading">
      <p>Carregando seus pedidos...</p>
    </div>

    <div v-else-if="pedidos.length === 0" class="empty-state">
      <p>Você ainda não tem pedidos. Finalize uma compra para ver o pedido aqui.</p>
      <button @click="$router.push('/home')" class="btn-primary">
        Ir para Loja
      </button>
    </div>

    <div v-else class="lista-pedidos">
      <div v-for="pedido in pedidos" :key="pedido.id" class="pedido-card">
        <div class="pedido-header">
          <div class="pedido-info">
            <h3>Pedido #{{ pedido.id.slice(-6).toUpperCase() }}</h3>
            <p>{{ formatarData(pedido.dataPedido) }}</p>
          </div>
          <span :class="['status', pedido.status]">
            {{ pedido.status }}
          </span>
        </div>

        <div class="pedido-itens">
          <div v-for="item in pedido.itens" :key="item.id" class="item">
            <img :src="item.imagem" alt="" />
            <div class="item-info">
              <p class="nome">{{ item.nome }}</p>
              <p class="quantidade">{{ item.quantidade }}x R$ {{ item.preco }}</p>
            </div>
          </div>
        </div>

        <div class="pedido-footer">
          <div class="endereco">
            <strong>📍 Entrega em:</strong>
            <p>{{ pedido.enderecoEntrega?.rua }}, {{ pedido.enderecoEntrega?.numero }}</p>
            <p>{{ pedido.enderecoEntrega?.bairro }} - {{ pedido.enderecoEntrega?.cidade }}/{{ pedido.enderecoEntrega?.estado }}</p>
          </div>
          <div class="total">
            <span>Total:</span>
            <strong>R$ {{ pedido.total?.toFixed(2) }}</strong>
          </div>
        </div>

        <div class="pedido-pagamento">
          <span v-if="pedido.formaPagamento === 'cartao'">
            💳 Cartão **** {{ pedido.cartaoUsado?.ultimoDigitos }}
          </span>
          <span v-else-if="pedido.formaPagamento === 'pix'">
            💠 Pagamento via Pix
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { collection, getDocs } from 'firebase/firestore'
import { db, auth } from '@/config/firebase'

const router = useRouter()
const pedidos = ref([])
const carregando = ref(true)

onMounted(async () => {
  const user = auth.currentUser
  if (!user) {
    router.push('/login')
    return
  }

  try {
    const uid = user.uid
    const pedidosRef = collection(db, 'usuarios', uid, 'pedidos')
    const querySnapshot = await getDocs(pedidosRef)

    pedidos.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Ordena por data (mais recente primeiro)
    pedidos.value.sort((a, b) => {
      const dateA = a.dataPedido?.toDate ? a.dataPedido.toDate() : new Date(a.dataPedido)
      const dateB = b.dataPedido?.toDate ? b.dataPedido.toDate() : new Date(b.dataPedido)
      return dateB - dateA
    })

  } catch (error) {
    console.error('Erro ao carregar pedidos:', error)
  } finally {
    carregando.value = false
  }
})

function formatarData(data) {
  if (!data) return ''
  const date = data.toDate ? data.toDate() : new Date(data)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #2e7d32;
}

.loading, .empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.empty-state p {
  color: #666;
  margin-bottom: 20px;
}

.btn-primary {
  background: #2e7d32;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.lista-pedidos {
  display: grid;
  gap: 20px;
}

.pedido-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.pedido-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
  margin-bottom: 15px;
}

.pedido-info h3 {
  margin: 0 0 5px 0;
  color: #2e7d32;
}

.pedido-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.status {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.status.pendente {
  background: #fff3cd;
  color: #856404;
}

.status.processando {
  background: #d1ecf1;
  color: #0c5460;
}

.status.concluido {
  background: #d4edda;
  color: #155724;
}

.pedido-itens {
  margin-bottom: 15px;
}

.item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.item-info .nome {
  margin: 0 0 5px 0;
  font-weight: 600;
}

.item-info .quantidade {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.pedido-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  padding: 15px 0;
  border-top: 2px solid #f0f0f0;
}

.endereco {
  flex: 1;
}

.endereco strong {
  display: block;
  margin-bottom: 8px;
  color: #2e7d32;
}

.endereco p {
  margin: 3px 0;
  color: #666;
  font-size: 14px;
}

.total {
  text-align: right;
}

.total span {
  display: block;
  color: #666;
  margin-bottom: 5px;
}

.total strong {
  font-size: 24px;
  color: #2e7d32;
}

.pedido-pagamento {
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
  color: #666;
  font-size: 14px;
}
</style>