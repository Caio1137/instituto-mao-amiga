import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ApiError, mensagemErro } from '../services/api';
import { carregarFavoritos, salvarFavoritos } from '../services/favoritosStorage';
import { buscarPontoPorId } from '../services/pontosService';
import { styles } from '../styles/styles';
import type { RootStackParamList } from '../types/navigation';
import type { Ponto } from '../types/ponto';

type Props = NativeStackScreenProps<RootStackParamList, 'MeusPontos'>;

export default function MeusPontosScreen({ navigation }: Props) {
  const [ids, setIds] = useState<string[]>([]);
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [tentativa, setTentativa] = useState(0);

  // Lê os ids do aparelho e busca cada ponto na API pelo id, como os favoritos da Compre Bem.
  useFocusEffect(useCallback(() => {
    let ativo = true;

    async function carregar() {
      setCarregando(true);
      setErro('');
      setAviso('');

      try {
        const favoritos = await carregarFavoritos();
        const resultados = await Promise.allSettled(favoritos.map((id) => buscarPontoPorId(id)));
        if (!ativo) return;

        const encontrados: Ponto[] = [];
        const excluidos: string[] = [];
        let falhas = 0;
        let ultimaFalha: unknown = null;

        resultados.forEach((resultado, indice) => {
          if (resultado.status === 'fulfilled') {
            encontrados.push(resultado.value);
          } else if (resultado.reason instanceof ApiError && resultado.reason.status === 404) {
            excluidos.push(favoritos[indice]); // ponto excluído: fica de fora
          } else {
            falhas += 1;
            ultimaFalha = resultado.reason;
          }
        });

        // Tira do aparelho os ids de pontos que não existem mais na API.
        const restantes = favoritos.filter((id) => !excluidos.includes(id));
        if (excluidos.length > 0) {
          await salvarFavoritos(restantes);
        }

        setIds(restantes);
        setPontos(encontrados);
        if (falhas > 0 && encontrados.length === 0) {
          setErro(`Não foi possível carregar seus pontos. ${mensagemErro(ultimaFalha)}`);
        } else if (falhas > 0) {
          setAviso(`${falhas} ponto(s) não puderam ser carregados agora.`);
        }
      } catch (falha) {
        if (ativo) setErro(mensagemErro(falha));
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    void carregar();
    return () => { ativo = false; };
  }, [tentativa]));

  function desmarcar(ponto: Ponto) {
    // Sai da tela na hora e o AsyncStorage é atualizado.
    const novos = ids.filter((id) => id !== ponto.id);
    setIds(novos);
    setPontos((atuais) => atuais.filter((atual) => atual.id !== ponto.id));
    salvarFavoritos(novos).catch(() => setAviso('Não foi possível salvar a alteração neste aparelho.'));
  }

  function renderizarVazio() {
    if (carregando) {
      return (
        <View style={styles.estadoVazio}>
          <ActivityIndicator size="large" color="#1B5E20" accessibilityLabel="Carregando favoritos" />
        </View>
      );
    }

    if (erro !== '') {
      return (
        <View style={styles.estadoVazio}>
          <Text accessibilityRole="alert" style={styles.textoErroApi}>{erro}</Text>
          <TouchableOpacity accessibilityRole="button" style={styles.botaoSecundario} onPress={() => setTentativa((n) => n + 1)}>
            <Text style={styles.textoBotaoSecundario}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.estadoVazio}>
        <Text style={styles.textoVazio}>Você ainda não favoritou nenhum ponto.</Text>
        <Text style={styles.textoVazio}>Toque no ♡ de um ponto na lista para guardá-lo aqui.</Text>
      </View>
    );
  }

  return (
    <FlatList
      testID="meus-pontos"
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      data={carregando ? [] : pontos}
      keyExtractor={(ponto) => ponto.id}
      ListHeaderComponent={
        <>
          <Text style={styles.descricaoFormulario}>Pontos favoritados neste aparelho.</Text>
          {aviso !== '' && <Text accessibilityRole="alert" style={styles.erro}>{aviso}</Text>}
        </>
      }
      ListEmptyComponent={renderizarVazio}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`Ver detalhes de ${item.nome}`}
            style={styles.cardConteudo}
            onPress={() => navigation.navigate('DetalhePonto', { pontoId: item.id })}
            activeOpacity={0.8}
          >
            <Text style={styles.nomePonto}>{item.nome}</Text>
            <Text style={styles.info}>Bairro: {item.bairro}</Text>
            <Text style={styles.info}>Horário: {item.horario}</Text>
            <Text style={[styles.etiquetaTipo, item.tipo === 'coleta' ? styles.etiquetaColeta : styles.etiquetaDistribuicao]}>
              {item.tipo}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`Desmarcar ${item.nome} dos favoritos`}
            style={styles.botaoFavorito}
            onPress={() => desmarcar(item)}
            activeOpacity={0.7}
          >
            <Text style={[styles.iconeFavorito, styles.iconeFavoritoAtivo]}>♥</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}
