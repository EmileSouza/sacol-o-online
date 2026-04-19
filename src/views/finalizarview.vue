<template>
  <nav class="navbar">
    <div class="navbar-content">
      <!-- Logo -->
      <div class="logo">
        🛒 Sacolão Online
      </div>
      <!-- Ações -->
      <div class="actions">
        <div class="perfil">
          👤 Perfil
        </div>
      </div>
    </div>
  </nav>

  <div class="container">
    <h1>Finalizar Compra</h1>

    <div v-if="carrinho.length === 0">
      <p>Seu carrinho está vazio. Adicione produtos antes de finalizar.</p>
      <button @click="$router.push('/home')">Voltar à loja</button>
    </div>

    <div v-else>
      <h2>Resumo do Pedido</h2>
      <div class="resumo">
        <div v-for="produto in carrinho" :key="produto.id" class="item">
          <img :src="produto.imagem" width="50" />
          <div>
            <h4>{{ produto.nome }}</h4>
            <p>{{ produto.quantidade }} x R$ {{ produto.preco }}</p>
          </div>
          <p>R$ {{ (produto.quantidade * produto.preco).toFixed(2) }}</p>
        </div>
      </div>

      <h3>Total: R$ {{ total }}</h3>

      <form @submit.prevent="finalizarCompra">
        <label>
          Nome Completo:
          <input v-model="nome" required />
        </label>
        <label>
          Endereço:
          <input v-model="endereco" required />
        </label>
        <label>
          Telefone:
          <input v-model="telefone" required />
        </label>
        <button type="submit">Confirmar Pedido</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { carrinho } from '@/stores/carrinho'

const router = useRouter()

const nome = ref('')
const endereco = ref('')
const telefone = ref('')

const total = computed(() => {
  return carrinho.value
    .reduce((soma, produto) => soma + produto.preco * produto.quantidade, 0)
    .toFixed(2)
})

function finalizarCompra() {
  // Aqui você pode implementar a lógica para salvar o pedido no Firestore
  alert('Pedido finalizado! (Implementar lógica de salvar pedido)')
  // Limpar carrinho após finalizar
  carrinho.value = []
  router.push('/home')
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.resumo {
  margin-bottom: 20px;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  display: flex;
  flex-direction: column;
}

input {
  padding: 8px;
  margin-top: 5px;
}

button {
  padding: 10px;
  background: #28a745;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background: #218838;
}
</style>
