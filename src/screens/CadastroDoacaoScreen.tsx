import { useCallback, useEffect, useRef, useState } from 'react';
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
import { ApiError, mensagemErro } from '../services/api';
import { buscarDoacaoPorId, cadastrarDoacao, editarDoacao } from '../services/doacoesService';
import { listarPontos } from '../services/pontosService';
import { styles } from '../styles/styles';
import type { DadosDoacao } from '../types/doacao';
import type { RootStackParamList } from '../types/navigation';
import type { Ponto } from '../types/ponto';

type Props = NativeStackScreenProps<RootStackParamList, 'CadastroDoacao'>;

// O mesmo formulário cadastra (sem doacaoId) e edita (com doacaoId) uma doação.
export default function CadastroDoacaoScreen({ navigation, route }: Props) {
  const doacaoId = route.params?.doacaoId;
  const [tipoItem, setTipoItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pontoDestino, setPontoDestino] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const ocupado = useRef(false);

  const [carregandoDoacao, setCarregandoDoacao] = useState(!!doacaoId);
  const [erroDoacao, setErroDoacao] = useState('');
  const [tentativaDoacao, setTentativaDoacao] = useState(0);

  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [carregandoPontos, setCarregandoPontos] = useState(true);
  const [erroPontos, setErroPontos] = useState('');

  // Na edição, preenche o formulário com a doação buscada na API.
  useEffect(() => {
    if (!doacaoId) return;
    let ativo = true;
    setCarregandoDoacao(true);
    setErroDoacao('');

    buscarDoacaoPorId(doacaoId)
      .then((doacao) => {
        if (!ativo) return;
        setTipoItem(doacao.tipoItem);
        setQuantidade(String(doacao.quantidade));
        setPontoDestino(doacao.pontoDestino);
      })
      .catch((falha) => {
        if (!ativo) return;
        setErroDoacao(falha instanceof ApiError && falha.status === 404 ? 'Doação não encontrada.' : mensagemErro(falha));
      })
      .finally(() => { if (ativo) setCarregandoDoacao(false); });

    return () => { ativo = false; };
  }, [doacaoId, tentativaDoacao]);

  // Os destinos possíveis vêm da API (GET /api/v1/pontos).
  const carregarPontos = useCallback(async () => {
    setCarregandoPontos(true);
    setErroPontos('');

    try {
      setPontos(await listarPontos());
    } catch (falha) {
      setPontos([]);
      setErroPontos(`Não foi possível carregar os pontos. ${mensagemErro(falha)}`);
    } finally {
      setCarregandoPontos(false);
    }
  }, []);

  useEffect(() => {
    void carregarPontos();
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
      setErro('A quantidade deve conter somente números.');
    }
  }

  function escolherPonto(nome: string) {
    setPontoDestino(nome);
    setErro('');
  }

  async function salvar() {
    if (ocupado.current) return;

    // Validação do formulário antes de chamar a API.
    if (tipoItem.trim() === '') {
      setErro('Informe o tipo do item que será doado.');
      return;
    }

    if (!/^\d+$/.test(quantidade) || Number(quantidade) <= 0 || Number(quantidade) > 2147483647) {
      setErro('Informe uma quantidade inteira maior que zero.');
      return;
    }

    if (pontoDestino.trim() === '') {
      setErro('Escolha o ponto de destino da doação.');
      return;
    }

    const dados: DadosDoacao = {
      tipoItem: tipoItem.trim(),
      quantidade: Number(quantidade),
      pontoDestino: pontoDestino.trim(),
    };

    ocupado.current = true;
    setSalvando(true);
    setErro('');

    try {
      if (doacaoId) {
        await editarDoacao(doacaoId, dados);
        Keyboard.dismiss();
        navigation.goBack(); // volta ao detalhe, que busca a doação de novo
      } else {
        await cadastrarDoacao(dados);
        Keyboard.dismiss();
        navigation.popTo('HistoricoDoacoes', { mensagem: 'Doação registrada com sucesso.' });
      }
    } catch (falha) {
      // API recusou (400) ou está desligada: avisa e mantém o que foi digitado.
      setErro(`Não foi possível salvar a doação. ${mensagemErro(falha)}`);
    } finally {
      ocupado.current = false;
      setSalvando(false);
    }
  }

  const destinoForaDaLista = pontoDestino !== '' && !carregandoPontos
    && !pontos.some((ponto) => ponto.nome === pontoDestino);

  function renderizarPontos() {
    if (carregandoPontos) {
      return <ActivityIndicator color="#1B5E20" accessibilityLabel="Carregando pontos" />;
    }

    if (erroPontos !== '') {
      return (
        <>
          <Text accessibilityRole="alert" style={styles.erro}>{erroPontos}</Text>
          <TouchableOpacity accessibilityRole="button" style={[styles.botaoSecundario, styles.espacoSuperior]} onPress={() => { void carregarPontos(); }} activeOpacity={0.8}>
            <Text style={styles.textoBotaoSecundario}>Tentar carregar os pontos</Text>
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
              accessibilityRole="button"
              accessibilityState={{ selected: selecionado }}
              style={[styles.opcaoPonto, selecionado && styles.opcaoPontoSelecionada]}
              onPress={() => escolherPonto(ponto.nome)}
              disabled={salvando}
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

  if (carregandoDoacao || erroDoacao !== '') {
    return (
      <View style={[styles.container, styles.estadoVazio]}>
        {carregandoDoacao ? (
          <ActivityIndicator size="large" color="#1B5E20" accessibilityLabel="Carregando doação" />
        ) : (
          <>
            <Text accessibilityRole="alert" style={styles.textoErroApi}>{erroDoacao}</Text>
            <TouchableOpacity accessibilityRole="button" style={styles.botaoSecundario} onPress={() => setTentativaDoacao((n) => n + 1)}>
              <Text style={styles.textoBotaoSecundario}>Tentar novamente</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.areaSegura} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.areaSegura} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.container} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          <StatusBar style="auto" />
          <Text style={styles.descricaoFormulario}>
            {doacaoId
              ? 'Altere os dados da doação. As alterações são gravadas na API.'
              : 'Preencha os dados para registrar uma doação para um ponto do Instituto.'}
          </Text>

          <View style={styles.formulario}>
            <Text style={styles.rotuloCampo}>Tipo do item</Text>
            <TextInput
              style={styles.input}
              accessibilityLabel="Tipo do item"
              placeholder="Ex.: arroz, roupa ou produto de higiene"
              value={tipoItem}
              onChangeText={atualizarTipoItem}
              editable={!salvando}
              maxLength={100}
              returnKeyType="next"
            />

            <Text style={styles.rotuloCampo}>Quantidade</Text>
            <TextInput
              style={styles.input}
              accessibilityLabel="Quantidade"
              placeholder="Ex.: 10"
              value={quantidade}
              onChangeText={atualizarQuantidade}
              editable={!salvando}
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

            {erro !== '' && <Text accessibilityRole="alert" style={styles.erro}>{erro}</Text>}

            <TouchableOpacity
              accessibilityRole="button"
              style={[styles.botaoPrincipal, styles.espacoSuperior, salvando && styles.desabilitado]}
              onPress={() => { void salvar(); }}
              disabled={salvando}
              activeOpacity={0.8}
            >
              <Text style={styles.textoBotaoPrincipal}>
                {salvando ? 'Salvando...' : doacaoId ? 'Salvar alterações' : 'Salvar doação'}
              </Text>
            </TouchableOpacity>

            {doacaoId && (
              <TouchableOpacity
                accessibilityRole="button"
                style={styles.botaoSecundario}
                onPress={() => navigation.goBack()}
                disabled={salvando}
                activeOpacity={0.8}
              >
                <Text style={styles.textoBotaoSecundario}>Cancelar edição</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
