import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { ListRenderItem } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import PontoItem from '../components/PontoItem';
import { useFavoritos } from '../hooks/useFavoritos';
import { usePaginacao } from '../hooks/usePaginacao';
import { buscarPaginaPontos } from '../services/pontosService';
import { styles } from '../styles/styles';
import type { RootStackParamList } from '../types/navigation';
import type { Ponto } from '../types/ponto';

type Props = NativeStackScreenProps<RootStackParamList, 'ListaPontos'>;

export default function ListaPontosScreen({ navigation, route }: Props) {
  const [busca, setBusca] = useState('');
  const lista = usePaginacao(buscarPaginaPontos, busca);
  const { favoritos, erroFavoritos, alternar } = useFavoritos();
  const mensagem = route.params?.mensagem;

  // A mensagem de sucesso (ponto cadastrado/excluído) some depois de alguns segundos.
  useEffect(() => {
    if (!mensagem) return;
    const timer = setTimeout(() => navigation.setParams({ mensagem: undefined }), 4000);
    return () => clearTimeout(timer);
  }, [mensagem, navigation]);

  const abrirPonto = useCallback((ponto: Ponto) => {
    navigation.navigate('DetalhePonto', { pontoId: ponto.id });
  }, [navigation]);

  const alternarFavorito = useCallback((ponto: Ponto) => alternar(ponto.id), [alternar]);

  const renderizarPonto = useCallback<ListRenderItem<Ponto>>(({ item }) => (
    <PontoItem
      ponto={item}
      favorito={favoritos.includes(item.id)}
      onAbrir={abrirPonto}
      onAlternarFavorito={alternarFavorito}
    />
  ), [abrirPonto, alternarFavorito, favoritos]);

  function renderizarVazio() {
    if (lista.carregando) {
      return (
        <View style={styles.estadoVazio}>
          <ActivityIndicator size="large" color="#1B5E20" accessibilityLabel="Carregando pontos" />
          <Text style={styles.textoVazio}>Carregando pontos...</Text>
        </View>
      );
    }

    if (lista.erro !== '') {
      return (
        <View style={styles.estadoVazio}>
          <Text accessibilityRole="alert" style={styles.textoErroApi}>{lista.erro}</Text>
          <TouchableOpacity accessibilityRole="button" style={styles.botaoSecundario} onPress={lista.recarregar} activeOpacity={0.8}>
            <Text style={styles.textoBotaoSecundario}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.estadoVazio}>
        <Text style={styles.textoVazio}>
          {busca.trim() === '' ? 'Nenhum ponto cadastrado.' : `Nenhum ponto encontrado para "${busca.trim()}".`}
        </Text>
      </View>
    );
  }

  function renderizarRodape() {
    if (lista.carregando || lista.itens.length === 0) {
      return null;
    }

    return (
      <View style={styles.rodapeLista}>
        {lista.carregandoMais && <ActivityIndicator color="#1B5E20" accessibilityLabel="Carregando mais pontos" />}
        {lista.erroMais !== '' ? (
          <>
            <Text accessibilityRole="alert" style={styles.textoErroApi}>{lista.erroMais}</Text>
            <TouchableOpacity accessibilityRole="button" style={styles.botaoSecundario} onPress={() => { void lista.carregarMais(true); }}>
              <Text style={styles.textoBotaoSecundario}>Tentar carregar mais</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text testID="rodape-pontos" style={styles.textoRodape}>
            {lista.itens.length} de {lista.pagina?.totalElements} pontos
            {lista.temMais ? ' · role para ver mais' : ' · fim da lista'}
          </Text>
        )}
      </View>
    );
  }

  return (
    <FlatList
      testID="lista-pontos"
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      data={lista.itens}
      extraData={favoritos}
      keyExtractor={(ponto) => ponto.id}
      renderItem={renderizarPonto}
      keyboardShouldPersistTaps="handled"
      onEndReached={() => { void lista.carregarMais(); }}
      onEndReachedThreshold={0.4}
      ListEmptyComponent={renderizarVazio}
      ListFooterComponent={renderizarRodape}
      ListHeaderComponent={
        <>
          <StatusBar style="auto" />
          <Text style={styles.titulo}>Instituto Mão Amiga</Text>
          <Text style={styles.subtitulo}>Pontos de coleta e distribuição em Goiânia.</Text>

          <TouchableOpacity
            accessibilityRole="button"
            style={styles.botaoPrincipal}
            onPress={() => navigation.navigate('CadastroDoacao')}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotaoPrincipal}>Registrar doação</Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            style={styles.botaoSecundario}
            onPress={() => navigation.navigate('HistoricoDoacoes')}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotaoSecundario}>Minhas doações</Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            style={styles.botaoSecundario}
            onPress={() => navigation.navigate('MeusPontos')}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotaoSecundario}>Meus pontos ({favoritos.length})</Text>
          </TouchableOpacity>
          {erroFavoritos !== '' && <Text accessibilityRole="alert" style={styles.erro}>{erroFavoritos}</Text>}

          <Text style={styles.secao}>Pontos de coleta e distribuição</Text>
          {mensagem && <Text accessibilityRole="alert" style={styles.sucesso}>{mensagem}</Text>}
          <TouchableOpacity
            accessibilityRole="button"
            style={styles.botaoSecundario}
            onPress={() => navigation.navigate('CadastroPonto')}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotaoSecundario}>Cadastrar ponto</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.inputBusca}
            accessibilityLabel="Buscar pontos"
            placeholder="Buscar por nome ou bairro"
            value={busca}
            onChangeText={setBusca}
            returnKeyType="search"
          />
        </>
      }
    />
  );
}
