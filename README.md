# 🛒 Sacolão Online

E-commerce web completo com fluxo de autenticação, catálogo, carrinho, checkout e histórico de pedidos. Desenvolvido como projeto de portfólio para aplicar boas práticas de Front-End com Vue.js 3 e integração com Firebase.

> 🎯 **Objetivo:** Servir como base prática de aplicação real, demonstrando domínio em componentes reativos, gerenciamento de estado, rotas e integração com banco de dados em tempo real.

---

## 🛠️ Tecnologias Utilizadas

| Categoria       | Tecnologias                          |
|-----------------|--------------------------------------|
| **Framework**   | Vue.js 3 (Composition API + `<script setup>`) |
| **Build Tool**  | Vite                                 |
| **Roteamento**  | Vue Router                           |
| **Backend/Firebase** | Firebase Authentication, Firestore Database |
| **Estilização** | HTML5, CSS3 (SFC), Mobile-First      |
| **Versionamento**| Git & GitHub                         |

---

## ✨ Funcionalidades Principais

### 🔐 Autenticação & Perfil
- Cadastro, login e logout com Firebase Auth
- Persistência de sessão e proteção de rotas
- Gerenciamento de perfis: edição de dados, endereços e cartões salvos

### 🛍️ Catálogo & Produtos
- Listagem dinâmica de produtos via Firestore
- Busca e filtros por categoria/nome
- Tela de detalhes com seleção de quantidade e validação de estoque

### 🛒 Carrinho & Checkout
- Carrinho reativo com seleção individual e "selecionar todos"
- Cálculo dinâmico de totais, taxas e descontos
- Fluxo de checkout com formulário de entrega + opções de pagamento (Cartão/Pix)
- Validação de campos e feedback visual de erros

### 📦 Histórico & Pedidos
- Registro automático de pedidos realizados
- Lista de histórico com status e detalhes
- Simulação de fluxo pós-compra (confirmação, rastreamento visual)

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js `v18+` ou superior
- npm ou yarn

### Passo a Passo
```bash
# 1. Clone o repositório
git clone https://github.com/EmileSouza/sacolao-online.git

# 2. Acesse a pasta
cd sacolao-online

# 3. Instale as dependências
npm install

# 4. Configure o Firebase
# Crie um projeto em https://console.firebase.google.com
# Ative Authentication (Email/Password) e Firestore
# Copie suas credenciais e cole em um arquivo .env.local na raiz:
VITE_FIREBASE_API_KEY=sua_chave
VITE_FIREBASE_AUTH_DOMAIN=seu_dominio
VITE_FIREBASE_PROJECT_ID=seu_id
VITE_FIREBASE_STORAGE_BUCKET=seu_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender
VITE_FIREBASE_APP_ID=seu_app_id

# 5. Inicie o servidor de desenvolvimento
npm run dev

# 6. (Opcional) Build para produção
npm run build
npm run preview
