import type { Doacao, TotalPorTipo } from '../types/doacao';

export function formatarData(data: string): string {
  return new Date(data).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function filtrarPorTipo(doacoes: Doacao[], filtro: string): Doacao[] {
  const textoFiltro = filtro.trim().toLowerCase();

  return doacoes.filter((doacao) => (
    doacao.tipoItem.toLowerCase().includes(textoFiltro)
  ));
}

export function calcularTotaisPorTipo(doacoes: Doacao[]): TotalPorTipo[] {
  const totais: Record<string, TotalPorTipo> = {};

  doacoes.forEach((doacao) => {
    const chave = doacao.tipoItem.trim().toLowerCase();

    if (!totais[chave]) {
      totais[chave] = {
        chave,
        tipoItem: doacao.tipoItem,
        quantidade: 0,
        doacoes: 0,
      };
    }

    totais[chave].quantidade += Number(doacao.quantidade);
    totais[chave].doacoes += 1;
  });

  return Object.values(totais).sort((primeiro, segundo) => (
    segundo.quantidade - primeiro.quantidade
  ));
}
