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

    <div v-if="sucesso" class="sucesso-banner">
      <div class="sucesso-conteudo">
        <h3>🎉 Bem-vindo ao Sacolão Online!</h3>
        <p>Sua conta foi criada com sucesso. Redirecionando...</p>
      </div>
    </div>

    <div class="container">
      <div class="form-card">
        <h1>Cadastro</h1>
        <div class="divider"></div>

        <p v-if="mensagemErro" class="erro">{{ mensagemErro }}</p>

        <form @submit.prevent="onSubmit">
          <input v-model="nome" placeholder="Nome completo" required :disabled="loading || sucesso" />
          <input v-model="dataNascimento" type="date" required :disabled="loading || sucesso" />
          <input v-model="email" type="email" placeholder="Email" required :disabled="loading || sucesso" />
          
          <div class="input-group">
            <input 
              v-model="senha" 
              type="password" 
              placeholder="Senha (mín. 8 caracteres)" 
              required 
              minlength="8"
              :disabled="loading || sucesso"
              @input="validarSenha"
            />
            
            <div v-if="senha" class="senha-forca">
              <div class="forca-barra">
                <div :class="['barra', { fraca: forca <= 2, media: forca === 3, forte: forca >= 4 }]"></div>
              </div>
              <p :class="['forca-texto', { fraca: forca <= 2, media: forca === 3, forte: forca >= 4 }]">
                {{ textoForca }}
              </p>
              
              <ul class="requisitos-senha">
                <li :class="{ valido: requisitos.maiuscula }">✓ Pelo menos 1 letra MAIÚSCULA</li>
                <li :class="{ valido: requisitos.minuscula }">✓ Pelo menos 1 letra minúscula</li>
                <li :class="{ valido: requisitos.numero }">✓ Pelo menos 1 número</li>
                <li :class="{ valido: requisitos.especial }">✓ Pelo menos 1 caractere especial (!@#$%)</li>
                <li :class="{ valido: requisitos.tamanho }">✓ Mínimo de 8 caracteres</li>
              </ul>
            </div>
          </div>

          <button type="submit" :disabled="loading || sucesso">
            {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registrarUsuario } from '@/services/userService'

const router = useRouter()
const nome = ref('')
const dataNascimento = ref('')
const email = ref('')
const senha = ref('')
const loading = ref(false)
const mensagemErro = ref('')
const sucesso = ref(false)
const forca = ref(0)
const textoForca = ref('')
const requisitos = ref({
  maiuscula: false,
  minuscula: false,
  numero: false,
  especial: false,
  tamanho: false
})

function validarSenha() {
  const s = senha.value
  requisitos.value = {
    maiuscula: /[A-Z]/.test(s),
    minuscula: /[a-z]/.test(s),
    numero: /[0-9]/.test(s),
    especial: /[!@#$%^&*(),.?":{}|<>]/.test(s),
    tamanho: s.length >= 8
  }
  
  let pontos = 0
  if (s.length >= 8) pontos++
  if (/[A-Z]/.test(s)) pontos++
  if (/[a-z]/.test(s)) pontos++
  if (/[0-9]/.test(s)) pontos++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(s)) pontos++
  
  forca.value = pontos
  
  if (pontos <= 2) textoForca.value = 'Senha fraca'
  else if (pontos === 3) textoForca.value = 'Senha média'
  else textoForca.value = 'Senha forte'
}

async function onSubmit() {
  if (loading.value || sucesso.value) return
  loading.value = true
  mensagemErro.value = ''

  try {
    await registrarUsuario(nome.value, email.value, senha.value, dataNascimento.value)
    sucesso.value = true
    setTimeout(() => {
      router.push('/home')
    }, 3000)
  } catch (error) {
    console.error(error)
    if (error.code === 'auth/email-already-in-use') {
      mensagemErro.value = 'Este email já está cadastrado.'
    } else if (error.code === 'auth/weak-password') {
      mensagemErro.value = 'A senha deve ter pelo menos 6 caracteres.'
    } else {
      mensagemErro.value = 'Erro ao cadastrar. Tente novamente.'
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
.container { display: flex; justify-content: center; align-items: center; min-height: calc(100vh - 70px); background-color: #f0f0f0; padding: 20px; }
.form-card { background-color: #ffffff; padding: 50px 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); width: 100%; max-width: 400px; }
h1 { text-align: center; color: #333; margin: 0 0 20px 0; font-size: 24px; font-weight: 600; }
.divider { border-top: 2px solid #ccc; margin-bottom: 30px; }
form { display: flex; flex-direction: column; gap: 15px; }
input { padding: 12px 15px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; background-color: #f9f9f9; }
input:focus { outline: none; border-color: #66bb6a; background-color: #ffffff; }
button { background-color: #66bb6a; color: white; cursor: pointer; font-weight: bold; margin-top: 10px; padding: 14px; border: none; border-radius: 4px; font-size: 16px; }
button:hover:not(:disabled) { background-color: #43a047; }
button:disabled { background-color: #aaa; cursor: not-allowed; opacity: 0.6; }
.erro { color: #d32f2f; font-size: 12px; margin-top: -10px; margin-bottom: 5px; }

.sucesso-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  color: white;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 9999;
  animation: slideDown 0.5s ease-out;
}

.sucesso-conteudo h3 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: bold;
}

.sucesso-conteudo p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}
.senha-forca {
  margin-top: 10px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 6px;
  border-left: 4px solid #ddd;
}

.forca-barra {
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.barra {
  height: 100%;
  width: 0%;
  transition: all 0.3s ease;
}

.barra.fraca { width: 20%; background: #f44336; }
.barra.media { width: 60%; background: #ff9800; }
.barra.forte { width: 100%; background: #4CAF50; }

.forca-texto {
  font-size: 14px;
  font-weight: bold;
  margin: 0 0 10px 0;
}

.forca-texto.fraca { color: #f44336; }
.forca-texto.media { color: #ff9800; }
.forca-texto.forte { color: #4CAF50; }

.requisitos-senha {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 13px;
  color: #666;
}

.requisitos-senha li {
  margin-bottom: 4px;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.requisitos-senha li.valido {
  opacity: 1;
  color: #4CAF50;
  font-weight: bold;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>