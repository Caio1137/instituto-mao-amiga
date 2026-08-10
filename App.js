import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const produtosMock = [
  {
    id: '1',
    nome: 'Arroz tipo 1',
    estoque: '24 kg disponiveis',
    categoria: 'Alimento basico',
    ponto: 'Ponto Centro',
  },
  {
    id: '2',
    nome: 'Feijao carioca',
    estoque: '18 kg disponiveis',
    categoria: 'Alimento basico',
    ponto: 'Ponto Vila Nova',
  },
  {
    id: '3',
    nome: 'Leite integral',
    estoque: '32 unidades',
    categoria: 'Laticinio',
    ponto: 'Ponto Jardim Sul',
  },
  {
    id: '4',
    nome: 'Cesta emergencial',
    estoque: '7 kits prontos',
    categoria: 'Kit de doacao',
    ponto: 'Sede do Instituto',
  },
];

function ProdutoItem({ produto, categoria }) {
  const [favorito, setFavorito] = useState(false);
  const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(0);

  return (
    <View style={styles.item}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{produto.nome.slice(0, 1)}</Text>
      </View>

      <View style={styles.info}>
        <View style={styles.itemHeader}>
          <View>
            <Text style={styles.nome}>{produto.nome}</Text>
            <Text style={styles.ponto}>{produto.ponto}</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Alternar favorito"
            style={[styles.favoriteButton, favorito && styles.favoriteButtonActive]}
            onPress={() => setFavorito(!favorito)}
          >
            <Text style={[styles.favoriteText, favorito && styles.favoriteTextActive]}>
              {favorito ? 'Salvo' : 'Salvar'}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.categoria}>{categoria}</Text>
        <Text style={styles.estoque}>{produto.estoque}</Text>

        <View style={styles.quantidadeLinha}>
          <Text style={styles.quantidadeTexto}>Quantidade separada</Text>
          <View style={styles.controles}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Diminuir quantidade"
              style={styles.controleBotao}
              onPress={() => setQuantidadeSelecionada(Math.max(0, quantidadeSelecionada - 1))}
            >
              <Text style={styles.controleTexto}>-</Text>
            </Pressable>
            <Text style={styles.quantidadeValor}>{quantidadeSelecionada}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Aumentar quantidade"
              style={styles.controleBotao}
              onPress={() => setQuantidadeSelecionada(quantidadeSelecionada + 1)}
            >
              <Text style={styles.controleTexto}>+</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.appName}>Instituto Mao Amiga</Text>
        <Text style={styles.title}>Controle de doacoes e pontos de coleta</Text>
        <Text style={styles.subtitle}>
          Visao inicial para acompanhar alimentos disponiveis e preparar entregas.
        </Text>
      </View>

      <View style={styles.resumo}>
        <View style={styles.resumoItem}>
          <Text style={styles.resumoValor}>4</Text>
          <Text style={styles.resumoLabel}>pontos ativos</Text>
        </View>
        <View style={styles.resumoItem}>
          <Text style={styles.resumoValor}>81</Text>
          <Text style={styles.resumoLabel}>itens registrados</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Itens para triagem</Text>
      {produtosMock.map((produto) => (
        <ProdutoItem key={produto.id} produto={produto} categoria={produto.categoria} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F2',
  },
  content: {
    padding: 20,
    paddingTop: 56,
  },
  header: {
    marginBottom: 20,
  },
  appName: {
    color: '#2F6F4E',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    color: '#1C2A29',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  subtitle: {
    color: '#52615E',
    fontSize: 16,
    lineHeight: 22,
    marginTop: 10,
  },
  resumo: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  resumoItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE5D9',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  resumoValor: {
    color: '#1F6F4A',
    fontSize: 24,
    fontWeight: '800',
  },
  resumoLabel: {
    color: '#52615E',
    fontSize: 13,
    marginTop: 4,
  },
  sectionTitle: {
    color: '#1C2A29',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  item: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE5D9',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    padding: 14,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#E8F2E6',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  avatarText: {
    color: '#2F6F4E',
    fontSize: 20,
    fontWeight: '800',
  },
  info: {
    flex: 1,
  },
  itemHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  nome: {
    color: '#1C2A29',
    fontSize: 16,
    fontWeight: '800',
  },
  ponto: {
    color: '#52615E',
    fontSize: 13,
    marginTop: 2,
  },
  favoriteButton: {
    borderColor: '#BCCBB7',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  favoriteButtonActive: {
    backgroundColor: '#2F6F4E',
    borderColor: '#2F6F4E',
  },
  favoriteText: {
    color: '#2F6F4E',
    fontSize: 12,
    fontWeight: '700',
  },
  favoriteTextActive: {
    color: '#FFFFFF',
  },
  categoria: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF3D6',
    borderRadius: 6,
    color: '#765015',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  estoque: {
    color: '#31514B',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 10,
  },
  quantidadeLinha: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quantidadeTexto: {
    color: '#52615E',
    fontSize: 13,
  },
  controles: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  controleBotao: {
    alignItems: 'center',
    backgroundColor: '#E8F2E6',
    borderRadius: 8,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  controleTexto: {
    color: '#2F6F4E',
    fontSize: 18,
    fontWeight: '800',
  },
  quantidadeValor: {
    color: '#1C2A29',
    fontSize: 16,
    fontWeight: '800',
    minWidth: 22,
    textAlign: 'center',
  },
});
