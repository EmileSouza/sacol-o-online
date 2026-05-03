<template>
  <nav class="navbar">
    <div class="navbar-content">
      <div class="actions">
        <div class="perfil" @click="$router.push('/perfil')">
          👤 Perfil
        </div>
      </div>
    </div>
  </nav>

  <div class="container">
    <h1 class="titulo">Finalizar Compra</h1>

    <div v-if="carrinho.length === 0" class="empty-state">
      <p>Seu carrinho está vazio. Adicione produtos antes de finalizar.</p>
      <button class="btn-secondary" @click="$router.push('/home')">Voltar à loja</button>
    </div>

    <div v-else class="page-card">
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

      <!-- 👉 NOVO: Seleção de Endereço Salvo -->
      <div class="bloco endereco-box">
        <h3>Endereço de Entrega</h3>
        <div v-if="carregandoDados">Carregando seus dados...</div>
        
        <div v-else-if="enderecos.length === 0">
          <p class="info-text warning">Você não tem endereço cadastrado.</p>
          <button class="btn-secondary" @click="$router.push('/perfil')">Cadastrar Endereço</button>
        </div>

        <div v-else>
          <label>
            Selecione um endereço salvo:
            <select v-model="enderecoSelecionadoId">
              <option disabled value="">Selecione...</option>
              <option v-for="end in enderecos" :key="end.id" :value="end.id">
                {{ end.rua }}, {{ end.numero }} - {{ end.bairro }}, {{ end.cidade }}/{{ end.estado }}
              </option>
            </select>
          </label>
          
          <!-- Mostra detalhes do endereço selecionado -->
          <div v-if="enderecoSelecionadoObj" class="selected-address">
            <p><strong>Entrega em:</strong> {{ enderecoSelecionadoObj.rua }}, {{ enderecoSelecionadoObj.numero }}</p>
            <p>{{ enderecoSelecionadoObj.complemento || 'Sem complemento' }}</p>
            <p>{{ enderecoSelecionadoObj.bairro }} - {{ enderecoSelecionadoObj.cidade }}/{{ enderecoSelecionadoObj.estado }}</p>
            <p>CEP: {{ enderecoSelecionadoObj.cep }}</p>
          </div>
        </div>
      </div>

      <div class="bloco pagamento-box">
        <h3>Forma de Pagamento</h3>
        <div class="pagamento-opcoes">
          <label class="radio-label">
            <input type="radio" value="cartao" v-model="formaPagamento" />
            <span>Cartão de Crédito</span>
          </label>

          <label class="radio-label">
            <input type="radio" value="pix" v-model="formaPagamento" />
            <span>Pix</span>
          </label>
        </div>
        <div v-if="formaPagamento === 'cartao'" class="cartao-box">
          <div v-if="carregandoDados">Carregando cartões...</div>
          <div v-else-if="cartoesStore.length === 0">
            <p class="info-text warning">Você não tem cartão cadastrado.</p>
            <button class="btn-secondary" @click="$router.push('/perfil')">Cadastrar Cartão</button>
          </div>
          <div v-else>
            <label>
              Selecionar cartão
              <select v-model="cartaoSelecionadoId">
                <option disabled value="">Selecione um cartão</option>
                <option v-for="cartao in cartoesStore" :key="cartao.id" :value="cartao.id">
                  {{ cartao.titular || 'Cartão' }} - **** {{ cartao.numero ? cartao.numero.slice(-4) : '????' }}
                </option>
              </select>
            </label>
            <div v-if="cartaoSelecionadoObj" class="selected-card">
              <p><strong>Cartão selecionado:</strong> {{ cartaoSelecionadoObj.titular }}</p>
              <p><strong>Final:</strong> **** {{ cartaoSelecionadoObj.numero.slice(-4) }}</p>
            </div>
          </div>
        </div>
        <div v-if="formaPagamento === 'pix'" class="pix-box">
          <p>Pagamento via Pix</p>
          <p>Chave: <strong>{{ chavePix }}</strong></p>
          <button type="button" class="buttoncopiarpix" @click="copiarPix">📋 Copiar chave Pix</button>
          <p v-if="pixCopied" class="info-text success">Pix copiado! Agora finalize o pedido.</p>
        </div>
      </div>

      <!-- 👉 REMOVIDO: Formulário manual de Nome/Endereço/Telefone -->
      <!-- Agora usamos os dados salvos no perfil do usuário -->

      <button 
        type="button" 
        class="buttonfinalizarCompra" 
        :disabled="!botaoFinalizarHabilitado || carregandoDados"
        @click="finalizarCompra"
      >
        {{ carregandoEnvio ? 'Processando...' : 'Finalizar Pedido' }}
      </button>
      <!-- Mensagem de Sucesso -->
