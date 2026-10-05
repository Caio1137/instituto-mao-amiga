import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  atualizarDoacao,
  excluirDoacao,
  listarDoacoes,
  salvarDoacao,
} from './doacoesStorage';

const Stack = createNativeStackNavigator();

const pontos = [
  {
    id: '1',
    nome: 'Sede Central',
    endereco: 'Rua das Flores, 120 - Centro',
    horario: 'Segunda a sexta, das 8h as 17h',
    atendimento: 'Recebe alimentos, roupas e produtos de higiene.',
  },
  {
    id: '2',
    nome: 'Ponto Vila Nova',
    endereco: 'Avenida Esperanca, 455 - Vila Nova',
    horario: 'Tercas e quintas, das 13h as 18h',
    atendimento: 'Distribui cestas basicas para familias cadastradas.',
  },
  {
    id: '3',
    nome: 'Ponto Jardim Sul',
    endereco: 'Rua Comunitaria, 88 - Jardim Sul',
    horario: 'Sabados, das 9h as 14h',
    atendimento: 'Recebe doacoes de alimentos nao pereciveis e cobertores.',
  },
  {
    id: '4',
    nome: 'Espaco Bairro Esperanca',
    endereco: 'Travessa da Paz, 41 - Bairro Esperanca',
    horario: 'Segundas e quartas, das 14h as 18h',
    atendimento: 'Distribui kits de higiene para familias encaminhadas.',
  },
  {
    id: '5',
    nome: 'Centro Comunitario Norte',
    endereco: 'Rua dos Ipes, 730 - Jardim Norte',
    horario: 'Sextas, das 9h as 16h',
    atendimento: 'Recebe roupas de adulto e infantil em boas condicoes.',
  },
  {
    id: '6',
    nome: 'Ponto Parque das Aguas',
    endereco: 'Avenida Beira Parque, 215 - Parque das Aguas',
    horario: 'Sabados, das 8h as 12h',
    atendimento: 'Entrega cestas basicas e recebe leite longa vida.',
  },
];

function formatarData(data) {
  return new Date(data).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function PontoItem({ ponto, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.nomePonto}>{ponto.nome}</Text>
      <Text style={styles.info}>Endereco: {ponto.endereco}</Text>
      <Text style={styles.info}>Horario: {ponto.horario}</Text>
      <Text style={styles.info}>Atendimento: {ponto.atendimento}</Text>
      <Text style={styles.acao}>Ver detalhes</Text>
    </TouchableOpacity>
  );
}

function DetalhePonto({ ponto }) {
  return (
    <View style={styles.detalhe}>
      <Text style={styles.nomeDetalhe}>{ponto.nome}</Text>
      <Text style={styles.rotulo}>Endereco</Text>
      <Text style={styles.textoDetalhe}>{ponto.endereco}</Text>
      <Text style={styles.rotulo}>Dias e horarios</Text>
      <Text style={styles.textoDetalhe}>{ponto.horario}</Text>
      <Text style={styles.rotulo}>O que recebe ou distribui</Text>
      <Text style={styles.textoDetalhe}>{ponto.atendimento}</Text>
    </View>
  );
}

const DoacaoItem = React.memo(function DoacaoItem({ doacao, onAbrir }) {
  return (
    <TouchableOpacity style={styles.itemDoacao} onPress={() => onAbrir(doacao)} activeOpacity={0.8}>
      <Text style={styles.nomeDoacao}>{doacao.tipoItem}</Text>
      <Text style={styles.info}>Quantidade: {doacao.quantidade}</Text>
      <Text style={styles.info}>Destino: {doacao.pontoDestino}</Text>
      <Text style={styles.dataDoacao}>{formatarData(doacao.criadoEm)}</Text>
    </TouchableOpacity>
  );
});

function ResumoDoacoes({ doacoes, totaisPorTipo }) {
  if (doacoes.length === 0) {
    return (
      <View style={styles.resumo}>
        <Text style={styles.resumoTexto}>Ainda nao ha doacoes registradas.</Text>
      </View>
    );
  }

  return (
    <View style={styles.resumo}>
      <Text style={styles.tituloResumo}>Resumo das doacoes</Text>
      <Text style={styles.resumoTexto}>Total de registros: {doacoes.length}</Text>
      {totaisPorTipo.map((total) => (
        <Text style={styles.resumoTexto} key={total.chave}>
          {total.tipoItem}: {total.quantidade} unidades em {total.doacoes} doacao(oes)
        </Text>
      ))}
    </View>
  );
}

