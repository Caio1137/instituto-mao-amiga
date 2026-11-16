import { useEffect, useRef, useState } from 'react';
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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { mensagemErro } from '../services/api';
import { buscarPontoPorId, cadastrarPonto, editarPonto } from '../services/pontosService';
import { styles } from '../styles/styles';
import type { RootStackParamList } from '../types/navigation';
import type { DadosPonto, TipoPonto } from '../types/ponto';

type Props = NativeStackScreenProps<RootStackParamList, 'CadastroPonto'>;

const TIPOS: { valor: TipoPonto; rotulo: string }[] = [
  { valor: 'coleta', rotulo: 'Coleta' },
  { valor: 'distribuição', rotulo: 'Distribuição' },
];

// O mesmo formulário cadastra (sem pontoId) e edita (com pontoId), como na Compre Bem.
export default function CadastroPontoScreen({ navigation, route }: Props) {
  const pontoId = route.params?.pontoId;
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [horario, setHorario] = useState('');
  const [tipo, setTipo] = useState<TipoPonto | ''>('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(!!pontoId);
  const [erroCarga, setErroCarga] = useState('');
  const [tentativa, setTentativa] = useState(0);
  const [salvando, setSalvando] = useState(false);
  const ocupado = useRef(false);

  useEffect(() => {
    if (!pontoId) return;
    let ativo = true;
    setCarregando(true);
    setErroCarga('');

    buscarPontoPorId(pontoId)
      .then((ponto) => {
        if (!ativo) return;
        setNome(ponto.nome);
        setEndereco(ponto.endereco);
        setBairro(ponto.bairro);
        setHorario(ponto.horario);
        setTipo(ponto.tipo);
      })
      .catch((falha) => { if (ativo) setErroCarga(mensagemErro(falha)); })
      .finally(() => { if (ativo) setCarregando(false); });

    return () => { ativo = false; };
  }, [pontoId, tentativa]);

  function alterar(atualizar: (texto: string) => void, texto: string) {
    atualizar(texto);
    setErro('');
  }

  function validar(): string {
    const vazios = [
      nome.trim() === '' && 'nome',
      endereco.trim() === '' && 'endereço',
      bairro.trim() === '' && 'bairro',
      horario.trim() === '' && 'horário',
      tipo === '' && 'tipo',
    ].filter(Boolean);

    return vazios.length > 0 ? `Preencha: ${vazios.join(', ')}.` : '';
  }

  async function salvar() {
    if (ocupado.current) return;

    const mensagemValidacao = validar();
    if (mensagemValidacao !== '' || tipo === '') {
      setErro(mensagemValidacao);
      return;
    }

    const dados: DadosPonto = {
      nome: nome.trim(),
      endereco: endereco.trim(),
      bairro: bairro.trim(),
      horario: horario.trim(),
      tipo,
    };

    ocupado.current = true;
    setSalvando(true);
    setErro('');

    try {
      if (pontoId) {
        await editarPonto(pontoId, dados);
        Keyboard.dismiss();
        navigation.goBack(); // volta ao detalhe, que busca o ponto de novo
      } else {
        await cadastrarPonto(dados);
        Keyboard.dismiss();
        navigation.popTo('ListaPontos', { mensagem: 'Ponto cadastrado com sucesso.' });
      }
    } catch (falha) {
      // 400 ou API desligada: mostra a mensagem e mantém o que foi digitado.
      setErro(mensagemErro(falha));
    } finally {
      ocupado.current = false;
      setSalvando(false);
    }
  }

  if (carregando || erroCarga !== '') {
    return (
      <View style={[styles.container, styles.estadoVazio]}>
        {carregando ? (
          <ActivityIndicator size="large" color="#1B5E20" accessibilityLabel="Carregando ponto" />
        ) : (
          <>
            <Text accessibilityRole="alert" style={styles.textoErroApi}>{erroCarga}</Text>
            <TouchableOpacity accessibilityRole="button" style={styles.botaoSecundario} onPress={() => setTentativa((n) => n + 1)}>
              <Text style={styles.textoBotaoSecundario}>Tentar novamente</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.areaSegura} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <Text style={styles.descricaoFormulario}>
          {pontoId
            ? 'Altere os dados do ponto. As alterações são gravadas na API.'
            : 'Preencha os dados do novo ponto de coleta ou distribuição.'}
        </Text>

        <View style={styles.formulario}>
          <Text style={styles.rotuloCampo}>Nome</Text>
          <TextInput style={styles.input} accessibilityLabel="Nome do ponto" placeholder="Ex.: Ponto Praça Universitária"
            value={nome} onChangeText={(texto) => alterar(setNome, texto)} editable={!salvando} maxLength={100} />

          <Text style={styles.rotuloCampo}>Endereço</Text>
          <TextInput style={styles.input} accessibilityLabel="Endereço" placeholder="Ex.: Praça Universitária, s/n"
            value={endereco} onChangeText={(texto) => alterar(setEndereco, texto)} editable={!salvando} maxLength={200} />

          <Text style={styles.rotuloCampo}>Bairro</Text>
          <TextInput style={styles.input} accessibilityLabel="Bairro" placeholder="Ex.: Setor Universitário"
            value={bairro} onChangeText={(texto) => alterar(setBairro, texto)} editable={!salvando} maxLength={80} />

          <Text style={styles.rotuloCampo}>Horário</Text>
          <TextInput style={styles.input} accessibilityLabel="Horário" placeholder="Ex.: Seg a Sex, 8h às 17h"
            value={horario} onChangeText={(texto) => alterar(setHorario, texto)} editable={!salvando} maxLength={100} />

          <Text style={styles.rotuloCampo}>Tipo</Text>
          <View style={styles.listaOpcoes}>
            {TIPOS.map((opcao) => {
              const selecionado = tipo === opcao.valor;
              return (
                <TouchableOpacity
                  key={opcao.valor}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selecionado }}
                  style={[styles.opcaoPonto, styles.opcaoTipo, selecionado && styles.opcaoPontoSelecionada]}
                  onPress={() => { setTipo(opcao.valor); setErro(''); }}
                  disabled={salvando}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.textoOpcaoPonto, selecionado && styles.textoOpcaoPontoSelecionada]}>
                    {opcao.rotulo}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {erro !== '' && <Text accessibilityRole="alert" style={styles.erro}>{erro}</Text>}

          <TouchableOpacity
            accessibilityRole="button"
            style={[styles.botaoPrincipal, styles.espacoSuperior, salvando && styles.desabilitado]}
            onPress={() => { void salvar(); }}
            disabled={salvando}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotaoPrincipal}>
              {salvando ? 'Salvando...' : pontoId ? 'Salvar alterações' : 'Cadastrar ponto'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