<div v-if="pedidoSucesso" class="sucesso-overlay">
  <div class="sucesso-card">
    <div class="sucesso-icon">✅</div>
    <h2>Pedido Realizado com Sucesso!</h2>
    <p>Seu pedido foi processado e está sendo preparado.</p>
    <p class="subtexto">Redirecionando para seus pedidos...</p>
    <div class="loading-bar"></div>
  </div>
</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { carrinho } from '@/stores/carrinho'
import { carregarEnderecos, carregarCartoes, salvarPedidoFirestore } from '@/services/userService'
import { processarPagamento } from '@/services/gatewayPagamento'

const router = useRouter()

const formaPagamento = ref('cartao')
const chavePix = 'sacolao@pix.com'
const pixCopied = ref(false)
const pedidoSucesso = ref(false)

const enderecos = ref([])
const cartoesStore = ref([])
const enderecoSelecionadoId = ref('')
const cartaoSelecionadoId = ref('')

const carregandoDados = ref(true)
const carregandoEnvio = ref(false)

onMounted(async () => {
  if (carrinho.value.length === 0) {
    router.replace('/home')
    return
  }

  try {
    const [listaEnderecos, listaCartoes] = await Promise.all([
      carregarEnderecos(),
      carregarCartoes()
    ])

    enderecos.value = listaEnderecos
    cartoesStore.value = listaCartoes

    const endPrincipal = listaEnderecos.find(e => e.principal)
    if (endPrincipal) {
      enderecoSelecionadoId.value = endPrincipal.id
    }

    const cartaoPrincipal = listaCartoes.find(c => c.principal)
    if (cartaoPrincipal) {
      cartaoSelecionadoId.value = cartaoPrincipal.id
    }

  } catch (error) {
    console.error("Erro ao carregar dados do usuário:", error)
    alert("Não foi possível carregar seus endereços/cartões. Verifique se está logado.")
  } finally {
    carregandoDados.value = false
  }
})

const total = computed(() => {
  return carrinho.value
    .reduce((soma, produto) => soma + produto.preco * produto.quantidade, 0)
    .toFixed(2)
})

const enderecoSelecionadoObj = computed(() => {
  return enderecos.value.find(e => e.id === enderecoSelecionadoId.value) || null
})

const cartaoSelecionadoObj = computed(() => {
  return cartoesStore.value.find(c => c.id === cartaoSelecionadoId.value) || null
})

const botaoFinalizarHabilitado = computed(() => {
  if (carrinho.value.length === 0) return false
  
  if (!enderecoSelecionadoId.value) return false

  if (formaPagamento.value === 'pix') {
    return pixCopied.value
  }
  
  if (formaPagamento.value === 'cartao') {
    return !!cartaoSelecionadoId.value
  }
  
  return false
})

