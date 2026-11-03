import { Text, View } from 'react-native';
import { styles } from '../styles/styles';
import type { Ponto } from '../types/ponto';

type Props = {
  ponto: Ponto;
};

export default function DetalhePonto({ ponto }: Props) {
  return (
    <View style={styles.detalhe}>
      <Text style={styles.nomeDetalhe}>{ponto.nome}</Text>
      <Text style={styles.rotulo}>Endereco</Text>
      <Text style={styles.textoDetalhe}>{ponto.endereco}</Text>
      <Text style={styles.rotulo}>Dias e horarios</Text>
      <Text style={styles.textoDetalhe}>{ponto.horario}</Text>
      <Text style={styles.rotulo}>O que recebe ou distribui</Text>
      <Text style={styles.textoDetalhe}>{ponto.atendimento}</Text>
      <Text style={styles.rotulo}>Coordenadas</Text>
      <Text style={styles.textoDetalhe}>
        {ponto.latitude}, {ponto.longitude}
      </Text>
    </View>
  );
}
