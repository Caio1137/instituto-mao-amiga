import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { atualizarDoacao, buscarDoacaoPorId, salvarDoacao } from '../services/doacoesStorage';
import { listarPontos } from '../services/pontosService';
import { styles } from '../styles/styles';
import type { DadosDoacao, Doacao } from '../types/doacao';
import type { RootStackParamList } from '../types/navigation';
import type { Ponto } from '../types/ponto';

type Props = NativeStackScreenProps<RootStackParamList, 'CadastroDoacao'>;

export default function CadastroDoacaoScreen({ navigation, route }: Props) {
  const doacaoId = route.params?.doacaoId;
  const [doacaoEmEdicao, setDoacaoEmEdicao] = useState<Doacao | null>(null);
  const [tipoItem, setTipoItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pontoDestino, setPontoDestino] = useState('');
  const [erro, setErro] = useState('');

  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [carregandoPontos, setCarregandoPontos] = useState(true);
  const [erroPontos, setErroPontos] = useState('');

  useEffect(() => {
    setDoacaoEmEdicao(null);
    setTipoItem('');
    setQuantidade('');
    setPontoDestino('');
    setErro('');

    if (!doacaoId) {
      return;
    }

    buscarDoacaoPorId(doacaoId)
      .then((doacao) => {
        if (doacao) {
          setDoacaoEmEdicao(doacao);
          setTipoItem(doacao.tipoItem);
          setQuantidade(String(doacao.quantidade));
          setPontoDestino(doacao.pontoDestino);
        }
      })
      .catch(() => setErro('Nao foi possivel carregar a doacao.'));
  }, [doacaoId]);

  const carregarPontos = useCallback(async () => {
    setCarregandoPontos(true);
    setErroPontos('');

    try {
      const pagina = await listarPontos();
      setPontos(pagina.content);
    } catch {
      setPontos([]);
      setErroPontos('Nao foi possivel carregar os pontos da API.');
    } finally {
      setCarregandoPontos(false);
    }
  }, []);

  useEffect(() => {
    carregarPontos();
  }, [carregarPontos]);

  function atualizarTipoItem(texto: string) {
    setTipoItem(texto);
    setErro('');
  }

  function atualizarQuantidade(texto: string) {
    if (texto === '' || /^\d+$/.test(texto)) {
      setQuantidade(texto);
      setErro('');
    } else {
      setErro('A quantidade deve conter somente numeros.');
    }
  }

  function escolherPonto(nome: string) {
    setPontoDestino(nome);
    setErro('');
  }

  async function salvarCadastro() {
    if (tipoItem.trim() === '') {
      setErro('Informe o tipo do item que sera doado.');
      return;
    }

    if (quantidade === '' || !/^\d+$/.test(quantidade) || Number(quantidade) <= 0) {
      setErro('Informe uma quantidade inteira maior que zero.');
      return;
    }

    if (pontoDestino.trim() === '') {
      setErro('Escolha o ponto de destino da doacao.');
      return;
    }

    const dadosDaDoacao: DadosDoacao = {
      tipoItem: tipoItem.trim(),
      quantidade: Number(quantidade),
      pontoDestino: pontoDestino.trim(),
    };

    try {
      if (doacaoEmEdicao) {
        await atualizarDoacao({ ...doacaoEmEdicao, ...dadosDaDoacao });
        navigation.goBack();
      } else {
        await salvarDoacao(dadosDaDoacao);
        navigation.replace('HistoricoDoacoes');
      }

      Keyboard.dismiss();
    } catch {
      setErro('Nao foi possivel salvar a doacao. Tente novamente.');
    }
  }

  const destinoForaDaLista = pontoDestino !== ''
    && !pontos.some((ponto) => ponto.nome === pontoDestino);

  function renderizarPontos() {
    if (carregandoPontos) {
      return <ActivityIndicator color="#1B5E20" />;
    }

    if (erroPontos !== '') {
      return (
        <>
          <Text style={styles.erro}>{erroPontos}</Text>
          <TouchableOpacity style={styles.botaoSecundario} onPress={carregarPontos} activeOpacity={0.8}>
            <Text style={styles.textoBotaoSecundario}>Tentar novamente</Text>
          </TouchableOpacity>
        </>
      );
    }

    return (
      <View style={styles.listaOpcoes}>
        {pontos.map((ponto) => {
          const selecionado = ponto.nome === pontoDestino;

          return (
            <TouchableOpacity
              key={ponto.id}
              style={[styles.opcaoPonto, selecionado && styles.opcaoPontoSelecionada]}
              onPress={() => escolherPonto(ponto.nome)}
              activeOpacity={0.8}
            >
              <Text style={[styles.textoOpcaoPonto, selecionado && styles.textoOpcaoPontoSelecionada]}>
                {ponto.nome}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.areaSegura} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.areaSegura}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.conteudo}
          keyboardShouldPersistTaps="handled"
        >
          <StatusBar style="auto" />
          <Text style={styles.tituloFormulario}>
            {doacaoId ? 'Editar doacao' : 'Cadastro de doacao'}
          </Text>
          <Text style={styles.descricaoFormulario}>
            {doacaoId
              ? 'Altere os dados necessarios e salve a doacao.'
              : 'Preencha os dados para registrar uma doacao para um ponto do Instituto.'}
          </Text>

          <View style={styles.formulario}>
            <Text style={styles.rotuloCampo}>Tipo do item</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: arroz, roupa ou produto de higiene"
              value={tipoItem}
              onChangeText={atualizarTipoItem}
              returnKeyType="next"
            />

            <Text style={styles.rotuloCampo}>Quantidade</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: 10"
              value={quantidade}
              onChangeText={atualizarQuantidade}
              keyboardType="number-pad"
              returnKeyType="done"
            />

            <Text style={styles.rotuloCampo}>Ponto de destino</Text>
            {renderizarPontos()}
            {destinoForaDaLista && (
              <Text style={styles.avisoCampo}>
                Destino atual: {pontoDestino}. Escolha um ponto da lista para trocar.
              </Text>
            )}

            {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

            <TouchableOpacity
              style={[styles.botaoPrincipal, { marginTop: 16 }]}
              onPress={salvarCadastro}
              activeOpacity={0.8}
            >
              <Text style={styles.textoBotaoPrincipal}>
                {doacaoId ? 'Salvar alteracoes' : 'Salvar doacao'}
              </Text>
            </TouchableOpacity>

            {doacaoId && (
              <TouchableOpacity
                style={styles.botaoSecundario}
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
              >
                <Text style={styles.textoBotaoSecundario}>Cancelar edicao</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
