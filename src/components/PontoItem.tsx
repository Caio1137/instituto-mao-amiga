import { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/styles';
import type { Ponto } from '../types/ponto';

type Props = {
  ponto: Ponto;
  favorito: boolean;
  onAbrir: (ponto: Ponto) => void;
  onAlternarFavorito: (ponto: Ponto) => void;
};

function PontoItem({ ponto, favorito, onAbrir, onAlternarFavorito }: Props) {
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

      {/* Área de toque de 44x44 (styles.botaoFavorito). */}
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={favorito ? `Desmarcar ${ponto.nome} dos favoritos` : `Favoritar ${ponto.nome}`}
        accessibilityState={{ selected: favorito }}
        style={styles.botaoFavorito}
        onPress={() => onAlternarFavorito(ponto)}
        activeOpacity={0.7}
      >
        <Text style={[styles.iconeFavorito, favorito && styles.iconeFavoritoAtivo]}>{favorito ? '♥' : '♡'}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default memo(PontoItem);
