# Exercicio Pratico - Aula 05

**Nome:** Caio Marques    **Data:** 17/08/2026

Crie um pequeno fluxo com 2 telas navegaveis (Stack Navigator), passando pelo
menos 1 parametro de uma tela para a outra.

**1. Descreva as 2 telas e o que cada uma faz:**

A primeira tela e a `TelaListaPontos`. Ela mostra os pontos de coleta e
distribuicao do Instituto Mao Amiga e permite tocar em um ponto da lista.

A segunda tela e a `TelaDetalhePonto`. Ela mostra o nome, endereco, dias e
horarios, e o que o ponto recebe ou distribui.

**2. Qual parametro e passado da Tela 1 para a Tela 2:**

O parametro passado e `pontoId`, com o `id` do ponto escolhido na lista.

**3. O que muda na Tela 2 por causa do parametro recebido:**

A `TelaDetalhePonto` usa o `pontoId` recebido para procurar o ponto correto no
array `pontos`. Assim, o detalhe muda de acordo com o item tocado na lista.

**4. Cole aqui o codigo de navegacao (o `navigate` e a leitura do `route.params`):**

```jsx
onPress={() => navigation.navigate('DetalhePonto', { pontoId: ponto.id })}
```

```jsx
function TelaDetalhePonto({ route }) {
  const { pontoId } = route.params;
  const ponto = pontos.find((item) => item.id === pontoId) ?? pontos[0];

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.secao}>Detalhe do ponto</Text>
      <DetalhePonto ponto={ponto} />
    </ScrollView>
  );
}
```
