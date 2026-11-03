import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import DetalhePonto from '../components/DetalhePonto';
import { ApiError } from '../services/api';
import { buscarPontoPorId } from '../services/pontosService';
import { styles } from '../styles/styles';
import type { RootStackParamList } from '../types/navigation';
import type { Ponto } from '../types/ponto';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalhePonto'>;

export default function DetalhePontoScreen({ route }: Props) {
  const { pontoId } = route.params;
  const [ponto, setPonto] = useState<Ponto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregarPonto = useCallback(async () => {
    setCarregando(true);
    setErro('');

    try {
      setPonto(await buscarPontoPorId(pontoId));
    } catch (error) {
      setPonto(null);
      setErro(
        error instanceof ApiError && error.status === 404
          ? 'Ponto não encontrado.'
          : 'Nao foi possivel carregar o ponto. Verifique se a API esta ligada e tente novamente.',
      );
    } finally {
      setCarregando(false);
    }
  }, [pontoId]);

  useEffect(() => {
    carregarPonto();
  }, [carregarPonto]);

  function renderizarConteudo() {
    if (carregando) {
      return <ActivityIndicator size="large" color="#1B5E20" />;
    }

    if (ponto) {
      return <DetalhePonto ponto={ponto} />;
    }

    return (
      <View style={styles.estadoVazio}>
        <Text style={styles.textoErroApi}>{erro}</Text>
        <TouchableOpacity style={styles.botaoSecundario} onPress={carregarPonto} activeOpacity={0.8}>
          <Text style={styles.textoBotaoSecundario}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <StatusBar style="auto" />
      <Text style={styles.secao}>Detalhe do ponto</Text>
      {renderizarConteudo()}
    </ScrollView>
  );
}
