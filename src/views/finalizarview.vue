<template>
  <nav class="navbar">
    <div class="navbar-content">
      <div class="actions">
        <div class="perfil">
          👤 Perfil
        </div>
      </div>
    </div>
  </nav>

  <div class="container">
    <h1 class="titulo">Finalizar Compra</h1>
    <div class="page-card">
      <div v-if="carrinho.length > 0">
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

      <div v-if="mensagem" :class="['message', mensagemTipo]">{{ mensagem }}</div>

      <div class="bloco">
  <h3>📍 Endereço de Entrega</h3>

  <div class="endereco-box">
    <p>Rua Exemplo, 123</p>
    <p>Bairro Centro</p>
    <p>Ibirité - MG</p>
  </div>
</div>

<div class="bloco">
  <h3>💳 Forma de Pagamento</h3>

  <label>
    <input type="radio" value="cartao" v-model="formaPagamento" />
    Cartão de Crédito
  </label>

  <label>
    <input type="radio" value="pix" v-model="formaPagamento" />
    Pix
  </label>
</div>
    <div v-if="formaPagamento === 'cartao'" class="bloco">

  <select v-model="cartaoSelecionado">
    <option disabled value="">Selecione um cartão</option>
    <option v-for="cartao in cartoes" :key="cartao.id" :value="cartao">
      {{ cartao.nome }} - **** {{ cartao.numero.slice(-4) }}
    </option>
  </select>

  <button class="add-cartao-btn" @click="$router.push('/perfil')">
    ➕ Adicionar novo cartão
  </button>

</div><br>

     <div v-if="formaPagamento === 'pix'" class="bloco pix-box">

  <p>Pagamento via Pix</p>
  <p>Chave: <strong>{{ chavePix }}</strong></p>

  <button type="button" class="buttoncopiarpix" @click="copiarPix">
    📋 Copiar chave Pix
  </button>

</div><br>
<button class="buttonfinalizarCompra" :disabled="!botaoFinalizarHabilitado" @click="finalizarCompra">Finalizar Pedido</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { carrinho } from '@/stores/carrinho'
import { adicionarPedido } from '@/stores/pedidos'

const router = useRouter()
const formaPagamento = ref('cartao') // padrão
const chavePix = "sacolao@pix.com"
const mensagem = ref('')
const mensagemTipo = ref('')
const pixCopied = ref(false)

watch(formaPagamento, () => {
  pixCopied.value = false
})

const total = computed(() => {
  return carrinho.value
    .reduce((soma, produto) => soma + produto.preco * produto.quantidade, 0)
    .toFixed(2)
})

onMounted(() => {
  if (carrinho.value.length === 0) {
    router.replace('/home')
  }
})

const botaoFinalizarHabilitado = computed(() => {
  if (formaPagamento.value === 'pix') {
    return pixCopied.value
  } else {
    return cartaoSelecionado.value !== '' && cartaoSelecionado.value
  }
})

function validarCartao(numero) {
  // Validação simples apenas para exemplo: cartão válido se o último dígito for par
  return Number(numero.slice(-1)) % 2 === 0
}

function finalizarCompra() {
  const itensPedido = carrinho.value.map((produto) => ({
    ...produto
  }))
  const totalItems = carrinho.value.reduce((soma, produto) => soma + produto.quantidade, 0)
  const pedido = {
    id: `PED-${Date.now().toString().slice(-6)}`,
    date: new Date().toLocaleDateString('pt-BR'),
    itens: itensPedido,
    total: Number(total.value),
    totalItems,
    image: carrinho.value[0]?.imagem || '',
    description:
      carrinho.value.length > 1
        ? `${carrinho.value[0]?.nome} e mais ${carrinho.value.length - 1} item(s)`
        : carrinho.value[0]?.nome || 'Pedido',
    storeName: 'Sacolão Online',
    paymentMethod: formaPagamento.value === 'pix' ? 'Pix' : 'Cartão de Crédito',
    cardMask:
      formaPagamento.value === 'cartao' && cartaoSelecionado.value
        ? `**** ${cartaoSelecionado.value.numero.slice(-4)}`
        : null,
    status:
      formaPagamento.value === 'pix'
        ? 'Pagamento processado'
        : cartaoSelecionado.value && validarCartao(cartaoSelecionado.value.numero)
        ? 'Pagamento processado'
        : 'Falha no pagamento'
  }

  adicionarPedido(pedido)

  if (pedido.status === 'Pagamento processado') {
    mensagem.value = 'Seu pedido foi feito com sucesso! Você será levado para Meus Pedidos.'
    mensagemTipo.value = 'success'
  } else {
    mensagem.value = 'Falha no pagamento. Seu pedido foi registrado em Meus Pedidos com status de falha.'
    mensagemTipo.value = 'error'
  }

  carrinho.value = []

  setTimeout(() => {
    router.push('/seuspedidos')
  }, 1500)
}
const cartoes = ref([
  {
    id: 1,
    nome: "Cartão Principal",
    numero: "1234567812345678"
  },
  {
    id: 2,
    nome: "Cartão Nubank",
    numero: "9999888877776666"
  }
])

const cartaoSelecionado = ref('')

function copiarPix() {
  navigator.clipboard.writeText(chavePix)
    .then(() => {
      pixCopied.value = true
      mensagem.value = 'Chave Pix copiada para a área de transferência!'
      mensagemTipo.value = 'success'
      setTimeout(() => {
        mensagem.value = ''
      }, 3000)
    })
    .catch(() => {
      mensagem.value = 'Não foi possível copiar a chave Pix.'
      mensagemTipo.value = 'error'
      setTimeout(() => {
        mensagem.value = ''
      }, 3000)
    })
}

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
  justify-content: flex-end;
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

.page-card {
  background: #ffffff;
  padding: 28px;
  border-radius: 20px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.05);
  border: 1px solid #ececec;
}

.resumo {
  margin-bottom: 20px;
  background: #fff;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
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

.buttonfinalizarCompra {
  background: #218838;
  width: 100%;
  max-width: 320px;
  padding: 15px 30px;
  margin: 20px auto 0;
  display: block;
  border-radius: 10px;
  cursor: pointer;
  border: none;
  color: white;
  font-weight: 600;
  transition: all 0.3s;
}

.buttonfinalizarCompra:hover:not(:disabled) {
  background: #1e6e2f;
}

.buttonfinalizarCompra:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}
.bloco {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.endereco-box {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
}

.pix-box {
  background: #e8f5e9;
  padding: 15px;
  border-radius: 8px;
}

select {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
}

.add-cartao-btn {
  margin-top: 10px;
}

.buttoncopiarpix {
  background: #53e646;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  margin-top: 10px;
}
.buttoncopiarpix:hover {
  background: #41e75d;
}

.message {
  padding: 14px 16px;
  border-radius: 10px;
  margin: 20px 0;
  font-weight: 500;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>
