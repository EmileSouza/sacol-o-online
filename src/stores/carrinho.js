import { ref, computed } from "vue"

export const carrinho = ref([])

export const carrinhoQuantidade = computed(() => {
  return carrinho.value.reduce((total, item) => {
    return total + item.quantidade
  }, 0)
})

export function adicionarAoCarrinho(produto, quantidade){

  const itemExistente = carrinho.value.find(
    item => item.id === produto.id
  )

  if(itemExistente){
    itemExistente.quantidade += quantidade
  }else{
    carrinho.value.push({
      ...produto,
      quantidade
    })
  }

}

export function removerDoCarrinho(id){
  carrinho.value = carrinho.value.filter(
    produto => produto.id !== id
  )
}