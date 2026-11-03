import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { ListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import DoacaoItem from '../components/DoacaoItem';
import ResumoDoacoes from '../components/ResumoDoacoes';
import { listarDoacoes } from '../services/doacoesStorage';
import { styles } from '../styles/styles';
import { calcularTotaisPorTipo, filtrarPorTipo } from '../utils/doacoes';
import type { Doacao } from '../types/doacao';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'HistoricoDoacoes'>;

export default function HistoricoDoacoesScreen({ navigation }: Props) {
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [filtro, setFiltro] = useState('');

  useFocusEffect(
    useCallback(() => {
      listarDoacoes()
        .then(setDoacoes)
        .catch(() => setDoacoes([]));
    }, []),
  );

  const doacoesFiltradas = useMemo(() => filtrarPorTipo(doacoes, filtro), [doacoes, filtro]);
  const totaisPorTipo = useMemo(() => calcularTotaisPorTipo(doacoes), [doacoes]);

  const abrirDoacao = useCallback((doacao: Doacao) => {
    navigation.navigate('DetalheDoacao', { doacaoId: doacao.id });
  }, [navigation]);

  const renderizarDoacao = useCallback<ListRenderItem<Doacao>>(({ item }) => (
    <DoacaoItem doacao={item} onAbrir={abrirDoacao} />
  ), [abrirDoacao]);

  function renderizarEstadoVazio() {
    if (doacoes.length === 0) {
      return (
        <View style={styles.estadoVazio}>
          <Text style={styles.textoVazio}>Nenhuma doacao registrada ainda.</Text>
          <TouchableOpacity
            style={styles.botaoPrincipal}
            onPress={() => navigation.navigate('CadastroDoacao')}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotaoPrincipal}>Registrar primeira doacao</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.estadoVazio}>
        <Text style={styles.textoVazio}>Nenhuma doacao encontrada para "{filtro}".</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.areaSegura} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.areaSegura}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          style={styles.historico}
          contentContainerStyle={[
            styles.conteudoHistorico,
            doacoesFiltradas.length === 0 && styles.conteudoHistoricoVazio,
          ]}
          data={doacoesFiltradas}
          keyExtractor={(doacao) => doacao.id}
          renderItem={renderizarDoacao}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <>
              <Text style={styles.tituloHistorico}>Minhas doacoes</Text>
              <ResumoDoacoes doacoes={doacoes} totaisPorTipo={totaisPorTipo} />
              <TextInput
                style={styles.inputBusca}
                placeholder="Filtrar por tipo de item"
                value={filtro}
                onChangeText={setFiltro}
                returnKeyType="done"
              />
            </>
          }
          ListEmptyComponent={renderizarEstadoVazio}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
