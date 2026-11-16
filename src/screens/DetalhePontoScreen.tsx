import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import DetalhePonto from '../components/DetalhePonto';
import { ApiError, mensagemErro } from '../services/api';
import { buscarPontoPorId, excluirPonto } from '../services/pontosService';
import { styles } from '../styles/styles';
import { confirmarExclusao } from '../utils/confirmar';
import type { RootStackParamList } from '../types/navigation';
import type { Ponto } from '../types/ponto';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalhePonto'>;

export default function DetalhePontoScreen({ navigation, route }: Props) {
  // A navegação só traz o id; os dados vêm sempre da API.
  const { pontoId } = route.params;
  const [ponto, setPonto] = useState<Ponto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [naoEncontrado, setNaoEncontrado] = useState(false);
  const [tentativa, setTentativa] = useState(0);
  const [excluindo, setExcluindo] = useState(false);
  const [erroAcao, setErroAcao] = useState('');

  // Busca de novo ao voltar da edição, para mostrar os valores novos.
  useFocusEffect(useCallback(() => {
    let ativo = true;
    setCarregando(true);
    setErro('');
    setNaoEncontrado(false);

    buscarPontoPorId(pontoId)
      .then((resposta) => { if (ativo) setPonto(resposta); })
      .catch((falha) => {
        if (!ativo) return;
        setPonto(null);
        if (falha instanceof ApiError && falha.status === 404) {
          setNaoEncontrado(true);
        } else {
          setErro(mensagemErro(falha));
        }
      })
      .finally(() => { if (ativo) setCarregando(false); });

    return () => { ativo = false; };
  }, [pontoId, tentativa]));

  async function excluir() {
    if (excluindo) return;
    setExcluindo(true);
    setErroAcao('');

    try {
      await excluirPonto(pontoId);
      navigation.popTo('ListaPontos', { mensagem: 'Ponto excluído com sucesso.' });
    } catch (falha) {
      // API desligada ou erro: avisa e o ponto continua na tela.
      setErroAcao(`Não foi possível excluir. ${mensagemErro(falha)}`);
    } finally {
      setExcluindo(false);
    }
  }

  function renderizarConteudo() {
    if (carregando && !ponto) {
      return <ActivityIndicator size="large" color="#1B5E20" accessibilityLabel="Carregando ponto" />;
    }

    if (naoEncontrado) {
      return (
        <View style={styles.estadoVazio}>
          <Text accessibilityRole="alert" style={styles.textoErroApi}>Ponto não encontrado.</Text>
          <TouchableOpacity accessibilityRole="button" style={styles.botaoSecundario} onPress={() => navigation.popTo('ListaPontos')}>
            <Text style={styles.textoBotaoSecundario}>Voltar à lista</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!ponto) {
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
      <>
        <DetalhePonto ponto={ponto} />
        {erroAcao !== '' && <Text accessibilityRole="alert" style={styles.textoErroApi}>{erroAcao}</Text>}
        <TouchableOpacity
          accessibilityRole="button"
          style={[styles.botaoSecundario, excluindo && styles.desabilitado]}
          onPress={() => navigation.navigate('CadastroPonto', { pontoId })}
          disabled={excluindo}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotaoSecundario}>Editar ponto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          style={[styles.botaoPerigo, excluindo && styles.desabilitado]}
          onPress={() => confirmarExclusao('Excluir ponto', `Deseja realmente excluir "${ponto.nome}"?`, () => { void excluir(); })}
          disabled={excluindo}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotaoPrincipal}>{excluindo ? 'Excluindo...' : 'Excluir ponto'}</Text>
        </TouchableOpacity>
      </>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <StatusBar style="auto" />
      {renderizarConteudo()}
    </ScrollView>
  );
}
