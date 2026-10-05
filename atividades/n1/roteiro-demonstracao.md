# Roteiro de demonstracao - N1

Tempo previsto: ate 3 minutos.

1. Abrir o app e tocar em **Minhas doacoes**. Mostrar o estado vazio e o botao para cadastrar a primeira doacao.
2. Registrar uma doacao de teste, por exemplo: arroz, 5 unidades, Sede Central. Depois do salvamento, mostrar que ela aparece no historico.
3. Registrar mais duas doacoes de tipos diferentes. No topo do historico, mostrar o total de registros e a soma por tipo de item.
4. Digitar um tipo no campo de filtro, por exemplo `arroz`, e mostrar que a lista e filtrada sem apagar os dados salvos.
5. Tocar em uma doacao, abrir o detalhe e editar a quantidade. Voltar para confirmar o valor atualizado no detalhe e no historico.
6. Abrir outra doacao, tocar em excluir e primeiro cancelar. Depois confirmar a exclusao e mostrar que o item some da lista.
7. Fechar o app por completo, abrir novamente e conferir que as doacoes restantes continuam no historico.

## Decisao tecnica

Os totais do resumo nao sao salvos separadamente. Eles sao calculados a partir do array de doacoes sempre que a tela de historico renderiza. Assim, ao cadastrar, editar ou excluir uma doacao, nao existe o risco de o total ficar diferente dos dados que estao no armazenamento.

O acesso ao AsyncStorage ficou concentrado no arquivo `doacoesStorage.js`. As telas chamam funcoes como listar, salvar, atualizar e excluir, sem conhecer a chave usada para guardar os dados.
