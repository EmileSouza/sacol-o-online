<template>
  <div>
    <nav class="navbar">
      <div class="navbar-content">
        <div class="navbar-left">
          <span class="navbar-logo">🛒 Sacolão Online</span>
        </div>
        <div class="navbar-right">
          <span class="navbar-text">Criar Conta</span>
        </div>
      </div>
    </nav>

    <div class="container">
      <div class="form-card">
        <h1>Cadastro</h1>
        <div class="divider"></div>

        <form @submit.prevent="onSubmit">
          <input v-model="nome" placeholder="Nome completo" required />
          <input v-model="dataNascimento" type="date" required />
          <input v-model="email" type="email" placeholder="Email" required @blur="validarEmail" />
          <span v-if="erroEmail" class="erro">{{ erroEmail }}</span>
          <input v-model="senha" type="password" placeholder="Senha" required />

          <button type="submit" :disabled="loading || !!erroEmail">
            {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { collection, addDoc, getDocs, where, query } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useRouter } from 'vue-router'

const router = useRouter()

 
const nome = ref('')
const dataNascimento = ref('')
const email = ref('')
const senha = ref('')
const loading = ref(false)
const erroEmail = ref('')

async function validarEmail() {
  erroEmail.value = ''
  
  if (!email.value) {
    return
  }

  try {
    const usuariosRef = collection(db, "usuarios")
    const q = query(usuariosRef, where("email", "==", email.value))
    const snapshot = await getDocs(q)
    
    if (!snapshot.empty) {
      erroEmail.value = 'Este email já está cadastrado!'
    }
  } catch (error) {
    console.error('Erro na validação:', error)
  }
}

async function onSubmit() {
  if (loading.value) return
  if (erroEmail.value) {
    alert('Resolva o erro acima')
    return
  }
  
  loading.value = true
  
  try {
    await addDoc(collection(db, "usuarios"), {
      nome: nome.value,
      dataNascimento: dataNascimento.value,
      email: email.value,
      senha: senha.value,
      dataCriacao: new Date()
    })
    
   alert('Cadastro realizado com sucesso!')
router.push('/login')
    
    nome.value = ''
    dataNascimento.value = ''
    email.value = ''
    senha.value = ''
    erroEmail.value = ''
    
  } catch (error) {
    alert('Erro: ' + error.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.navbar {
  background-color: #ffffff;
  padding: 15px 0;
  border-bottom: 1px solid #ddd;
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.navbar-logo {
  color: #2e7d32;
  font-size: 18px;
  font-weight: 600;
}

.navbar-right {
  border-left: 1px solid #ddd;
  padding-left: 10px;
}

.navbar-text {
  color: #2e7d32;
  font-size: 14px;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 70px);
  background-color: #f0f0f0;
  padding: 20px;
}

.form-card {
  background-color: #ffffff;
  padding: 50px 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  color: #333;
  margin: 0 0 20px 0;
  font-size: 24px;
  font-weight: 600;
}

.divider {
  border-top: 2px solid #ccc;
  margin-bottom: 30px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: #f9f9f9;
}

input::placeholder {
  color: #999;
}

input:focus {
  outline: none;
  border-color: #66bb6a;
  background-color: #ffffff;
}

.erro {
  color: #d32f2f;
  font-size: 12px;
  margin-top: -10px;
  margin-bottom: 5px;
}

button {
  background-color: #66bb6a;
  color: white;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
  padding: 14px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
}

button:hover:not(:disabled) {
  background-color: #43a047;
}

button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
  opacity: 0.6;
}
</style>