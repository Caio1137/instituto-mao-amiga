import { del, get, post, put } from './api';
import type { DadosDoacao, Doacao } from '../types/doacao';
import type { Page } from '../types/page';

export const TAMANHO_PAGINA_DOACOES = 10;

/** Uma página do histórico filtrada pelo tipo do item, da mais nova para a mais antiga. */
export function buscarPaginaDoacoes(filtro: string, pagina: number): Promise<Page<Doacao>> {
  const parametros = `filtro=${encodeURIComponent(filtro.trim())}&page=${pagina}&size=${TAMANHO_PAGINA_DOACOES}&sort=criadoEm,desc`;
  return get<Page<Doacao>>(`/doacoes/filtro?${parametros}`);
}

export function buscarDoacaoPorId(id: string): Promise<Doacao> {
  return get<Doacao>(`/doacoes/${encodeURIComponent(id)}`);
}

export function cadastrarDoacao(dados: DadosDoacao): Promise<Doacao> {
  return post<Doacao>('/doacoes', dados);
}

export function editarDoacao(id: string, dados: DadosDoacao): Promise<Doacao> {
  return put<Doacao>(`/doacoes/${encodeURIComponent(id)}`, dados);
}

export function excluirDoacao(id: string): Promise<void> {
  return del(`/doacoes/${encodeURIComponent(id)}`);
}
