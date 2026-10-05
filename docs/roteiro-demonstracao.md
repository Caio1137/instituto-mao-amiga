# Roteiro de demonstração

Tempo previsto: até 3 minutos.

1. Abrir o aplicativo e acessar **Minhas doações**. Mostrar o estado inicial e o caminho para cadastrar uma doação.
2. Registrar uma doação de teste, por exemplo: arroz, 5 unidades, Sede Central. Em seguida, mostrar o registro no histórico.
3. Registrar mais duas doações de tipos diferentes e apresentar o resumo com a quantidade total por tipo de item.
4. Digitar `arroz` no campo de busca e mostrar que a lista é filtrada sem remover os dados armazenados.
5. Abrir uma doação, editar a quantidade e voltar para conferir a atualização no detalhe e no histórico.
6. Abrir outra doação e iniciar a exclusão. Primeiro cancelar e depois confirmar a exclusão para mostrar as duas possibilidades.
7. Fechar o aplicativo, abrir novamente e conferir que as doações restantes continuam no histórico.

## Decisões técnicas

Os totais do resumo são calculados a partir do array de doações sempre que o histórico é atualizado. Dessa forma, ao cadastrar, editar ou excluir uma doação, o resumo permanece coerente com os registros armazenados.

O acesso ao AsyncStorage está concentrado em `doacoesStorage.js`. As telas usam funções para listar, salvar, atualizar e excluir registros, sem precisar conhecer a chave utilizada no armazenamento.
