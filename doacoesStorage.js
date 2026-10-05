import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_DOACOES = '@instituto_mao_amiga:doacoes';
const CHAVE_ULTIMA_DOACAO = '@instituto_mao_amiga:ultima_doacao';

function gerarId() {
  return `doacao-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function gravarDoacoes(doacoes) {
  await AsyncStorage.setItem(CHAVE_DOACOES, JSON.stringify(doacoes));
}

async function migrarUltimaDoacao() {
  const ultimaDoacaoSalva = await AsyncStorage.getItem(CHAVE_ULTIMA_DOACAO);

  if (!ultimaDoacaoSalva) {
    return [];
  }

  const ultimaDoacao = JSON.parse(ultimaDoacaoSalva);
  const doacaoMigrada = {
    id: gerarId(),
    tipoItem: ultimaDoacao.tipoItem ?? '',
    quantidade: Number(ultimaDoacao.quantidade) || 0,
    pontoDestino: ultimaDoacao.pontoDestino ?? '',
    criadoEm: new Date().toISOString(),
  };

  await gravarDoacoes([doacaoMigrada]);
  await AsyncStorage.removeItem(CHAVE_ULTIMA_DOACAO);
  return [doacaoMigrada];
}

export async function listarDoacoes() {
  const doacoesSalvas = await AsyncStorage.getItem(CHAVE_DOACOES);

  if (!doacoesSalvas) {
    return migrarUltimaDoacao();
  }

  return JSON.parse(doacoesSalvas);
}

export async function salvarDoacao(dadosDaDoacao) {
  const doacoes = await listarDoacoes();
  const novaDoacao = {
    id: gerarId(),
    tipoItem: dadosDaDoacao.tipoItem,
    quantidade: Number(dadosDaDoacao.quantidade),
    pontoDestino: dadosDaDoacao.pontoDestino,
    criadoEm: new Date().toISOString(),
  };

  await gravarDoacoes([...doacoes, novaDoacao]);
  return novaDoacao;
}

export async function atualizarDoacao(doacaoAtualizada) {
  const doacoes = await listarDoacoes();
  const novasDoacoes = doacoes.map((doacao) => (
    doacao.id === doacaoAtualizada.id
      ? {
        ...doacao,
        tipoItem: doacaoAtualizada.tipoItem,
        quantidade: Number(doacaoAtualizada.quantidade),
        pontoDestino: doacaoAtualizada.pontoDestino,
      }
      : doacao
  ));

  await gravarDoacoes(novasDoacoes);
  return novasDoacoes.find((doacao) => doacao.id === doacaoAtualizada.id);
}

export async function excluirDoacao(id) {
  const doacoes = await listarDoacoes();
  const novasDoacoes = doacoes.filter((doacao) => doacao.id !== id);

  await gravarDoacoes(novasDoacoes);
}
