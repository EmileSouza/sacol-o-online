<template>
  <div class="perfil-container">
    <header class="header-perfil">
      <div class="header-content">
        <div class="avatar-icon">👤</div>
        <div class="user-info">
          <h2>{{ usuario.nome || "Usuário" }}</h2>
          <p>{{ usuario.email || "Sem e-mail" }}</p>
        </div>
        <div class="logout-area">
          <button class="btn-secondary" @click="voltar">Voltar</button>
          <button class="btn-danger" @click="fazerLogout">Sair</button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <section class="card">
        <h3>Dados Pessoais</h3>
        <div class="form-row">
          <input v-model="usuario.nome" placeholder="Nome completo" />
        </div>
        <div class="form-row">
          <input :value="usuario.email" class="disabled" disabled />
        </div>
        <div class="form-row">
          <input v-model="usuario.cpf" placeholder="CPF" />
          <input v-model="usuario.telefone" placeholder="Telefone" />
        </div>
        <button class="btn-primary" :disabled="salvandoPerfil" @click="salvarPerfil">
          {{ salvandoPerfil ? "Salvando..." : "Salvar perfil" }}
        </button>
      </section>

      <section class="card">
        <h3>Endereços</h3>
        <div v-if="enderecos.length === 0" class="list-item">
          Nenhum endereço cadastrado
        </div>
        <div v-for="endereco in enderecos" :key="endereco.id" class="list-item">
          <span>{{ endereco.rua }}, {{ endereco.numero }} - {{ endereco.cidade }}</span>
          <button class="btn-x" @click="excluirEndereco(endereco.id)">×</button>
        </div>
        <button class="btn-add" @click="modalEndereco = true">Adicionar endereço</button>
      </section>

      <section class="card">
        <h3>Cartões</h3>
        <div v-if="cartoes.length === 0" class="card-item">
          Nenhum cartão cadastrado
        </div>
        <div v-for="cartao in cartoes" :key="cartao.id" class="card-item">
          <span>{{ cartao.titular }} - **** {{ String(cartao.numero).slice(-4) }}</span>
          <button class="btn-x" @click="excluirCartao(cartao.id)">×</button>
        </div>
        <button class="btn-add" @click="modalCartao = true">Adicionar cartão</button>
      </section>
    </main>

    <div v-if="modalEndereco" class="modal">
      <div class="modal-box">
        <h4>Novo Endereço</h4>
        <input v-model="formEnd.cep" placeholder="CEP" @blur="buscarCep" />
        <input v-model="formEnd.rua" placeholder="Rua" />
        <input v-model="formEnd.numero" placeholder="Número" />
        <input v-model="formEnd.bairro" placeholder="Bairro" />
        <input v-model="formEnd.cidade" placeholder="Cidade" />
        <input v-model="formEnd.estado" placeholder="Estado" />
        <div class="modal-actions">
          <button @click="modalEndereco = false">Cancelar</button>
          <button :disabled="salvandoEndereco" @click="salvarEndereco">
            {{ salvandoEndereco ? "Salvando..." : "Salvar" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="modalCartao" class="modal">
      <div class="modal-box">
        <h4>Novo Cartão</h4>
        <select v-model="formCard.bandeira">
          <option>Visa</option>
          <option>Mastercard</option>
          <option>Elo</option>
          <option>Hipercard</option>
        </select>
        <input v-model="formCard.numero" placeholder="Número do cartão" />
        <input v-model="formCard.titular" placeholder="Nome do titular" />
        <input v-model="formCard.cpf" placeholder="CPF do titular" />
        <input
          v-model="formCard.validade"
          placeholder="MM/AA"
          maxlength="5"
          @input="formatarValidade"
        />
        <input v-model="formCard.cvv" placeholder="CVV" maxlength="4" />
        <div class="modal-actions">
          <button @click="modalCartao = false">Cancelar</button>
          <button :disabled="salvandoCartao" @click="salvarCartao">
            {{ salvandoCartao ? "Salvando..." : "Salvar" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="toastMsg" class="toast-confirmacao">{{ toastMsg }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  carregarEnderecos, adicionarEndereco, removerEndereco as apiRemoverEndereco,
  carregarCartoes, adicionarCartao, removerCartao as apiRemoverCartao,
  buscarEnderecoPorCep, logoutUsuario, obterUsuarioAtual,
  atualizarDadosUsuario
} from '@/services/userService'
import { validarCartao } from '@/services/gatewayPagamento'

const router = useRouter()

const modalEndereco = ref(false)
const modalCartao = ref(false)

const salvandoPerfil = ref(false)
const salvandoEndereco = ref(false)
const salvandoCartao = ref(false)

const usuario = ref({ nome: '', email: '', cpf: '', telefone: '' })
const enderecos = ref([])
const cartoes = ref([])

const formEnd = ref({ cep: '', rua: '', numero: '', bairro: '', cidade: '', estado: '' })
const formCard = ref({ 
  bandeira: 'Visa', 
  numero: '', 
  titular: '', 
  cpf: '', 
  validade: '', 
  cvv: '' 
})

const toastMsg = ref('')
let toastTimeout = null

onMounted(async () => {
  const user = obterUsuarioAtual()
  if (!user) { 
    router.push('/login')
    return 
  }
  
  usuario.value.nome = user.displayName || ''
  usuario.value.email = user.email
  
  const [ends, carts] = await Promise.all([
    carregarEnderecos(), 
    carregarCartoes()
  ])
  enderecos.value = ends
  cartoes.value = carts
})

function mostrarToast(msg) {
  toastMsg.value = msg
  if (toastTimeout) clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => {
    toastMsg.value = ''
  }, 3000)
}

function formatarValidade(e) {
  let value = e.target.value.replace(/\D/g, '')
  
  if (value.length > 4) {
    value = value.slice(0, 4)
  }
  
  if (value.length > 2) {
    value = value.slice(0, 2) + '/' + value.slice(2)
  }
  
  formCard.value.validade = value
}

async function salvarCartao() {
  if (salvandoCartao.value) return
  
  if (!formCard.value.numero) return alert('Preencha o número do cartão')
  
  salvandoCartao.value = true
  
  try {
    const validacao = validarCartao(formCard.value)
    
    if (!validacao.valido) {
      alert(`❌ Cartão inválido!\n\n${validacao.erro}\n\nUse um cartão válido para teste.`)
      return
    }
    
    const novo = await adicionarCartao(formCard.value)
    cartoes.value.push(novo)
    
    modalCartao.value = false
    
    formCard.value = { 
      bandeira: 'Visa', 
      numero: '', 
      titular: '', 
      cpf: '', 
      validade: '', 
      cvv: '' 
    }
    
    mostrarToast('✅ Cartão válido cadastrado com sucesso!')
  } catch (e) {
    alert('Erro: ' + e.message)
  } finally {
    salvandoCartao.value = false
  }
}

async function excluirCartao(id) {
  if (!confirm('Remover?')) return
  try {
    await apiRemoverCartao(id)
    cartoes.value = cartoes.value.filter(x => x.id !== id)
    mostrarToast('Cartão removido!')
  } catch (e) { 
    alert('Erro: ' + e.message) 
  }
}

async function buscarCep() {
  if (!formEnd.value.cep) return
  try {
    const d = await buscarEnderecoPorCep(formEnd.value.cep)
    formEnd.value.rua = d.rua
    formEnd.value.bairro = d.bairro
    formEnd.value.cidade = d.cidade
    formEnd.value.estado = d.estado
  } catch (e) { 
    alert(e.message) 
  }
}

async function salvarEndereco() {
  if (salvandoEndereco.value) return
  
  if (!formEnd.value.numero) return alert('Número é obrigatório')
  
  salvandoEndereco.value = true
  try {
    const novo = await adicionarEndereco(formEnd.value)
    enderecos.value.push(novo)
    modalEndereco.value = false
    formEnd.value = { cep: '', rua: '', numero: '', bairro: '', cidade: '', estado: '' }
    mostrarToast('Endereço salvo com sucesso!')
  } catch (e) {
    alert('Erro: ' + e.message)
  } finally {
    salvandoEndereco.value = false
  }
}

async function excluirEndereco(id) {
  if (!confirm('Remover?')) return
  try {
    await apiRemoverEndereco(id)
    enderecos.value = enderecos.value.filter(x => x.id !== id)
    mostrarToast('Endereço removido!')
  } catch (e) { 
    alert('Erro: ' + e.message) 
  }
}

async function salvarPerfil() {
  if (salvandoPerfil.value) return
  
  salvandoPerfil.value = true
  try {
    await atualizarDadosUsuario(usuario.value)
    mostrarToast('Perfil atualizado com sucesso!')
  } catch (e) {
    alert('Erro: ' + e.message)
  } finally {
    salvandoPerfil.value = false
  }
}

function voltar() {
  if (window.history.length <= 2) router.push('/home')
  else router.back()
}

async function fazerLogout() {
  await logoutUsuario()
  router.push('/login')
}
</script>
<style scoped>
.perfil-container { background: #f5f7fa; min-height: 100vh; font-family: sans-serif; }
.header-perfil { background: #329b44; color: white; padding: 20px; }
.header-content { max-width: 1000px; margin: auto; display: flex; align-items: center; gap: 15px; }
.avatar-icon { width: 45px; height: 45px; background: #ffffff20; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; }
.user-info h2 { margin: 0; font-size: 18px; }
.user-info p { margin: 3px 0 0; opacity: 0.9; font-size: 13px; }
.logout-area { margin-left: auto; display: flex; gap: 10px; }
.btn-secondary { background: transparent; border: 1px solid #ffffff60; color: white; padding: 8px 16px; border-radius: 5px; cursor: pointer; }
.btn-danger { background: #e53e3e; border: none; color: white; padding: 8px 16px; border-radius: 5px; cursor: pointer; }
.main-content { max-width: 1000px; margin: 20px auto; padding: 0 15px; display: grid; gap: 15px; }
@media (min-width: 768px) { .main-content { grid-template-columns: 1fr 1fr; } }
.card { background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.card h3 { margin: 0 0 15px 0; font-size: 16px; color: #14aa28; border-bottom: 1px solid #eee; padding-bottom: 10px; }
.form-row { display: flex; gap: 10px; margin-bottom: 10px; }
.form-row input { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; }
.disabled { background: #f5f5f5; color: #999; }
.btn-primary { background: #31ce60; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; width: 100%; font-weight: 600; margin-top: 10px; }
.list-item, .card-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; border: 1px solid #eee; border-radius: 6px; margin-bottom: 8px; font-size: 14px; }
.btn-x { background: none; border: none; color: #e53e3e; cursor: pointer; font-size: 18px; padding: 0 5px; }
.btn-add { width: 100%; background: #38a169; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: 600; margin-top: 10px; }
.modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; }
.modal-box { background: white; width: 90%; max-width: 400px; border-radius: 10px; padding: 20px; }
.modal-box h4 { margin: 0 0 15px 0; }
.modal-box input, .modal-box select { width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
.modal-actions { display: flex; gap: 10px; margin-top: 15px; justify-content: flex-end; }
.modal-actions button { padding: 8px 16px; border-radius: 5px; cursor: pointer; border: none; font-weight: 500; }
.modal-actions button:first-child { background: #eee; color: #333; }
.modal-actions button:last-child { background: #31ce4b; color: white; }
.toast-confirmacao {
  position: fixed;
  top: 25px;
  left: 50%;
  transform: translateX(-50%);
  background: #38a169;
  color: white;
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  z-index: 2000;
  animation: fadein 0.3s, fadeout 0.5s 2.7s;
}
@keyframes fadein {
  from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
@keyframes fadeout {
  from { opacity: 1; }
  to { opacity: 0; }
}
</style>
