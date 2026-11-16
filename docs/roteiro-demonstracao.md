# Roteiro de demonstração (até 3 minutos)

## Antes de começar

1. Terminal 1: `cd api` e `mvnw.cmd spring-boot:run` (ou `./mvnw spring-boot:run`). Esperar aparecer `Started InstitutoMaoAmigaApiApplication`.
2. Terminal 2, na raiz: `npm run web`. Abrir http://localhost:8081.
3. Deixar uma aba com o Swagger aberta: http://localhost:8085/swagger-ui.html.

## Roteiro

| Tempo | O que fazer | O que mostrar |
| --- | --- | --- |
| 0:00 | Abrir o app e rolar a lista de pontos até o fim. | Os pontos vêm da API, 10 por página. O rodapé passa de "10 de 29" para "29 de 29 · fim da lista". |
| 0:15 | Digitar `setor oeste` na busca. Depois trocar para `vaca`. | A lista volta para a primeira página a cada busca: 2 pontos do bairro Setor Oeste e depois o Ponto Vaca Brava (filtro feito pela API, no nome ou no bairro). |
| 0:25 | Limpar a busca, tocar em **Cadastrar ponto**, tentar salvar vazio e depois preencher: `Ponto Demo`, `Rua 10, 100`, `Setor Sul`, `Seg a Sex, 8h às 17h`, tipo **Coleta**. Salvar. | Validação no app ("Preencha: ...") e depois "Ponto cadastrado com sucesso." O ponto aparece na lista (buscar `demo`). |
| 0:50 | Abrir o **Ponto Demo**, tocar em **Editar ponto**, trocar o horário para `Sáb, 9h às 12h` e o tipo para **Distribuição**. Salvar alterações. | Mesmo formulário, já preenchido, com "Salvar alterações". O detalhe mostra os valores novos (PUT). |
| 1:05 | Voltar para a lista e tocar no ♡ do **Ponto Demo** e de outro ponto. Abrir **Meus pontos**. | Os dois favoritos aparecem, buscados na API pelo id. |
| 1:15 | Em **Meus pontos**, tocar no ♥ de um deles. | Ele sai da tela na hora. Recarregar a página (F5) e abrir **Meus pontos** de novo: o que ficou continua lá (AsyncStorage). |
| 1:30 | Abrir o **Ponto Demo**, tocar em **Excluir ponto**, primeiro **Cancelar** e depois **Excluir**. Abrir **Meus pontos**. | Confirmação antes do DELETE. O ponto some da lista e sai de **Meus pontos** sem quebrar a tela (404 tratado). |
| 1:50 | Tocar em **Minhas doações** e depois em **Registrar doação**: `Arroz 5 kg`, quantidade `3`, destino **Sede Central**. Salvar. | O destino é escolhido entre os pontos da API. A doação nova aparece no topo do histórico. |
| 2:10 | Abrir a doação, **Editar doação**, mudar a quantidade para `5`. Salvar alterações. Depois **Excluir doação** e confirmar. | O detalhe mostra a quantidade nova com a mesma data de cadastro (PUT). Depois da exclusão o app volta ao histórico e a doação some. |
| 2:30 | No Swagger, `POST /api/v1/doacoes` com `"quantidade": 0` e `GET /api/v1/pontos/{id}` com um id inexistente (`00000000-0000-0000-0000-000000000000`). | **400** com a mensagem "A quantidade deve ser maior que zero." e **404** com "Ponto não encontrado". |
| 2:45 | (Se der tempo) parar a API e atualizar a lista no app. | Mensagem de erro compreensível com "Tentar novamente", sem travar nem ficar em branco. |

## Decisão técnica para explicar

**Por que favoritos ficam no aparelho e pontos e doações no servidor?** Pontos e doações são do Instituto e precisam ser os mesmos para todo mundo, em qualquer celular, então ficam na API. Favorito é uma escolha pessoal de quem usa aquele aparelho, não precisa de login nem interessa a outras pessoas, então fica no AsyncStorage. Guardamos só o id e buscamos os dados na API: se o ponto for editado o favorito mostra a versão nova, e se for excluído a API responde 404 e ele sai da lista sem quebrar a tela.
