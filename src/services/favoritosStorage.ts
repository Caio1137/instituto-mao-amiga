import { lerJSON, salvarJSON } from './storage';

// Favoritos ficam só no aparelho e guardam apenas os ids dos pontos.
// Os dados de cada ponto são sempre buscados na API pelo id.
const CHAVE_FAVORITOS = '@instituto_mao_amiga:pontos_favoritos';

export async function carregarFavoritos(): Promise<string[]> {
  const dados = await lerJSON<unknown>(CHAVE_FAVORITOS);
  return Array.isArray(dados) ? dados.filter((id): id is string => typeof id === 'string') : [];
}

export async function salvarFavoritos(ids: string[]): Promise<void> {
  await salvarJSON(CHAVE_FAVORITOS, ids);
}
