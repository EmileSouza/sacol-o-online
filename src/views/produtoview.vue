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

      <div class="carrinho"  @click="$router.push('/carrinho')">
  🛒
  <span class="badge">{{ carrinho.length }}</span>
     
  </div>
  </div>
</div>
</nav>
    
  <div v-if="produto" class="produto-container">

    <!-- IMAGEM -->
    <div class="produto-imagem">
      <img :src="produto.imagem" />
    </div>

    <!-- INFO -->
    <div class="produto-info">

      <h1>{{ produto.nome }}</h1>

      <p class="preco">
        R$ {{  produto.preco }} 
      </p>

      <p class="descricao">
        {{ produto.descricao }}
      </p>

      <!-- QUANTIDADE -->
      <div class="quantidade">
        <button @click="diminuir">-</button>

        <span>{{ quantidade }} / {{ produto.unidade }} </span>

        <button @click="aumentar">+</button>
      </div>

     <p class="preco">
      Total: R$ {{ precoTotal }}
      </p>

      <!-- BOTÕES -->
      <div class="botoes">

       <button class="btn-carrinho" @click="adicionarCarrinho"> 
  🛒 Adicionar ao carrinho
      </button>

        <button class="btn-comprar" @click="comprarAgora">
          Comprar agora
        </button>

      </div>

    </div>

  </div>

 
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/config/firebase"
import { carrinho, carrinhoQuantidade, adicionarAoCarrinho } from "@/stores/carrinho"
 
 

const route = useRoute()
const router = useRouter()
const produto = ref(null)

const quantidade = ref(1)
 

function aumentar() {
  if (quantidade.value < 5) {
    quantidade.value++
  }
}

function diminuir() {
  if (quantidade.value > 1) {
    quantidade.value--
  }
}

function adicionarCarrinho(){
  adicionarAoCarrinho(produto.value, quantidade.value)
}

function comprarAgora(){
  adicionarAoCarrinho(produto.value, quantidade.value)
  router.push('/finalizar')
}

const precoTotal = computed(() => {
    if (!produto.value) return 0
  return (quantidade.value * produto.value.preco).toFixed(2)
})

onMounted(async () => {

  const produtoId = route.params.id

  const docRef = doc(db, "produtos", produtoId)

  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
   produto.value = {
  id: docSnap.id,
  ...docSnap.data()
} 
    console.log("Produto carregado:", produto.value)
  } else {
    console.log("Produto não encontrado")
  }
  

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

.produto-container{
  max-width:1000px;
  margin:80px auto;
  display:flex;
  gap:60px;
  align-items:center;
  justify-content: center;
}

/* imagem */

.produto-imagem{
  flex:1;
  display:flex;
  justify-content:center;
}

.produto-imagem img{
  width:400px;
  object-fit:contain;
}

/* info */

.produto-info{
  flex:1;
}

.produto-info h1{
  font-size:28px;
}

.preco{
  font-size:22px;
  color:#2e7d32;
  font-weight:bold;
  margin:10px 0;
}

.descricao{
  margin-bottom:20px;
  color:#555;
}

/* quantidade */

.quantidade{
  margin-bottom:20px;
}

.quantidade select{
  padding:8px;
  border-radius:6px;
  border:1px solid #ccc;
}

/* botões */

.botoes{
  display:flex;
  flex-direction:column;
  gap:10px;
  width:200px;
  padding:8px;
  font-size:14px;
}

.botoes button{
  padding:8px;
  font-size:14px;
}

.btn-carrinho{
  background:#f57c00;
  color:white;
  border:none;
  padding:12px 20px;
  border-radius:8px;
  cursor:pointer;
}

.btn-comprar{
  background:#2e7d32;
  color:white;
  border:none;
  padding:12px 20px;
  border-radius:8px;
  cursor:pointer;
}
 
 .quantidade{
  display:flex;
  align-items:center;
  gap:15px;
  margin:20px 0;
}

.quantidade button{
  width:35px;
  height:35px;
  font-size:18px;
  border:none;
  background:#eee;
  cursor:pointer;
}

.preco{
  font-size:24px;
  font-weight:bold;
  color:#2e7d32;
}

.produto-imagem img{
  width:380px;
  transition: transform 0.3s;
}

.produto-imagem img:hover{
  transform:scale(1.1);
}
</style>