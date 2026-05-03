import { db } from '@/config/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function adicionarPedido(pedido, userId) {
  // Salva o pedido na subcoleção 'pedidos' do usuário
  if (!userId) throw new Error('Usuário não informado');
  await addDoc(collection(db, `usuarios/${userId}/pedidos`), pedido);
}

export const pedidos = [];
