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

      <p v-if="mensagemErro" class="erro">{{ mensagemErro }}</p>

      <form @submit.prevent="fazerLogin">
        <div class="input-group">
          <input v-model="email" type="email" placeholder="Email" required :disabled="loading" />
        </div>

        <div class="input-group">
          <input v-model="senha" type="password" placeholder="Senha" required :disabled="loading" />
        </div>

        <button type="submit" :disabled="loading">
          <span v-if="loading">Entrando...</span>
          <span v-else>Entrar</span> 
        </button>
      </form>

      <p style="margin-top: 20px; font-size: 14px; color: #555;">
        Não tem conta?<br>
        <router-link to="/cadastro">Cadastrar</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUsuario } from '@/services/userService'
import { setUsuario } from '@/stores/perfil'

const router = useRouter()
const email = ref('')
const senha = ref('')
const loading = ref(false)
const mensagemErro = ref('')

async function fazerLogin() {
  loading.value = true
  mensagemErro.value = ''

  try {
    const user = await loginUsuario(email.value, senha.value)
    setUsuario({ nome: user.displayName || '', email: user.email || '' })
    router.push('/home')
  } catch (error) {
    console.error(error)
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      mensagemErro.value = 'Email ou senha incorretos.'
    } else if (error.code === 'auth/invalid-email') {
      mensagemErro.value = 'Email inválido.'
    } else if (error.code === 'auth/network-request-failed') {
      mensagemErro.value = 'Erro de rede. Verifique sua conexão.'
    } else if (error.code === 'auth/too-many-requests') {
      mensagemErro.value = 'Muitas tentativas. Tente novamente mais tarde.'
    } else {
      mensagemErro.value = 'Erro ao entrar. Tente novamente.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.navbar { background-color: #ffffff; padding: 15px 0; border-bottom: 1px solid #ddd; }
.navbar-content { max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: flex-start; align-items: center; gap: 10px; }
.navbar-left { display: flex; align-items: center; }
.navbar-logo { color: #2e7d32; font-size: 18px; font-weight: 600; }
.navbar-right { border-left: 1px solid #ddd; padding-left: 10px; }
.navbar-text { color: #2e7d32; font-size: 14px; }
.login-container { display: flex; justify-content: center; align-items: center; min-height: calc(100vh - 70px); background-color: #f0f0f0; padding: 20px; text-align: center; }
.form-card { background-color: #ffffff; padding: 50px 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); width: 100%; max-width: 400px; }
h1 { text-align: center; color: #333; margin: 0 0 20px 0; font-size: 24px; font-weight: 600; }
.divider { border-top: 2px solid #ccc; margin-bottom: 30px; }
form { display: flex; flex-direction: column; gap: 15px; }
.input-group { display: flex; flex-direction: column; }
input { padding: 12px 15px; border: 1px solid #ddd; border-radius: 4px; font-size: 18px; background-color: #f9f9f9; text-align: center; letter-spacing: 1px; }
input:focus { outline: none; border-color: #66bb6a; background-color: #ffffff; }
button { background-color: #66bb6a; color: white; cursor: pointer; font-weight: bold; margin-top: 10px; padding: 14px; border: none; border-radius: 4px; font-size: 18px; }
button:hover:not(:disabled) { background-color: #43a047; }
button:disabled { background-color: #aaa; cursor: not-allowed; opacity: 0.6; }
.erro { background-color: #ffebee; color: #c62828; padding: 10px; border-radius: 6px; margin-bottom: 15px; font-size: 14px; }
</style>