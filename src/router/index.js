import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/loginview.vue'
import CadastroView from '../views/cadastroview.vue'
import HomeView from '../views/homeview.vue'
import ProdutoView from '../views/produtoview.vue'
import CarrinhoView from '../views/carrinhoview.vue'
import FinalizarView from '../views/finalizarview.vue'
import SeusPedidosView from '../views/seuspedidosview.vue'

const routes = [
  { path: '/', redirect: '/login' },

  { path: '/login', component: LoginView },

  { path: '/cadastro', component: CadastroView },

  { path: '/home', component: HomeView },

  {
    path: '/produto/:id',
    name: 'produto',
  component: ProdutoView
},
{  path: "/carrinho",   component: CarrinhoView },

{ path: '/finalizar', component: FinalizarView },
{ path: '/seuspedidos', component: SeusPedidosView }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router