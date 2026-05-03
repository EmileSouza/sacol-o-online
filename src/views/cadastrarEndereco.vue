<template>
  <div>
    <h3>Cadastrar Endereço</h3>
    
    <div>
      <label>CEP:</label>
      <input 
        v-model="form.cep" 
        @blur="handleBlurCep" 
        placeholder="00000-000" 
        maxlength="9"
      />
      <span v-if="loadingCep">Buscando...</span>
    </div>

    <div><label>Rua:</label><input v-model="form.rua" readonly /></div>
    <div><label>Bairro:</label><input v-model="form.bairro" readonly /></div>
    
    <div style="display:flex; gap:10px;">
      <div><label>Número:</label><input id="input-numero" v-model="form.numero" placeholder="123" /></div>
      <div><label>Complemento:</label><input v-model="form.complemento" placeholder="Apto, Bloco..." /></div>
    </div>

    <div style="display:flex; gap:10px;">
      <div><label>Cidade:</label><input v-model="form.cidade" readonly /></div>
      <div><label>Estado:</label><input v-model="form.estado" readonly /></div>
    </div>

    <button @click="handleSalvar" :disabled="loadingCep">Salvar Endereço</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { adicionarEndereco, buscarEnderecoPorCep } from '@/services/userService'

const form = ref({
  cep: '',
  rua: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  principal: false
})

const loadingCep = ref(false)

async function handleBlurCep() {
  if (!form.value.cep) return

  loadingCep.value = true
  try {
    const endereco = await buscarEnderecoPorCep(form.value.cep)
    form.value.rua = endereco.rua
    form.value.bairro = endereco.bairro
    form.value.cidade = endereco.cidade
    form.value.estado = endereco.estado
    document.getElementById('input-numero').focus()
  } catch (error) {
    alert(error.message)
    form.value.rua = ''
    form.value.bairro = ''
    form.value.cidade = ''
    form.value.estado = ''
  } finally {
    loadingCep.value = false
  }
}

async function handleSalvar() {
  if (!form.value.numero) {
    alert('Digite o número da residência!')
    return
  }

  await adicionarEndereco(form.value)
  alert('Endereço salvo com sucesso!')

  form.value = {
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    principal: false
  }
}
</script>