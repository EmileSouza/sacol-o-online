<template>
    <nav class="navbar">
      <div class="navbar-content">
        <div class="navbar-left">
          <span class="navbar-logo">🛒 Sacolão Online</span>
        </div>
        <div class="navbar-right">
          <span class="navbar-text">Login</span>
          </div>
      </div>
    </nav>

    <div class="login-container">
    <div class="form-card"> 
    <h1>Login</h1>
    <div class="divider"></div>

   <p v-if="mensagem" :class="tipoMensagem">
  {{ mensagem }}
</p>

  <form @submit.prevent="login">

  <div class="input-group">
    <input v-model="email" placeholder="Email" />
    <span v-if="erroEmail" class="erro-texto">
      {{ erroEmail }}
    </span>
  </div>

  <div class="input-group">
    <input v-model="senha" type="password" placeholder="Senha" />
    <span v-if="erroSenha" class="erro-texto">
      {{ erroSenha }}
    </span>
  </div>

  <button type="submit" :disabled="loading">
    <span v-if="loading">Entrando...</span>
    <span v-else>Entrar</span> 
  </button><br>

</form>
    <p style="margin-top: 20px; font-size: 14px; color: #555;">
      Não tem conta?<br>
      <router-link to="/cadastro">Cadastrar</router-link>
    </p>
  </div>
  </div>
  
</template>

<script setup>

import { ref, watch } from 'vue'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const senha = ref('')
const erroEmail = ref('')
const erroSenha = ref('')
const loading = ref(false)
const mensagem = ref('')
const tipoMensagem = ref('')

// Limpa erros automaticamente ao digitar
watch(email, () => erroEmail.value = '')
watch(senha, () => erroSenha.value = '')

async function login() {
  erroEmail.value = ''
  erroSenha.value = ''
  loading.value = true

  try {
    const usuariosRef = collection(db, "usuarios")

    const q = query(
      usuariosRef,
      where("email", "==", email.value.trim())
    )

    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      erroEmail.value = 'Email não encontrado!'
      loading.value = false
      return
    }

    const usuario = snapshot.docs[0].data()

    if (usuario.senha !== senha.value.trim()) {
      erroSenha.value = 'Senha incorreta!'
      loading.value = false
      return
    }

    // Login válido
    router.push('/home')

  } catch (error) {
    console.error(error)
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

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 70px);
  background-color: #f0f0f0;
  padding: 20px;
  text-align: center;
  
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
  font-size: 18px;
  background-color: #f9f9f9;
  text-align: center;
  letter-spacing: 1px;
 
}

input::placeholder {
  color: #999;
  text-align: center;
  font-size: 18px;
}

input:focus {
  outline: none;
  border-color: #66bb6a;
  background-color: #ffffff;
  text-align: center;
  font-size: 18px;
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
  font-size: 18px;
  text-align: center;

}

button:hover:not(:disabled) {
  background-color: #43a047;
   text-align: center;
  
}

button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
  opacity: 0.6;
  text-align: center;
  
}

.erro {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 15px;
  font-size: 14px;
}

.sucesso {
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 15px;
  font-size: 14px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.erro-texto {
  color: #d32f2f;
  font-size: 18px;
  margin-top: 5px;
  text-align: left;
}

/* Ajuste o seletor .login-card para o container do formulário */
.login-card { 
    width: 320px; /* ajuste conforme o tamanho do botão "Entrar" desejado */
}
.login-card input[type="email"],
.login-card input[type="password"],
.login-card button {
    width: 100%;
    box-sizing: border-box;
}
</style>