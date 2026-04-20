import { ref, watch, computed } from 'vue'

const storedPedidos = localStorage.getItem('pedidos')
const pedidos = ref(storedPedidos ? JSON.parse(storedPedidos) : [])

watch(
  pedidos,
  (novo) => {
    localStorage.setItem('pedidos', JSON.stringify(novo))
  },
  { deep: true }
)

export const pedidosCount = computed(() => pedidos.value.length)

export function adicionarPedido(pedido) {
  pedidos.value.unshift(pedido)
}

export { pedidos }
