import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { ListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import DoacaoItem from '../components/DoacaoItem';
import { usePaginacao } from '../hooks/usePaginacao';
import { buscarPaginaDoacoes } from '../services/doacoesService';
import { styles } from '../styles/styles';
import type { Doacao } from '../types/doacao';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'HistoricoDoacoes'>;

export default function HistoricoDoacoesScreen({ navigation, route }: Props) {
  const [filtro, setFiltro] = useState('');
  // Recarrega ao ganhar foco: a doação nova aparece no topo (a API ordena por criadoEm desc).
  const lista = usePaginacao(buscarPaginaDoacoes, filtro);
  const mensagem = route.params?.mensagem;

  useEffect(() => {
    if (!mensagem) return;
    const timer = setTimeout(() => navigation.setParams({ mensagem: undefined }), 4000);
    return () => clearTimeout(timer);
  }, [mensagem, navigation]);

  const abrirDoacao = useCallback((doacao: Doacao) => {
    navigation.navigate('DetalheDoacao', { doacaoId: doacao.id });
  }, [navigation]);

  const renderizarDoacao = useCallback<ListRenderItem<Doacao>>(({ item }) => (
    <DoacaoItem doacao={item} onAbrir={abrirDoacao} />
  ), [abrirDoacao]);

  function renderizarVazio() {
    if (lista.carregando) {
      return (
        <View style={styles.estadoVazio}>
          <ActivityIndicator size="large" color="#1B5E20" accessibilityLabel="Carregando doações" />
          <Text style={styles.textoVazio}>Carregando doações...</Text>
        </View>
      );
    }

    if (lista.erro !== '') {
      return (
        <View style={styles.estadoVazio}>
          <Text accessibilityRole="alert" style={styles.textoErroApi}>
            Não foi possível carregar o histórico. {lista.erro}
          </Text>
          <TouchableOpacity accessibilityRole="button" style={styles.botaoSecundario} onPress={lista.recarregar} activeOpacity={0.8}>
            <Text style={styles.textoBotaoSecundario}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (filtro.trim() !== '') {
      return (
        <View style={styles.estadoVazio}>
          <Text style={styles.textoVazio}>Nenhuma doação encontrada para "{filtro.trim()}".</Text>
        </View>
      );
    }

    return (
      <View style={styles.estadoVazio}>
        <Text style={styles.textoVazio}>Nenhuma doação registrada ainda.</Text>
        <TouchableOpacity
          accessibilityRole="button"
          style={styles.botaoPrincipal}
          onPress={() => navigation.navigate('CadastroDoacao')}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotaoPrincipal}>Registrar primeira doação</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderizarRodape() {
    if (lista.carregando || lista.itens.length === 0) {
      return null;
    }

    return (
      <View style={styles.rodapeLista}>
        {lista.carregandoMais && <ActivityIndicator color="#1B5E20" accessibilityLabel="Carregando mais doações" />}
        {lista.erroMais !== '' ? (
          <>
            <Text accessibilityRole="alert" style={styles.textoErroApi}>{lista.erroMais}</Text>
            <TouchableOpacity accessibilityRole="button" style={styles.botaoSecundario} onPress={() => { void lista.carregarMais(true); }}>
              <Text style={styles.textoBotaoSecundario}>Tentar carregar mais</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text testID="rodape-doacoes" style={styles.textoRodape}>
            {lista.itens.length} de {lista.pagina?.totalElements} doações
            {lista.temMais ? ' · role para ver mais' : ' · fim do histórico'}
          </Text>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.areaSegura} edges={['bottom', 'left', 'right']}>
      <FlatList
        testID="lista-doacoes"
        style={styles.historico}
        contentContainerStyle={styles.conteudoHistorico}
        data={lista.itens}
        keyExtractor={(doacao) => doacao.id}
        renderItem={renderizarDoacao}
        keyboardShouldPersistTaps="handled"
        onEndReached={() => { void lista.carregarMais(); }}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={renderizarVazio}
        ListFooterComponent={renderizarRodape}
        ListHeaderComponent={
          <>
            <Text style={styles.tituloHistorico}>Minhas doações</Text>
            {mensagem && <Text accessibilityRole="alert" style={styles.sucesso}>{mensagem}</Text>}
            <TouchableOpacity
              accessibilityRole="button"
              style={styles.botaoPrincipal}
              onPress={() => navigation.navigate('CadastroDoacao')}
              activeOpacity={0.8}
            >
              <Text style={styles.textoBotaoPrincipal}>Registrar doação</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.inputBusca}
              accessibilityLabel="Filtrar doações por tipo de item"
              placeholder="Filtrar por tipo de item"
              value={filtro}
              onChangeText={setFiltro}
              returnKeyType="search"
            />
          </>
        }
      />
    </SafeAreaView>
  );
}
