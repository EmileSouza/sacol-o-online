<template>
  <nav class="navbar">
    <div class="navbar-content">
      <div class="logo">🛒 Sacolão Online</div>

      <div class="search-box">
        <input
          v-model="busca"
          type="text"
          placeholder="Buscar produtos..."
        />
      </div>

      <div class="actions">
        <div class="perfil" @click="$router.push('/perfil')">
          👤 Perfil
        </div>

        <div class="carrinho" @click="$router.push('/carrinho')">
          🛒
          <span class="badge">{{ carrinhoQuantidade }}</span>
        </div>
      </div>
    </div>
  </nav>

  <div class="produtos">
    <div
      v-for="produto in produtosFiltrados"
      :key="produto.id"
      class="card"
      @click="abrirProduto(produto)"
    >
      <img :src="produto.imagem" />

      <div class="info">
        <h3>{{ produto.nome }}</h3>
        <p class="preco">
          R$ {{ Number(produto.preco).toFixed(2) }} / {{ produto.unidade }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/config/firebase"
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { carrinhoQuantidade } from "@/stores/carrinho"

const router = useRouter()

const produtos = ref([])
const busca = ref("")

function abrirProduto(produto) {
  router.push(`/produto/${produto.id}`)
}

onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, "produtos"))

  produtos.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
})

const produtosFiltrados = computed(() => {
  return produtos.value.filter((produto) =>
    produto.nome.toLowerCase().includes(busca.value.toLowerCase())
  )
})
</script>

<style scoped>
.navbar {
  background: #ffffff;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.navbar-content {
  max-width: 1200px;
  margin: auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-weight: bold;
  color: #2e7d32;
  font-size: 18px;
}

.search-box input {
  width: 350px;
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid #ddd;
  outline: none;
}

.actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.carrinho {
  position: relative;
  cursor: pointer;
  font-size: 20px;
}

.badge {
  position: absolute;
  top: -8px;
  right: -10px;
  background: #2e7d32;
  color: white;
  font-size: 12px;
  border-radius: 50%;
  padding: 2px 6px;
}
.produtos {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 25px;
}

.card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.info {
  padding: 15px;
}

.preco {
  color: #2e7d32;
  font-weight: bold;
  margin-top: 5px;
}
</style>