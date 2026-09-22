import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  Keyboard,
  KeyboardAvoidingView,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const Stack = createNativeStackNavigator();
const CHAVE_DOACAO = '@instituto_mao_amiga:ultima_doacao';

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
    endereco: 'Rua dos Ipês, 730 - Jardim Norte',
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

function TelaCadastroDoacao() {
  const [tipoItem, setTipoItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pontoDestino, setPontoDestino] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    async function carregarDoacaoSalva() {
      try {
        const cadastroSalvo = await AsyncStorage.getItem(CHAVE_DOACAO);

        if (cadastroSalvo) {
          const doacao = JSON.parse(cadastroSalvo);
          setTipoItem(doacao.tipoItem ?? '');
          setQuantidade(doacao.quantidade ?? '');
          setPontoDestino(doacao.pontoDestino ?? '');
          setMensagem('Dados da ultima doacao recuperados neste aparelho.');
        }
      } catch (error) {
        setErro('Nao foi possivel recuperar a doacao salva.');
      }
    }

    carregarDoacaoSalva();
  }, []);

  function atualizarTipoItem(texto) {
    setTipoItem(texto);
    setErro('');
    setMensagem('');
  }

  function atualizarQuantidade(texto) {
    if (texto === '' || /^\d+$/.test(texto)) {
      setQuantidade(texto);
      setErro('');
    } else {
      setErro('A quantidade deve conter somente numeros.');
    }

    setMensagem('');
  }

  function atualizarPontoDestino(texto) {
    setPontoDestino(texto);
    setErro('');
    setMensagem('');
  }

  async function validarFormulario() {
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

    const doacao = {
      tipoItem: tipoItem.trim(),
      quantidade: quantidade.trim(),
      pontoDestino: pontoDestino.trim(),
    };

    try {
      await AsyncStorage.setItem(CHAVE_DOACAO, JSON.stringify(doacao));
      setErro('');
      setMensagem('Doacao salva neste aparelho.');
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
          <Text style={styles.tituloFormulario}>Cadastro de doacao</Text>
          <Text style={styles.descricaoFormulario}>
            Preencha os dados para registrar a intencao de doacao para um ponto do Instituto.
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
              onSubmitEditing={validarFormulario}
            />

            {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
            {mensagem !== '' && <Text style={styles.mensagem}>{mensagem}</Text>}

            <TouchableOpacity style={styles.botaoPrincipal} onPress={validarFormulario} activeOpacity={0.8}>
              <Text style={styles.textoBotaoPrincipal}>Salvar doacao</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default function App() {
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
          name="CadastroDoacao"
          component={TelaCadastroDoacao}
          options={{ title: 'Cadastro de doacao' }}
        />
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
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 32,
    marginBottom: 8,
    color: '#1B5E20',
  },
  subtitulo: {
    fontSize: 15,
    marginBottom: 16,
    color: '#444',
  },
  resumo: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 6,
    marginBottom: 18,
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
    marginBottom: 18,
    minHeight: 44,
    padding: 13,
  },
  textoBotaoPrincipal: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  secao: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  acao: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#1B5E20',
  },
  nomePonto: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  info: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  detalhe: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 6,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  nomeDetalhe: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1B5E20',
  },
  rotulo: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#2E7D32',
  },
  textoDetalhe: {
    fontSize: 15,
    marginTop: 4,
    color: '#333',
  },
  tituloFormulario: {
    color: '#1B5E20',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 8,
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
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  erro: {
    color: '#C62828',
    fontSize: 14,
    marginTop: 14,
  },
  mensagem: {
    color: '#2E7D32',
    fontSize: 14,
    marginTop: 14,
  },
});
