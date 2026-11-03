import { useCallback, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { buscarDoacaoPorId, excluirDoacao } from '../services/doacoesStorage';
import { styles } from '../styles/styles';
import { formatarData } from '../utils/doacoes';
import type { Doacao } from '../types/doacao';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalheDoacao'>;

export default function DetalheDoacaoScreen({ navigation, route }: Props) {
  const { doacaoId } = route.params;
  const [doacao, setDoacao] = useState<Doacao | null>(null);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      buscarDoacaoPorId(doacaoId)
        .then(setDoacao)
        .catch(() => setDoacao(null))
        .finally(() => setCarregando(false));
    }, [doacaoId]),
  );

  function confirmarExclusao(id: string) {
    Alert.alert(
      'Excluir doacao',
      'Deseja realmente excluir esta doacao?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await excluirDoacao(id);
              navigation.goBack();
            } catch {
              Alert.alert('Erro', 'Nao foi possivel excluir a doacao.');
            }
          },
        },
      ],
    );
  }

  if (!doacao) {
    return (
      <SafeAreaView style={styles.areaSegura} edges={['bottom', 'left', 'right']}>
        <View style={[styles.container, styles.estadoVazio]}>
          <Text style={styles.textoVazio}>
            {carregando ? 'Carregando doacao...' : 'Doacao nao encontrada.'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.areaSegura} edges={['bottom', 'left', 'right']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
        <Text style={styles.secao}>Detalhe da doacao</Text>
        <View style={styles.detalhe}>
          <Text style={styles.rotulo}>Tipo do item</Text>
          <Text style={styles.textoDetalhe}>{doacao.tipoItem}</Text>
          <Text style={styles.rotulo}>Quantidade</Text>
          <Text style={styles.textoDetalhe}>{doacao.quantidade}</Text>
          <Text style={styles.rotulo}>Ponto de destino</Text>
          <Text style={styles.textoDetalhe}>{doacao.pontoDestino}</Text>
          <Text style={styles.rotulo}>Registrada em</Text>
          <Text style={styles.textoDetalhe}>{formatarData(doacao.criadoEm)}</Text>
        </View>

        <TouchableOpacity
          style={styles.botaoSecundario}
          onPress={() => navigation.navigate('CadastroDoacao', { doacaoId: doacao.id })}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotaoSecundario}>Editar doacao</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoPerigo}
          onPress={() => confirmarExclusao(doacao.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotaoPrincipal}>Excluir doacao</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
