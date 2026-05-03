import { auth, db } from '@/config/firebase'
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  addDoc, 
  getDocs, 
  deleteDoc
} from 'firebase/firestore'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth'

// --- AUTENTICAÇÃO ---

export async function registrarUsuario(nome, email, senha, dataNascimento) {
  try {
    // 1. Cria no Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha)
    const user = userCredential.user

    // 2. Atualiza perfil (Nome)
    await updateProfile(user, { displayName: nome })

    // 3. Cria documento no Firestore
    await setDoc(doc(db, 'usuarios', user.uid), {
      nome: nome,
      email: email,
      dataNascimento: dataNascimento,
      dataCriacao: new Date(),
      uid: user.uid
    })

    return user
  } catch (error) {
    throw error
  }
}

export async function loginUsuario(email, senha) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha)
    return userCredential.user
  } catch (error) {
    throw error
  }
}

export async function logoutUsuario() {
  await signOut(auth)
}

export function obterUsuarioAtual() {
  return auth.currentUser
}

// --- DADOS DO USUÁRIO (ENDEREÇOS E CARTÕES) ---

// Função auxiliar para pegar o ID do usuário logado
function getUserId() {
  const user = auth.currentUser
  if (!user) throw new Error('Usuário não autenticado')
  return user.uid
}

// Endereços
export async function carregarEnderecos() {
  const uid = getUserId()
  const snap = await getDocs(collection(db, 'usuarios', uid, 'enderecos'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function adicionarEndereco(endereco) {
  const uid = getUserId()
  const ref = await addDoc(collection(db, 'usuarios', uid, 'enderecos'), {
    ...endereco,
    createdAt: new Date()
  })
  return { id: ref.id, ...endereco }
}

export async function removerEndereco(id) {
  const uid = getUserId()
  await deleteDoc(doc(db, 'usuarios', uid, 'enderecos', id))
}

// Cartões
export async function carregarCartoes() {
  const uid = getUserId()
  const snap = await getDocs(collection(db, 'usuarios', uid, 'cartoes'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function adicionarCartao(cartao) {
  const uid = getUserId()
  const ref = await addDoc(collection(db, 'usuarios', uid, 'cartoes'), {
    ...cartao,
    createdAt: new Date()
  })
  return { id: ref.id, ...cartao }
}

export async function removerCartao(id) {
  const uid = getUserId()
  await deleteDoc(doc(db, 'usuarios', uid, 'cartoes', id))
}

// Pedidos
export async function salvarPedidoFirestore(pedidoData) {
  const uid = getUserId()
  await addDoc(collection(db, 'usuarios', uid, 'pedidos'), {
    ...pedidoData,
    createdAt: new Date(),
    status: 'pendente'
  })
}
// API de CEP (ViaCEP)
export async function buscarEnderecoPorCep(cep) {
  const cepLimpo = cep.replace(/\D/g, '')
  if (cepLimpo.length !== 8) throw new Error('CEP inválido')

  const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
  const data = await res.json()
  
  if (data.erro) throw new Error('CEP não encontrado')

  return {
    rua: data.logradouro,
    bairro: data.bairro,
    cidade: data.localidade,
    estado: data.uf,
    cep: cepLimpo
  }
}

// --- DADOS PESSOAIS DO USUÁRIO ---
export async function atualizarDadosUsuario(dados) {
  const uid = getUserId()
  await setDoc(doc(db, 'usuarios', uid), {
    nome: dados.nome,
    cpf: dados.cpf,
    telefone: dados.telefone,
    dataNascimento: dados.dataNascimento,
    genero: dados.genero
  }, { merge: true })
}

export async function carregarDadosUsuarioExtra(uid) {
  const docRef = doc(db, 'usuarios', uid)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data()
  }
  return null
}