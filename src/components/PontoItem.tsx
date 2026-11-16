import { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/styles';
import type { Ponto } from '../types/ponto';

type Props = {
  ponto: Ponto;
  onAbrir: (ponto: Ponto) => void;
};

function PontoItem({ ponto, onAbrir }: Props) {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`Ver detalhes de ${ponto.nome}`}
        style={styles.cardConteudo}
        onPress={() => onAbrir(ponto)}
        activeOpacity={0.8}
      >
        <Text style={styles.nomePonto}>{ponto.nome}</Text>
        <Text style={styles.info}>{ponto.endereco}</Text>
        <Text style={styles.info}>Bairro: {ponto.bairro}</Text>
        <Text style={styles.info}>Horário: {ponto.horario}</Text>
        <Text style={[styles.etiquetaTipo, ponto.tipo === 'coleta' ? styles.etiquetaColeta : styles.etiquetaDistribuicao]}>
          {ponto.tipo}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default memo(PontoItem);
