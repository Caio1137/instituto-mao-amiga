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
      <Text style={styles.rotulo}>Endereço</Text>
      <Text style={styles.textoDetalhe}>{ponto.endereco}</Text>
      <Text style={styles.rotulo}>Bairro</Text>
      <Text style={styles.textoDetalhe}>{ponto.bairro}</Text>
      <Text style={styles.rotulo}>Dias e horários</Text>
      <Text style={styles.textoDetalhe}>{ponto.horario}</Text>
      <Text style={styles.rotulo}>Tipo</Text>
      <Text style={styles.textoDetalhe}>
        {ponto.tipo === 'coleta' ? 'Coleta (recebe doações)' : 'Distribuição (entrega para as famílias)'}
      </Text>
    </View>
  );
}
