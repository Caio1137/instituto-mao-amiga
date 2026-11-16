import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ApiError, mensagemErro } from '../services/api';
import { buscarDoacaoPorId, excluirDoacao } from '../services/doacoesService';
import { styles } from '../styles/styles';
import { confirmarExclusao } from '../utils/confirmar';
import { formatarData } from '../utils/doacoes';
import type { Doacao } from '../types/doacao';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalheDoacao'>;

export default function DetalheDoacaoScreen({ navigation, route }: Props) {
  // A navegação só traz o id; os dados vêm sempre da API.
  const { doacaoId } = route.params;
  const [doacao, setDoacao] = useState<Doacao | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [naoEncontrada, setNaoEncontrada] = useState(false);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);
  const [excluindo, setExcluindo] = useState(false);
  const [erroAcao, setErroAcao] = useState('');

  // Busca de novo ao voltar da edição, para mostrar os valores novos.
  useFocusEffect(useCallback(() => {
    let ativo = true;
    setCarregando(true);
    setErro('');
    setNaoEncontrada(false);

    buscarDoacaoPorId(doacaoId)
      .then((resposta) => { if (ativo) setDoacao(resposta); })
      .catch((falha) => {
        if (!ativo) return;
        setDoacao(null);
        if (falha instanceof ApiError && falha.status === 404) {
          setNaoEncontrada(true);
        } else {
          setErro(mensagemErro(falha));
        }
      })
      .finally(() => { if (ativo) setCarregando(false); });

    return () => { ativo = false; };
  }, [doacaoId, tentativa]));

  async function excluir() {
    if (excluindo) return;
    setExcluindo(true);
    setErroAcao('');

    try {
      await excluirDoacao(doacaoId);
      navigation.popTo('HistoricoDoacoes', { mensagem: 'Doação excluída com sucesso.' });
    } catch (falha) {
      // API desligada ou erro: avisa e a doação continua na tela.
      setErroAcao(`Não foi possível excluir. ${mensagemErro(falha)}`);
    } finally {
      setExcluindo(false);
    }
  }

  function renderizarConteudo() {
    if (carregando && !doacao) {
      return <ActivityIndicator size="large" color="#1B5E20" accessibilityLabel="Carregando doação" />;
    }

    if (naoEncontrada) {
      return (
        <View style={styles.estadoVazio}>
          <Text accessibilityRole="alert" style={styles.textoErroApi}>Doação não encontrada.</Text>
          <TouchableOpacity accessibilityRole="button" style={styles.botaoSecundario} onPress={() => navigation.popTo('HistoricoDoacoes')}>
            <Text style={styles.textoBotaoSecundario}>Voltar ao histórico</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!doacao) {
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
        <View style={styles.detalhe}>
          <Text style={styles.nomeDetalhe}>{doacao.tipoItem}</Text>
          <Text style={styles.rotulo}>Quantidade</Text>
          <Text style={styles.textoDetalhe}>{doacao.quantidade}</Text>
          <Text style={styles.rotulo}>Ponto de destino</Text>
          <Text style={styles.textoDetalhe}>{doacao.pontoDestino}</Text>
          <Text style={styles.rotulo}>Registrada em</Text>
          <Text style={styles.textoDetalhe}>{formatarData(doacao.criadoEm)}</Text>
        </View>

        {erroAcao !== '' && <Text accessibilityRole="alert" style={styles.textoErroApi}>{erroAcao}</Text>}

        <TouchableOpacity
          accessibilityRole="button"
          style={[styles.botaoSecundario, excluindo && styles.desabilitado]}
          onPress={() => navigation.navigate('CadastroDoacao', { doacaoId })}
          disabled={excluindo}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotaoSecundario}>Editar doação</Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="button"
          style={[styles.botaoPerigo, excluindo && styles.desabilitado]}
          onPress={() => confirmarExclusao(
            'Excluir doação',
            `Deseja realmente excluir a doação de ${doacao.quantidade} x ${doacao.tipoItem}?`,
            () => { void excluir(); },
          )}
          disabled={excluindo}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotaoPrincipal}>{excluindo ? 'Excluindo...' : 'Excluir doação'}</Text>
        </TouchableOpacity>
      </>
    );
  }

  return (
    <SafeAreaView style={styles.areaSegura} edges={['bottom', 'left', 'right']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
        {renderizarConteudo()}
      </ScrollView>
    </SafeAreaView>
  );
}
