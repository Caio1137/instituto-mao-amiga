import { memo } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';
import { formatarData } from '../utils/doacoes';
import type { Doacao } from '../types/doacao';

type Props = {
  doacao: Doacao;
  onAbrir: (doacao: Doacao) => void;
};

function DoacaoItem({ doacao, onAbrir }: Props) {
  return (
    <TouchableOpacity style={styles.itemDoacao} onPress={() => onAbrir(doacao)} activeOpacity={0.8}>
      <Text style={styles.nomeDoacao}>{doacao.tipoItem}</Text>
      <Text style={styles.info}>Quantidade: {doacao.quantidade}</Text>
      <Text style={styles.info}>Destino: {doacao.pontoDestino}</Text>
      <Text style={styles.dataDoacao}>{formatarData(doacao.criadoEm)}</Text>
    </TouchableOpacity>
  );
}

export default memo(DoacaoItem);
