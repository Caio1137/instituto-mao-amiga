import { del, get, post, put } from './api';
import type { Page } from '../types/page';
import type { DadosPonto, Ponto } from '../types/ponto';

export const TAMANHO_PAGINA_PONTOS = 10;

/** Todos os pontos, ordenados por nome (usado para escolher o destino da doação). */
export function listarPontos(): Promise<Ponto[]> {
  return get<Ponto[]>('/pontos');
}

/** Uma página da busca por nome ou bairro. */
export function buscarPaginaPontos(filtro: string, pagina: number): Promise<Page<Ponto>> {
  const parametros = `filtro=${encodeURIComponent(filtro.trim())}&page=${pagina}&size=${TAMANHO_PAGINA_PONTOS}&sort=nome,asc`;
  return get<Page<Ponto>>(`/pontos/filtro?${parametros}`);
}

export function buscarPontoPorId(id: string): Promise<Ponto> {
  return get<Ponto>(`/pontos/${encodeURIComponent(id)}`);
}

export function cadastrarPonto(dados: DadosPonto): Promise<Ponto> {
  return post<Ponto>('/pontos', dados);
}

export function editarPonto(id: string, dados: DadosPonto): Promise<Ponto> {
  return put<Ponto>(`/pontos/${encodeURIComponent(id)}`, dados);
}

export function excluirPonto(id: string): Promise<void> {
  return del(`/pontos/${encodeURIComponent(id)}`);
}
