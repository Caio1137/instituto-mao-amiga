import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { ListRenderItem } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import PontoItem from '../components/PontoItem';
import { usePaginacao } from '../hooks/usePaginacao';
import { buscarPaginaPontos } from '../services/pontosService';
import { styles } from '../styles/styles';
import type { RootStackParamList } from '../types/navigation';
import type { Ponto } from '../types/ponto';

type Props = NativeStackScreenProps<RootStackParamList, 'ListaPontos'>;

export default function ListaPontosScreen({ navigation }: Props) {
  const [busca, setBusca] = useState('');
  const lista = usePaginacao(buscarPaginaPontos, busca);

  const abrirPonto = useCallback((ponto: Ponto) => {
    navigation.navigate('DetalhePonto', { pontoId: ponto.id });
  }, [navigation]);

  const renderizarPonto = useCallback<ListRenderItem<Ponto>>(({ item }) => (
    <PontoItem ponto={item} onAbrir={abrirPonto} />
  ), [abrirPonto]);

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

          <Text style={styles.secao}>Pontos de coleta e distribuição</Text>
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
