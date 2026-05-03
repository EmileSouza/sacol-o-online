# Sacolão Online

Aplicação web de e-commerce para compra de produtos de mercado, com autenticação de usuários, carrinho de compras, perfil, cadastro de endereço/cartão e finalização de pedidos.

## 📌 Descrição do projeto

O `Sacolão Online` simula a jornada completa de compra:

- Cadastro e login de usuário
- Navegação por produtos
- Adição e gerenciamento de itens no carrinho
- Seleção de endereço e forma de pagamento
- Finalização de pedido e histórico de compras

Objetivo: oferecer uma base prática de front-end com Vue + Firebase para portfólio e evolução do projeto.

## ⚙️ Tecnologias utilizadas

- Vue 3 (Composition API)
- Vue Router
- JavaScript (ES Modules)
- HTML + CSS (Single File Components)
- Vite
- Firebase Authentication
- Cloud Firestore

## ▶️ Como rodar o projeto

### 1) Pré-requisitos

- Node.js 20+
- NPM

### 2) Instalar dependências

```bash
npm install
```

### 3) Rodar em desenvolvimento

```bash
npm run dev
```

### 4) Gerar build de produção

```bash
npm run build
```

### 5) Visualizar build local

```bash
npm run preview
```

## 🧠 Funcionalidades principais

- Autenticação de usuário (cadastro/login/logout)
- Listagem e busca de produtos
- Página de detalhes do produto com controle de quantidade
- Carrinho com seleção por item e seleção de todos
- Resumo de pedido com total dinâmico
- Checkout com:
  - seleção de endereço
  - pagamento por cartão ou Pix
- Histórico de pedidos por usuário
- Perfil com gerenciamento de cartões e endereços

## 💡 Observações

- O projeto utiliza Firebase, então é necessário ter configurações válidas no arquivo `src/config/firebase.js`.
- O gateway de cartão é simulado para fins de estudo.
- O código foi padronizado e validado com build de produção sem erros.
