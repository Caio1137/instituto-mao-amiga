import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

const produtos = [
  {
    id: '1',
    nome: 'Arroz tipo 1',
    categoria: 'Alimento basico',
    estoque: '24 kg',
    local: 'Sede do Instituto',
  },
  {
    id: '2',
    nome: 'Feijao carioca',
    categoria: 'Alimento basico',
    estoque: '18 kg',
    local: 'Ponto Vila Nova',
  },
  {
    id: '3',
    nome: 'Leite integral',
    categoria: 'Laticinio',
    estoque: '32 unidades',
    local: 'Ponto Centro',
  },
  {
    id: '4',
    nome: 'Cesta emergencial',
    categoria: 'Kit de doacao',
    estoque: '7 kits',
    local: 'Ponto Jardim Sul',
  },
];

function ProdutoItem({ produto, categoria }) {
  const [favorito, setFavorito] = useState(false);
  const [quantidade, setQuantidade] = useState(0);

  function aumentarQuantidade() {
    setQuantidade(quantidade + 1);
  }

  function diminuirQuantidade() {
    if (quantidade > 0) {
      setQuantidade(quantidade - 1);
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.nomeProduto}>{produto.nome}</Text>
      <Text>Categoria: {categoria}</Text>
      <Text>Estoque: {produto.estoque}</Text>
      <Text>Local: {produto.local}</Text>

      <Text style={styles.quantidade}>Quantidade separada: {quantidade}</Text>

      <View style={styles.botoes}>
        <Button title="-" onPress={diminuirQuantidade} />
        <Button title="+" onPress={aumentarQuantidade} />
        <Button
          title={favorito ? 'Salvo' : 'Salvar'}
          onPress={() => setFavorito(!favorito)}
        />
      </View>
    </View>
  );
}

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <StatusBar style="auto" />

      <Text style={styles.titulo}>Instituto Mao Amiga</Text>
      <Text style={styles.subtitulo}>
        App simples para acompanhar doacoes e estoque dos pontos de distribuicao.
      </Text>

      <View style={styles.resumo}>
        <Text style={styles.resumoTexto}>Itens cadastrados: {produtos.length}</Text>
        <Text style={styles.resumoTexto}>Tela feita com componente, prop e estado</Text>
      </View>

      <Text style={styles.secao}>Lista de itens</Text>

      {produtos.map((produto) => (
        <ProdutoItem
          key={produto.id}
          produto={produto}
          categoria={produto.categoria}
        />
      ))}
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
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  nomeProduto: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  quantidade: {
    marginTop: 10,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