function TelaListaPontos({ navigation }) {
  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      data={pontos}
      keyExtractor={(ponto) => ponto.id}
      renderItem={({ item }) => (
        <PontoItem
          ponto={item}
          onPress={() => navigation.navigate('DetalhePonto', { pontoId: item.id })}
        />
      )}
      ListHeaderComponent={
        <>
          <StatusBar style="auto" />
          <Text style={styles.titulo}>Instituto Mao Amiga</Text>
          <Text style={styles.subtitulo}>
            App simples para consultar pontos de coleta e distribuicao.
          </Text>

          <View style={styles.resumo}>
            <Text style={styles.resumoTexto}>Pontos cadastrados: {pontos.length}</Text>
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

function TelaDetalhePonto({ route }) {
  const { pontoId } = route.params;
  const ponto = pontos.find((item) => item.id === pontoId) ?? pontos[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <StatusBar style="auto" />
      <Text style={styles.secao}>Detalhe do ponto</Text>
      <DetalhePonto ponto={ponto} />
    </ScrollView>
  );
}

function TelaHistoricoDoacoes({ navigation, doacoes }) {
  const [filtro, setFiltro] = useState('');

  const doacoesFiltradas = useMemo(() => {
    const textoFiltro = filtro.trim().toLowerCase();

    return doacoes.filter((doacao) => (
      doacao.tipoItem.toLowerCase().includes(textoFiltro)
    ));
  }, [doacoes, filtro]);

  const totaisPorTipo = useMemo(() => {
    const totais = {};

    doacoes.forEach((doacao) => {
      const chave = doacao.tipoItem.trim().toLowerCase();

      if (!totais[chave]) {
        totais[chave] = {
          chave,
          tipoItem: doacao.tipoItem,
          quantidade: 0,
          doacoes: 0,
        };
      }

      totais[chave].quantidade += Number(doacao.quantidade);
      totais[chave].doacoes += 1;
    });

    return Object.values(totais).sort((primeiro, segundo) => (
      segundo.quantidade - primeiro.quantidade
    ));
  }, [doacoes]);

  const abrirDoacao = useCallback((doacao) => {
    navigation.navigate('DetalheDoacao', { doacao });
  }, [navigation]);

  const renderizarDoacao = useCallback(({ item }) => (
    <DoacaoItem doacao={item} onAbrir={abrirDoacao} />
  ), [abrirDoacao]);

  function renderizarEstadoVazio() {
    if (doacoes.length === 0) {
      return (
        <View style={styles.estadoVazio}>
          <Text style={styles.textoVazio}>Nenhuma doacao registrada ainda.</Text>
          <TouchableOpacity
            style={styles.botaoPrincipal}
            onPress={() => navigation.navigate('CadastroDoacao')}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotaoPrincipal}>Registrar primeira doacao</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.estadoVazio}>
        <Text style={styles.textoVazio}>Nenhuma doacao encontrada para "{filtro}".</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.areaSegura} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.areaSegura}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          style={styles.historico}
          contentContainerStyle={[
            styles.conteudoHistorico,
            doacoesFiltradas.length === 0 && styles.conteudoHistoricoVazio,
          ]}
          data={doacoesFiltradas}
          keyExtractor={(doacao) => doacao.id}
          renderItem={renderizarDoacao}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <>
              <Text style={styles.tituloHistorico}>Minhas doacoes</Text>
              <ResumoDoacoes doacoes={doacoes} totaisPorTipo={totaisPorTipo} />
              <TextInput
                style={styles.inputBusca}
                placeholder="Filtrar por tipo de item"
                value={filtro}
                onChangeText={setFiltro}
                returnKeyType="done"
              />
            </>
          }
          ListEmptyComponent={renderizarEstadoVazio}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function TelaDetalheDoacao({ navigation, route, doacoes, onExcluirDoacao }) {
  const doacaoRecebida = route.params.doacao;
  const doacao = doacoes.find((item) => item.id === doacaoRecebida.id) ?? doacaoRecebida;

  function confirmarExclusao() {
    Alert.alert(
      'Excluir doacao',
      'Deseja realmente excluir esta doacao?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await onExcluirDoacao(doacao.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Erro', 'Nao foi possivel excluir a doacao.');
            }
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.areaSegura} edges={['bottom', 'left', 'right']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
        <Text style={styles.secao}>Detalhe da doacao</Text>
        <View style={styles.detalhe}>
          <Text style={styles.rotulo}>Tipo do item</Text>
          <Text style={styles.textoDetalhe}>{doacao.tipoItem}</Text>
          <Text style={styles.rotulo}>Quantidade</Text>
          <Text style={styles.textoDetalhe}>{doacao.quantidade}</Text>
          <Text style={styles.rotulo}>Ponto de destino</Text>
          <Text style={styles.textoDetalhe}>{doacao.pontoDestino}</Text>
          <Text style={styles.rotulo}>Registrada em</Text>
          <Text style={styles.textoDetalhe}>{formatarData(doacao.criadoEm)}</Text>
        </View>

        <TouchableOpacity
          style={styles.botaoSecundario}
          onPress={() => navigation.navigate('CadastroDoacao', { doacao })}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotaoSecundario}>Editar doacao</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoPerigo} onPress={confirmarExclusao} activeOpacity={0.8}>
          <Text style={styles.textoBotaoPrincipal}>Excluir doacao</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function TelaCadastroDoacao({ navigation, route, onSalvarDoacao, onAtualizarDoacao }) {
  const doacaoEmEdicao = route.params?.doacao;
  const [tipoItem, setTipoItem] = useState(doacaoEmEdicao?.tipoItem ?? '');
  const [quantidade, setQuantidade] = useState(
    doacaoEmEdicao ? String(doacaoEmEdicao.quantidade) : '',
  );
  const [pontoDestino, setPontoDestino] = useState(doacaoEmEdicao?.pontoDestino ?? '');
  const [erro, setErro] = useState('');

  useEffect(() => {
    setTipoItem(doacaoEmEdicao?.tipoItem ?? '');
    setQuantidade(doacaoEmEdicao ? String(doacaoEmEdicao.quantidade) : '');
    setPontoDestino(doacaoEmEdicao?.pontoDestino ?? '');
    setErro('');
  }, [doacaoEmEdicao]);

  function atualizarTipoItem(texto) {
    setTipoItem(texto);
    setErro('');
  }

  function atualizarQuantidade(texto) {
    if (texto === '' || /^\d+$/.test(texto)) {
      setQuantidade(texto);
      setErro('');
    } else {
      setErro('A quantidade deve conter somente numeros.');
    }
  }

  function atualizarPontoDestino(texto) {
    setPontoDestino(texto);
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
      setErro('Informe o ponto de destino da doacao.');
      return;
    }

    const dadosDaDoacao = {
      tipoItem: tipoItem.trim(),
      quantidade: quantidade.trim(),
      pontoDestino: pontoDestino.trim(),
    };

    try {
      if (doacaoEmEdicao) {
        await onAtualizarDoacao({ ...doacaoEmEdicao, ...dadosDaDoacao });
        navigation.goBack();
      } else {
        await onSalvarDoacao(dadosDaDoacao);
        navigation.replace('HistoricoDoacoes');
      }

      Keyboard.dismiss();
    } catch (error) {
      setErro('Nao foi possivel salvar a doacao. Tente novamente.');
    }
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
            {doacaoEmEdicao ? 'Editar doacao' : 'Cadastro de doacao'}
          </Text>
          <Text style={styles.descricaoFormulario}>
            {doacaoEmEdicao
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
              returnKeyType="next"
            />

            <Text style={styles.rotuloCampo}>Ponto de destino</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: Sede Central"
              value={pontoDestino}
              onChangeText={atualizarPontoDestino}
              returnKeyType="done"
              onSubmitEditing={salvarCadastro}
            />

            {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

            <TouchableOpacity style={styles.botaoPrincipal} onPress={salvarCadastro} activeOpacity={0.8}>
              <Text style={styles.textoBotaoPrincipal}>
                {doacaoEmEdicao ? 'Salvar alteracoes' : 'Salvar doacao'}
              </Text>
            </TouchableOpacity>

            {doacaoEmEdicao && (
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

export default function App() {
  const [doacoes, setDoacoes] = useState([]);

  const carregarDoacoes = useCallback(async () => {
    const lista = await listarDoacoes();
    setDoacoes(lista);
  }, []);

  useEffect(() => {
    carregarDoacoes().catch(() => setDoacoes([]));
  }, [carregarDoacoes]);

  async function registrarDoacao(dadosDaDoacao) {
    const novaDoacao = await salvarDoacao(dadosDaDoacao);
    await carregarDoacoes();
    return novaDoacao;
  }

  async function editarDoacao(doacao) {
    const doacaoAtualizada = await atualizarDoacao(doacao);
    await carregarDoacoes();
    return doacaoAtualizada;
  }

  async function removerDoacao(id) {
    await excluirDoacao(id);
    await carregarDoacoes();
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ListaPontos">
        <Stack.Screen
          name="ListaPontos"
          component={TelaListaPontos}
          options={{ title: 'Pontos do Instituto' }}
        />
        <Stack.Screen
          name="DetalhePonto"
          component={TelaDetalhePonto}
          options={{ title: 'Detalhe do ponto' }}
        />
        <Stack.Screen
          name="HistoricoDoacoes"
          options={{ title: 'Minhas doacoes' }}
        >
          {(props) => <TelaHistoricoDoacoes {...props} doacoes={doacoes} />}
        </Stack.Screen>
        <Stack.Screen
          name="DetalheDoacao"
          options={{ title: 'Detalhe da doacao' }}
        >
          {(props) => (
            <TelaDetalheDoacao
              {...props}
              doacoes={doacoes}
              onExcluirDoacao={removerDoacao}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="CadastroDoacao"
          options={({ route }) => ({
            title: route.params?.doacao ? 'Editar doacao' : 'Cadastro de doacao',
          })}
        >
          {(props) => (
            <TelaCadastroDoacao
              {...props}
              onSalvarDoacao={registrarDoacao}
              onAtualizarDoacao={editarDoacao}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  areaSegura: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    padding: 16,
  },
  conteudo: {
    paddingBottom: 24,
  },
  titulo: {
    color: '#1B5E20',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 32,
  },
  subtitulo: {
    color: '#444',
    fontSize: 15,
    marginBottom: 16,
  },
  resumo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    marginBottom: 18,
    padding: 12,
  },
  tituloResumo: {
    color: '#1B5E20',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  resumoTexto: {
    fontSize: 14,
    marginBottom: 4,
  },
  botaoPrincipal: {
    alignItems: 'center',
    backgroundColor: '#1B5E20',
    borderRadius: 6,
    justifyContent: 'center',
    marginBottom: 12,
    minHeight: 44,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  textoBotaoPrincipal: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  botaoSecundario: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#1B5E20',
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    marginBottom: 12,
    minHeight: 44,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  textoBotaoSecundario: {
    color: '#1B5E20',
    fontSize: 15,
    fontWeight: 'bold',
  },
  botaoPerigo: {
    alignItems: 'center',
    backgroundColor: '#C62828',
    borderRadius: 6,
    justifyContent: 'center',
    marginBottom: 12,
    minHeight: 44,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  secao: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DDD',
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 12,
    minHeight: 44,
    padding: 12,
  },
  acao: {
    color: '#1B5E20',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  nomePonto: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  info: {
    color: '#333',
    fontSize: 14,
    marginBottom: 4,
  },
  detalhe: {
    backgroundColor: '#FFFFFF',
    borderColor: '#C8E6C9',
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 18,
    padding: 16,
  },
  nomeDetalhe: {
    color: '#1B5E20',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  rotulo: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  textoDetalhe: {
    color: '#333',
    fontSize: 15,
    marginTop: 4,
  },
  tituloFormulario: {
    color: '#1B5E20',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 18,
  },
  descricaoFormulario: {
    color: '#444',
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 18,
  },
  formulario: {
    backgroundColor: '#FFFFFF',
    borderColor: '#C8E6C9',
    borderRadius: 6,
    borderWidth: 1,
    padding: 16,
  },
  rotuloCampo: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#BDBDBD',
    borderRadius: 5,
    borderWidth: 1,
    fontSize: 15,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  erro: {
    color: '#C62828',
    fontSize: 14,
    marginTop: 14,
  },
  historico: {
    backgroundColor: '#F4F4F4',
    flex: 1,
  },
  conteudoHistorico: {
    padding: 16,
    paddingBottom: 24,
  },
  conteudoHistoricoVazio: {
    flexGrow: 1,
  },
  tituloHistorico: {
    color: '#1B5E20',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 18,
  },
  inputBusca: {
    backgroundColor: '#FFFFFF',
    borderColor: '#BDBDBD',
    borderRadius: 5,
    borderWidth: 1,
    fontSize: 15,
    marginBottom: 14,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  itemDoacao: {
    backgroundColor: '#FFFFFF',
    borderColor: '#C8E6C9',
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 10,
    minHeight: 44,
    padding: 12,
  },
  nomeDoacao: {
    color: '#1B5E20',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  dataDoacao: {
    color: '#666',
    fontSize: 13,
    marginTop: 4,
  },
  estadoVazio: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
  },
  textoVazio: {
    color: '#555',
    fontSize: 15,
    marginBottom: 14,
    textAlign: 'center',
  },
});
