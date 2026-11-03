import { Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';
import type { Ponto } from '../types/ponto';

type Props = {
  ponto: Ponto;
  onPress: () => void;
};

export default function PontoItem({ ponto, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.nomePonto}>{ponto.nome}</Text>
      <Text style={styles.info}>Endereco: {ponto.endereco}</Text>
      <Text style={styles.info}>Horario: {ponto.horario}</Text>
      <Text style={styles.info}>Atendimento: {ponto.atendimento}</Text>
      <Text style={styles.acao}>Ver detalhes</Text>
    </TouchableOpacity>
  );
}
