<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.numero" placeholder="Número do cartão" required />
    <input v-model="form.titular" placeholder="Nome no cartão" required />
    <input v-model="form.validade" placeholder="MM/AA" required />
    <input v-model="form.cvv" placeholder="CVV" required />
    <label>
      <input type="checkbox" v-model="form.principal" /> Principal?
    </label>
    <button type="submit">Salvar Cartão</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { adicionarCartao } from '@/services/userService'

const form = ref({
  numero: '',
  titular: '',
  validade: '',
  cvv: '',
  principal: false
})

async function handleSubmit() {
  try {
    await adicionarCartao(form.value)
    alert('Cartão salvo com sucesso!')
    form.value = { numero: '', titular: '', validade: '', cvv: '', principal: false }
  } catch (error) {
    console.error(error)
    alert('Erro ao salvar cartão: ' + error.message)
  }
}
</script>