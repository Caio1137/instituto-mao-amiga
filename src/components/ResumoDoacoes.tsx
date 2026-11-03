import { Text, View } from 'react-native';
import { styles } from '../styles/styles';
import type { Doacao, TotalPorTipo } from '../types/doacao';

type Props = {
  doacoes: Doacao[];
  totaisPorTipo: TotalPorTipo[];
};

export default function ResumoDoacoes({ doacoes, totaisPorTipo }: Props) {
  if (doacoes.length === 0) {
    return (
      <View style={styles.resumo}>
        <Text style={styles.resumoTexto}>Ainda nao ha doacoes registradas.</Text>
      </View>
    );
  }

  return (
    <View style={styles.resumo}>
      <Text style={styles.tituloResumo}>Resumo das doacoes</Text>
      <Text style={styles.resumoTexto}>Total de registros: {doacoes.length}</Text>
      {totaisPorTipo.map((total) => (
        <Text style={styles.resumoTexto} key={total.chave}>
          {total.tipoItem}: {total.quantidade} unidades em {total.doacoes} doacao(oes)
        </Text>
      ))}
    </View>
  );
}
