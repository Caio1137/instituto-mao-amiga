# Exercício Prático — Aula 03

**Nome:** Caio Marques    **Data:** 10/08/2026

Partindo da tela de lista de produtos da Loja Compre Bem construída em sala, acrescente por conta própria uma prop nova e um estado novo ao componente `ProdutoItem`.

**1. Qual prop nova você acrescentou ao `ProdutoItem`, e o que ela representa:**

Acrescentei a prop `categoria`. Ela mostra o tipo do item que aparece na lista,
por exemplo "Alimento básico", "Laticínio" ou "Kit de doação".

**2. Qual estado novo você acrescentou, e o que muda quando ele é atualizado:**

Acrescentei o estado `quantidade`. Ele guarda quantas unidades daquele item foram separadas.
Quando aperto os botões de + ou -, o número na tela muda.

**3. Por que você decidiu que cada dado era prop (vem de fora, só leitura) ou estado (o componente controla e muda com o tempo):**

A `categoria` é prop porque já vem no objeto do produto e o componente só precisa mostrar.
A `quantidade` é estado porque muda enquanto o usuário usa a tela, e cada item precisa
ter sua própria contagem.

**4. Cole aqui o código da sua extensão do `ProdutoItem`:**

```jsx
import { useState } from 'react';
import { View, Text, Button } from 'react-native';

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

      <Text>Quantidade separada: {quantidade}</Text>

      <Button title="-" onPress={diminuirQuantidade} />
      <Button title="+" onPress={aumentarQuantidade} />

      <Button
        title={favorito ? 'Salvo' : 'Salvar'}
        onPress={() => setFavorito(!favorito)}
      />
    </View>
  );
}

// Uso do componente:
// <ProdutoItem produto={produto} categoria={produto.categoria} />
```
