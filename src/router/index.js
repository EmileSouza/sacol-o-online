import { createRouter, createWebHistory } from "vue-router"

import CadastroView from "../views/cadastroview.vue"
import CarrinhoView from "../views/carrinhoview.vue"
import FinalizarView from "../views/finalizarview.vue"
import HomeView from "../views/homeview.vue"
import LoginView from "../views/loginview.vue"
import PerfilView from "../views/perfilview.vue"
import ProdutoView from "../views/produtoview.vue"
import SeusPedidosView from "../views/seuspedidosview.vue"

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: LoginView },
  { path: "/cadastro", component: CadastroView },
  { path: "/home", component: HomeView },
  { path: "/produto/:id", name: "produto", component: ProdutoView },
  { path: "/carrinho", component: CarrinhoView },
  { path: "/finalizar", component: FinalizarView },
  { path: "/perfil", component: PerfilView },
  { path: "/seuspedidos", component: SeusPedidosView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const usuarioLogado = localStorage.getItem("usuarioLogado")
  const rotasProtegidas = ["/perfil", "/home", "/carrinho", "/finalizar", "/seuspedidos"]
  const rotaProduto = to.path.startsWith("/produto/")

  if ((rotasProtegidas.includes(to.path) || rotaProduto) && !usuarioLogado) {
    next("/login")
    return
  }

  next()
})

export default router