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

<h1 class="titulo">🛒 Meu Carrinho</h1>

<div class="carrinho-container">

 

<!--esquerda -->
<div class="lista-produtos">
  
  <div v-if="carrinho.length === 0" class="carrinho-vazio">
    Seu carrinho está vazio
  </div>

  <div v-else>
    <label class="selecionar-todos">
      <input type="checkbox" v-model="todosSelecionados" />
      Selecionar todos os itens
    </label>

    <div 
      class="produto"
      v-for="produto in carrinho"
      :key="produto.id"
    >
      <input
        type="checkbox"
        class="checkbox-item"
        v-model="selecionados"
        :value="produto.id"
      />

      <img :src="produto.imagem" class="produto-imagem" />

      <div class="info">
        <div class="info-topo">
          <h3 class="produto-nome">{{ produto.nome }}</h3>
          <p class="preco-unitario">R$ {{ produto.preco }} cada</p>
        </div>

        <div class="info-base">
          <div class="quantidade">
            <button @click="produto.quantidade > 1 && produto.quantidade--">-</button>
            <span>{{ produto.quantidade }}</span>
            <button @click="produto.quantidade++">+</button>
          </div>

          <p class="preco-total">
            R$ {{ (produto.quantidade * produto.preco).toFixed(2) }}
          </p>

          <button class="btn-remover" @click="removerDoCarrinho(produto.id)">
            Remover
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<!--direita -->
<div class="resumo">
  <h2 class="resumo-titulo">Resumo do Pedido</h2>

  <div class="resumo-linha">
    <span>Itens selecionados</span>
    <span>{{ selecionados.length }}</span>
  </div>

  <div class="resumo-linha">
    <span>Subtotal</span>
    <span>R$ {{ totalSelecionado }}</span>
  </div>

  <div class="resumo-linha">
    <span>Frete</span>
    <span class="frete-texto">A calcular</span>
  </div>

  <div class="resumo-total">
    <span>Total</span>
    <span>R$ {{ totalSelecionado }}</span>
  </div>

  <button
    class="comprar" 
    :disabled="selecionados.length === 0" @click="$router.push('/finalizar')"
  >
    FINALIZAR COMPRA
  </button>

  <button class="continuar" @click="$router.push('/home')">
    Continuar comprando
  </button>
</div>
 
 
</div>


</template>

<script setup>

import { carrinho, removerDoCarrinho } from "@/stores/carrinho"
import { ref, computed } from "vue"
 
const selecionados = ref([])

const todosSelecionados = computed({
  get(){
    return carrinho.value.length > 0 &&
      selecionados.value.length === carrinho.value.length
  },
  set(valor){
    if(valor){
      selecionados.value = carrinho.value.map(p => p.id)
    }else{
      selecionados.value = []
    }
  }
})

const total = computed(()=>{
  return carrinho.value
  .reduce((soma, produto)=>{
    return soma + produto.preco * produto.quantidade
  },0)
  .toFixed(2)
})

const totalSelecionado = computed(()=>{
  return carrinho.value
    .filter(produto => selecionados.value.includes(produto.id))
    .reduce((soma, produto)=>{
      return soma + produto.preco * produto.quantidade
    },0)
    .toFixed(2)
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

.titulo{
  text-align:center;
  margin-top:40px;
  font-size:24px;
  color:#101110;
}
.logo {
  font-weight: bold;
  color: #2e7d32;
  font-size: 18px;
}

.container{
max-width:800px;
margin:auto;
padding:40px;
}

.produto{
  display:flex;
  gap:20px;
  align-items:center;
  background:#fff;
  padding:15px;
  margin-bottom:15px;
  border-radius:10px;
  box-shadow:0 4px 12px rgba(0,0,0,0.06);
}

.produto-imagem{
  width:80px;
  height:80px;
  object-fit:cover;
  border-radius:8px;
}

.info{
  flex:1;
  display:flex;
  flex-direction:column;
  gap:12px;
}

.info-topo{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap:12px;
}

.produto-nome{
  font-size:16px;
  font-weight:600;
}

.preco-unitario{
  font-size:14px;
  color:#666;
}

.info-base{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:16px;
}

.quantidade{
  display:flex;
  align-items:center;
  gap:8px;
}

.quantidade button{
  width:28px;
  height:28px;
  border-radius:4px;
  border:1px solid #ddd;
  background:#f5f5f5;
  cursor:pointer;
}

.preco-total{
  font-weight:bold;
  color:#2e7d32;
}

.btn-remover{
  border:1px solid #f44336;
  background:#fff5f5;
  color:#f44336;
  padding:6px 14px;
  border-radius:6px;
  cursor:pointer;
  font-size:13px;
}

.preco{
  font-weight:bold;
  color:#2e7d32;
}

.total{
margin-top:30px;
}

.comprar{
  margin-top:20px;
  background:#2e7d32;
  color:white;
  padding:12px 20px;
  border:none;
  border-radius:8px;
  width:100%;
  font-weight:600;
  cursor:pointer;
}

.carrinho-container{
  display:flex;
  gap:30px;
  max-width:1200px;
  margin:40px auto;
  align-items:flex-start;
}

.lista-produtos{
  flex:2;
}

.resumo{
  flex:1;
  background:#fff;
  padding:20px;
  border-radius:10px;
  box-shadow:0 4px 12px rgba(0,0,0,0.06);
}

.resumo-titulo{
  font-size:18px;
  margin-bottom:16px;
}

.resumo-linha{
  display:flex;
  justify-content:space-between;
  margin-bottom:8px;
  font-size:14px;
  color:#555;
}

.frete-texto{
  color:#888;
}

.resumo-total{
  display:flex;
  justify-content:space-between;
  margin:16px 0;
  font-weight:bold;
  font-size:16px;
}

.continuar{
  margin-top:10px;
  width:100%;
  padding:10px 20px;
  border-radius:8px;
  border:1px solid #ddd;
  background:#fff;
  cursor:pointer;
  font-size:14px;
}

.selecionar-todos{
  display:flex;
  align-items:center;
  gap:8px;
  font-size:14px;
  margin-bottom:16px;
  color:#555;
}

.carrinho-vazio{
  background:#fff;
  padding:20px;
  border-radius:10px;
  text-align:center;
  box-shadow:0 4px 12px rgba(0,0,0,0.06);
}

.checkbox-item{
  margin-right:8px;
}

</style>