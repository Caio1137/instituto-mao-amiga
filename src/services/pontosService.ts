import { getJson } from './api';
import type { Page } from '../types/page';
import type { Ponto } from '../types/ponto';

export function listarPontos(pagina = 0, tamanho = 50): Promise<Page<Ponto>> {
  return getJson<Page<Ponto>>(`/pontos?page=${pagina}&size=${tamanho}&sort=nome`);
}

export function buscarPontoPorId(id: number): Promise<Ponto> {
  return getJson<Ponto>(`/pontos/${id}`);
}
