/**
 * Gateway de Pagamento Simulado
 * Valida cartões e simula processamento de pagamento
 */

// Algoritmo de Luhn (usado por cartões reais)
function validarLuhn(numeroCartao) {
  const limpo = numeroCartao.replace(/\D/g, '')
  
  let soma = 0
  let alternar = false
  
  for (let i = limpo.length - 1; i >= 0; i--) {
    let digito = parseInt(limpo.charAt(i))
    
    if (alternar) {
      digito *= 2
      if (digito > 9) {
        digito -= 9
      }
    }
    
    soma += digito
    alternar = !alternar
  }
  
  return (soma % 10) === 0
}

// Valida dados completos do cartão
export function validarCartao(dadosCartao) {
  const { numero, titular, validade, cvv } = dadosCartao
  
  // Validações básicas
  if (!numero || numero.replace(/\D/g, '').length < 13) {
    return { valido: false, erro: 'Número do cartão inválido' }
  }
  
  if (!titular || titular.length < 5) {
    return { valido: false, erro: 'Nome do titular inválido' }
  }
  
  if (!validade || !validade.match(/^\d{2}\/\d{2}$/)) {
    return { valido: false, erro: 'Validade inválida (use MM/AA)' }
  }
  
  if (!cvv || cvv.length < 3 || cvv.length > 4) {
    return { valido: false, erro: 'CVV inválido' }
  }
  
  // Valida algoritmo de Luhn
  if (!validarLuhn(numero)) {
    return { valido: false, erro: 'Cartão inválido (falha na validação)' }
  }
  
  // Verifica se não está expirado
  const [mes, ano] = validade.split('/')
  const dataCartao = new Date(2000 + parseInt(ano), parseInt(mes) - 1)
  const agora = new Date()
  
  if (dataCartao < agora) {
    return { valido: false, erro: 'Cartão expirado' }
  }
  
  return { valido: true, erro: null }
}

// Simula processamento de pagamento
export async function processarPagamento(dadosPagamento) {
  const { cartao, valor } = dadosPagamento
  
  // Valida o cartão
  const validacao = validarCartao(cartao)
  
  if (!validacao.valido) {
    return {
      sucesso: false,
      mensagem: `Pagamento recusado: ${validacao.erro}`,
      codigo: 'CARD_INVALID'
    }
  }
  
  // Simula delay do gateway (1-2 segundos)
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
  
  // Simula aprovação baseada no valor
  // Cartões terminados em números pares = aprovado
  // Cartões terminados em números ímpares = 10% de chance de reprovação
  const ultimoDigito = parseInt(cartao.numero.replace(/\D/g, '').slice(-1))
  
  if (ultimoDigito % 2 === 0) {
    // Aprovado
    return {
      sucesso: true,
      mensagem: 'Pagamento aprovado com sucesso!',
      codigo: 'APPROVED',
      transacao: `TXN${Date.now()}`,
      autorizacao: Math.floor(Math.random() * 900000) + 100000
    }
  } else {
    // 10% de chance de reprovação
    if (Math.random() < 0.1) {
      return {
        sucesso: false,
        mensagem: 'Pagamento recusado pelo banco emissor',
        codigo: 'BANK_DECLINED'
      }
    }
    
    return {
      sucesso: true,
      mensagem: 'Pagamento aprovado com sucesso!',
      codigo: 'APPROVED',
      transacao: `TXN${Date.now()}`,
      autorizacao: Math.floor(Math.random() * 900000) + 100000
    }
  }
}

// Cartões de teste pré-definidos (útil para testes rápidos)
export const cartoesTeste = {
  aprovado: {
    numero: '4532015112830366',  // Visa válido (Luhn)
    titular: 'JOAO DA SILVA',
    validade: '12/28',
    cvv: '123',
    bandeira: 'Visa'
  },
  recusado: {
    numero: '4532015112830367',  // Termina em 7 (ímpar)
    titular: 'MARIA SANTOS',
    validade: '12/28',
    cvv: '456',
    bandeira: 'Visa'
  },
  expirado: {
    numero: '4532015112830366',
    titular: 'PEDRO OLIVEIRA',
    validade: '01/20',  // Já expirou
    cvv: '789',
    bandeira: 'Visa'
  }
}