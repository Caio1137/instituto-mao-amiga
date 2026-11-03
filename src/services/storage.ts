import AsyncStorage from '@react-native-async-storage/async-storage';

export async function lerJSON<T>(chave: string): Promise<T | null> {
  const valor = await AsyncStorage.getItem(chave);
  return valor === null ? null : (JSON.parse(valor) as T);
}

export async function salvarJSON<T>(chave: string, valor: T): Promise<void> {
  await AsyncStorage.setItem(chave, JSON.stringify(valor));
}

export async function removerItem(chave: string): Promise<void> {
  await AsyncStorage.removeItem(chave);
}
