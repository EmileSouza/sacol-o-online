import { ref } from 'vue'

const storedUsuario = JSON.parse(localStorage.getItem('usuarioLogado') || 'null')
const storedCartoes = JSON.parse(localStorage.getItem('cartoes') || '[]')
const storedEnderecos = JSON.parse(localStorage.getItem('enderecos') || '[]')
const storedCartaoSelecionadoId = localStorage.getItem('cartaoSelecionadoId') || ''

export const usuario = ref(storedUsuario || { nome: '', email: '' })
export const cartoes = ref(storedCartoes)
export const enderecos = ref(storedEnderecos)
export const cartaoSelecionadoId = ref(storedCartaoSelecionadoId)
export const enderecoSelecionadoId = ref('')

function persistCartoes() {
  localStorage.setItem('cartoes', JSON.stringify(cartoes.value))
}

function persistEnderecos() {
  localStorage.setItem('enderecos', JSON.stringify(enderecos.value))
}

export function setUsuario(novoUsuario) {
  usuario.value = novoUsuario
  localStorage.setItem('usuarioLogado', JSON.stringify(novoUsuario))
}

export function logout() {
  usuario.value = { nome: '', email: '' }
  localStorage.removeItem('usuarioLogado')
}

export function adicionarCartao(cartao) {
  cartoes.value.push({
    id: Date.now().toString(),
    ...cartao
  })
  persistCartoes()
}

export function adicionarEndereco(endereco) {
  enderecos.value.push({
    id: Date.now().toString(),
    ...endereco
  })
  persistEnderecos()
}

export function selecionarCartao(id) {
  cartaoSelecionadoId.value = id
  localStorage.setItem('cartaoSelecionadoId', id)
}

export function selecionarEndereco(id) {
  enderecoSelecionadoId.value = id
}
