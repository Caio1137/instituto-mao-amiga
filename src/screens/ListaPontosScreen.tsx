import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import PontoItem from '../components/PontoItem';
import { listarPontos } from '../services/pontosService';
import { styles } from '../styles/styles';
import type { RootStackParamList } from '../types/navigation';
import type { Ponto } from '../types/ponto';

type Props = NativeStackScreenProps<RootStackParamList, 'ListaPontos'>;

export default function ListaPontosScreen({ navigation }: Props) {
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [totalPontos, setTotalPontos] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregarPontos = useCallback(async () => {
    setCarregando(true);
    setErro('');

    try {
      const pagina = await listarPontos();
      setPontos(pagina.content);
      setTotalPontos(pagina.page.totalElements);
    } catch {
      setPontos([]);
      setTotalPontos(0);
      setErro('Nao foi possivel carregar os pontos. Verifique se a API esta ligada e tente novamente.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarPontos();
  }, [carregarPontos]);

  function renderizarEstadoVazio() {
    if (carregando) {
      return (
        <View style={styles.estadoVazio}>
          <ActivityIndicator size="large" color="#1B5E20" />
        </View>
      );
    }

    if (erro !== '') {
      return (
        <View style={styles.estadoVazio}>
          <Text style={styles.textoErroApi}>{erro}</Text>
          <TouchableOpacity style={styles.botaoSecundario} onPress={carregarPontos} activeOpacity={0.8}>
            <Text style={styles.textoBotaoSecundario}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.estadoVazio}>
        <Text style={styles.textoVazio}>Nenhum ponto cadastrado.</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      data={pontos}
      keyExtractor={(ponto) => String(ponto.id)}
      renderItem={({ item }) => (
        <PontoItem
          ponto={item}
          onPress={() => navigation.navigate('DetalhePonto', { pontoId: item.id })}
        />
      )}
      ListEmptyComponent={renderizarEstadoVazio}
      ListHeaderComponent={
        <>
          <StatusBar style="auto" />
          <Text style={styles.titulo}>Instituto Mao Amiga</Text>
          <Text style={styles.subtitulo}>
            App simples para consultar pontos de coleta e distribuicao.
          </Text>

          <View style={styles.resumo}>
            <Text style={styles.resumoTexto}>Pontos cadastrados: {totalPontos}</Text>
            <Text style={styles.resumoTexto}>Toque em um ponto para ver os detalhes</Text>
          </View>

          <TouchableOpacity
            style={styles.botaoPrincipal}
            onPress={() => navigation.navigate('CadastroDoacao')}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotaoPrincipal}>Registrar doacao</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoSecundario}
            onPress={() => navigation.navigate('HistoricoDoacoes')}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotaoSecundario}>Minhas doacoes</Text>
          </TouchableOpacity>

          <Text style={styles.secao}>Pontos de coleta e distribuicao</Text>
        </>
      }
    />
  );
}
