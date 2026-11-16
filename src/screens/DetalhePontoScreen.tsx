import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import DetalhePonto from '../components/DetalhePonto';
import { ApiError, mensagemErro } from '../services/api';
import { buscarPontoPorId } from '../services/pontosService';
import { styles } from '../styles/styles';
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

    return <DetalhePonto ponto={ponto} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <StatusBar style="auto" />
      {renderizarConteudo()}
    </ScrollView>
  );
}