async function finalizarCompra() {
  if (!botaoFinalizarHabilitado.value) return

  carregandoEnvio.value = true

  try {
    const itensPedido = carrinho.value.map(produto => ({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      quantidade: produto.quantidade,
      imagem: produto.imagem
    }))

    let statusPedido = 'pendente'
    let pagamentoAprovado = false
    
    if (formaPagamento.value === 'cartao') {
      const resultado = await processarPagamento({
        cartao: cartaoSelecionadoObj.value,
        valor: Number(total.value)
      })
      
      if (resultado.sucesso) {
        statusPedido = 'processando'
        pagamentoAprovado = true
        console.log('✅', resultado.mensagem)
      } else {
        statusPedido = 'pagamento_recusado'
        alert(`❌ ${resultado.mensagem}\n\nCódigo: ${resultado.codigo}`)
        carregandoEnvio.value = false
        return
      }
    } else if (formaPagamento.value === 'pix') {
      statusPedido = 'processando'
      pagamentoAprovado = true
    }

    const pedidoData = {
      dataPedido: new Date(),
      status: statusPedido,
      total: Number(total.value),
      itens: itensPedido,
      enderecoEntrega: enderecoSelecionadoObj.value,
      formaPagamento: formaPagamento.value,
      cartaoUsado: cartaoSelecionadoObj.value ? {
        id: cartaoSelecionadoObj.value.id,
        titular: cartaoSelecionadoObj.value.titular,
        ultimoDigitos: cartaoSelecionadoObj.value.numero.slice(-4),
        bandeira: cartaoSelecionadoObj.value.bandeira
      } : null,
      chavePix: formaPagamento.value === 'pix' ? chavePix : null,
      pagamentoAprovado: pagamentoAprovado
    }

    await salvarPedidoFirestore(pedidoData)

    carrinho.value = []

    pedidoSucesso.value = true
    
    setTimeout(() => {
      router.push('/seuspedidos')
    }, 3000)

  } catch (error) {
    console.error("Erro ao finalizar compra:", error)
    alert("Erro ao processar pedido. Tente novamente.")
  } finally {
    carregandoEnvio.value = false
  }
}

function copiarPix() {
  navigator.clipboard.writeText(chavePix)
    .then(() => {
      pixCopied.value = true
    })
    .catch(() => {
      pixCopied.value = false
    })
  }
   
</script>

<style scoped>
/* MANTIVE SEU CSS ORIGINAL INTEIRO */
.navbar {
  background: #ffffff;
  padding: 14px 0;
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

.perfil {
  cursor: pointer;
  color: #2e7d32;
  font-weight: 700;
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

.empty-state {
  background: #ffffff;
  padding: 28px;
  border-radius: 20px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.05);
  text-align: center;
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

.bloco {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  border: 1px solid #f0f0f0; /* Adicionei borda suave */
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

select,
input {
  width: 100%;
  padding: 10px;
  margin-top: 8px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.cartao-box,
.pix-box,
.selected-card,
.selected-address { /* Adicionei estilo para o endereço selecionado */
  margin-top: 16px;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
}

.info-text {
  margin-top: 12px;
  color: #555;
}

.info-text.warning {
  color: #d9534f;
  font-weight: bold;
}

.info-text.success {
  color: #1a7f2e;
}

.buttoncopiarpix {
  background: #53e646;
  color: white;
  border: none;
  padding: 10px 16px;
  cursor: pointer;
  margin-top: 10px;
  border-radius: 8px;
}

.buttoncopiarpix:hover {
  background: #41e75d;
}

.form-finalizar {
  display: grid;
  gap: 15px;
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

.btn-secondary {
  background: #2e7d32;
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 18px;
}

/* Overlay de Sucesso */
.sucesso-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.sucesso-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.5s ease;
}

.sucesso-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 40px;
  animation: scaleIn 0.5s ease 0.2s both;
}

.sucesso-card h2 {
  color: #2e7d32;
  margin: 0 0 15px 0;
  font-size: 24px;
}

.sucesso-card p {
  color: #666;
  margin: 10px 0;
  font-size: 16px;
}

.subtexto {
  font-size: 14px;
  color: #999;
  font-style: italic;
}

/* Barra de carregamento */
.loading-bar {
  width: 100%;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  margin-top: 25px;
  overflow: hidden;
  position: relative;
}

.loading-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  animation: loading 3s ease forwards;
}

/* Animações */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

@keyframes loading {
  from { width: 0%; }
  to { width: 100%; }
}
</style>