import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

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
];

function PontoItem({ ponto }) {
  return (
    <View style={styles.card}>
      <Text style={styles.nomePonto}>{ponto.nome}</Text>
      <Text style={styles.info}>Endereco: {ponto.endereco}</Text>
      <Text style={styles.info}>Horario: {ponto.horario}</Text>
      <Text style={styles.info}>Atendimento: {ponto.atendimento}</Text>
    </View>
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

function TelaListaPontos() {
  return (
    <View>
      <Text style={styles.secao}>Pontos de coleta e distribuicao</Text>

      {pontos.map((ponto) => (
        <PontoItem key={ponto.id} ponto={ponto} />
      ))}
    </View>
  );
}

function TelaDetalhePonto() {
  return (
    <View>
      <Text style={styles.secao}>Detalhe do ponto em destaque</Text>
      <DetalhePonto ponto={pontos[0]} />
    </View>
  );
}

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.titulo}>Instituto Mao Amiga</Text>
      <Text style={styles.subtitulo}>
        App simples para consultar pontos de coleta e distribuicao.
      </Text>

      <View style={styles.resumo}>
        <Text style={styles.resumoTexto}>Pontos cadastrados: {pontos.length}</Text>
        <Text style={styles.resumoTexto}>Tela feita com componente e prop</Text>
      </View>

      <TelaListaPontos />
      <TelaDetalhePonto />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    padding: 16,
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
});
