# Exercício Prático — Aula 03

**Nome:** Caio Marques    **Data:** 10/08/2026

Partindo da tela de lista de produtos da Loja Compre Bem construída em sala, acrescente por conta própria uma prop nova e um estado novo ao componente `ProdutoItem`.

**1. Qual prop nova você acrescentou ao `ProdutoItem`, e o que ela representa:**

Acrescentei a prop `categoria`. Ela representa o tipo do produto/item exibido na lista,
por exemplo "Alimento básico", "Laticínio" ou "Kit de doação".

**2. Qual estado novo você acrescentou, e o que muda quando ele é atualizado:**

Acrescentei o estado `quantidadeSelecionada`. Ele guarda quantas unidades daquele item
foram separadas pelo usuário. Quando o estado muda, o número exibido no card do item é atualizado.

**3. Por que você decidiu que cada dado era prop (vem de fora, só leitura) ou estado (o componente controla e muda com o tempo):**

A `categoria` é prop porque vem do cadastro/lista de produtos e o componente apenas exibe essa informação.
Já a `quantidadeSelecionada` é estado porque muda conforme o usuário pressiona os botões de aumentar ou diminuir,
e cada `ProdutoItem` precisa controlar sua própria quantidade separadamente.

**4. Cole aqui o código da sua extensão do `ProdutoItem`:**

```jsx
import { useState } from 'react';
import { View, Text, Button } from 'react-native';

function ProdutoItem({ produto, categoria }) {
  const [favorito, setFavorito] = useState(false);
  const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(0);

  return (
    <View style={styles.item}>
      <View style={styles.info}>
        <Text style={styles.nome}>{produto.nome}</Text>
        <Text style={styles.categoria}>{categoria}</Text>
        <Text style={styles.preco}>{produto.preco}</Text>

        <Text>Quantidade separada: {quantidadeSelecionada}</Text>

        <Button
          title="-"
          onPress={() => setQuantidadeSelecionada(Math.max(0, quantidadeSelecionada - 1))}
        />
        <Button
          title="+"
          onPress={() => setQuantidadeSelecionada(quantidadeSelecionada + 1)}
        />
      </View>

      <Button
        title={favorito ? '♥' : '♡'}
        onPress={() => setFavorito(!favorito)}
      />
    </View>
  );
}

// Uso do componente:
// <ProdutoItem produto={produto} categoria={produto.categoria} />
```
