# Exercício da Aula 11: Formulários e Validação Básica

**Nome:** Caio Marques    **Data:** 01/09/2026

## Registro da atividade

- **Campo acrescentado:** Categoria.
- **O que esse campo representa:** O setor em que o produto fica organizado na loja, como móveis, iluminação ou informática.
- **Regra de validação aplicada:** A categoria é obrigatória e precisa ter pelo menos 3 caracteres.
- **Por que essa regra faz sentido para esse campo:** Uma categoria muito curta não ajuda a identificar o setor do produto e pode deixar o cadastro confuso.

**Código da extensão** (trecho do `TextInput` novo e validação acrescentada):

```jsx
const [categoria, setCategoria] = useState('');

function validarESalvar() {
  if (nome.trim() === '') {
    setErro('O nome não pode ficar vazio.');
    return;
  }

  const precoNumerico = Number(preco.trim().replace(',', '.'));
  if (preco.trim() === '' || isNaN(precoNumerico) || precoNumerico <= 0) {
    setErro('O preço precisa ser um número maior que zero.');
    return;
  }

  if (categoria.trim().length < 3) {
    setErro('Informe uma categoria com pelo menos 3 caracteres.');
    return;
  }

  onAdicionarProduto({
    id: Date.now(),
    nome,
    preco: `R$ ${precoNumerico.toFixed(2).replace('.', ',')}`,
    categoria,
  });
}

<TextInput
  placeholder="Categoria do produto"
  value={categoria}
  onChangeText={setCategoria}
/>
```
