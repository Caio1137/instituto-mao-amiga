import { lerJSON, removerItem, salvarJSON } from './storage';
import type { DadosDoacao, Doacao } from '../types/doacao';

const CHAVE_DOACOES = '@instituto_mao_amiga:doacoes';
const CHAVE_ULTIMA_DOACAO = '@instituto_mao_amiga:ultima_doacao';

// Formato salvo pelas primeiras versões do app, antes do histórico.
type UltimaDoacaoAntiga = {
  tipoItem?: string;
  quantidade?: string | number;
  pontoDestino?: string;
};

function gerarId(): string {
  return `doacao-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function migrarUltimaDoacao(): Promise<Doacao[]> {
  const ultimaDoacao = await lerJSON<UltimaDoacaoAntiga>(CHAVE_ULTIMA_DOACAO);

  if (!ultimaDoacao) {
    return [];
  }

  const doacaoMigrada: Doacao = {
    id: gerarId(),
    tipoItem: ultimaDoacao.tipoItem ?? '',
    quantidade: Number(ultimaDoacao.quantidade) || 0,
    pontoDestino: ultimaDoacao.pontoDestino ?? '',
    criadoEm: new Date().toISOString(),
  };

  await salvarJSON(CHAVE_DOACOES, [doacaoMigrada]);
  await removerItem(CHAVE_ULTIMA_DOACAO);
  return [doacaoMigrada];
}

export async function listarDoacoes(): Promise<Doacao[]> {
  const doacoes = await lerJSON<Doacao[]>(CHAVE_DOACOES);

  if (!doacoes) {
    return migrarUltimaDoacao();
  }

  return doacoes;
}

export async function buscarDoacaoPorId(id: string): Promise<Doacao | null> {
  const doacoes = await listarDoacoes();
  return doacoes.find((doacao) => doacao.id === id) ?? null;
}

export async function salvarDoacao(dadosDaDoacao: DadosDoacao): Promise<Doacao> {
  const doacoes = await listarDoacoes();
  const novaDoacao: Doacao = {
    id: gerarId(),
    tipoItem: dadosDaDoacao.tipoItem,
    quantidade: dadosDaDoacao.quantidade,
    pontoDestino: dadosDaDoacao.pontoDestino,
    criadoEm: new Date().toISOString(),
  };

  await salvarJSON(CHAVE_DOACOES, [...doacoes, novaDoacao]);
  return novaDoacao;
}

export async function atualizarDoacao(doacaoAtualizada: Doacao): Promise<Doacao | null> {
  const doacoes = await listarDoacoes();
  const novasDoacoes = doacoes.map((doacao) => (
    doacao.id === doacaoAtualizada.id
      ? {
        ...doacao,
        tipoItem: doacaoAtualizada.tipoItem,
        quantidade: doacaoAtualizada.quantidade,
        pontoDestino: doacaoAtualizada.pontoDestino,
      }
      : doacao
  ));

  await salvarJSON(CHAVE_DOACOES, novasDoacoes);
  return novasDoacoes.find((doacao) => doacao.id === doacaoAtualizada.id) ?? null;
}

export async function excluirDoacao(id: string): Promise<void> {
  const doacoes = await listarDoacoes();
  const novasDoacoes = doacoes.filter((doacao) => doacao.id !== id);

  await salvarJSON(CHAVE_DOACOES, novasDoacoes);
}
