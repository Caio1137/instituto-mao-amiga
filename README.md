# Instituto Mão Amiga

Aplicativo mobile do Instituto Mão Amiga consumindo uma API Spring Boot própria. Pontos de coleta e doações ficam no servidor (CRUD completo por HTTP); os pontos favoritos ficam no aparelho.

## Funcionalidades

- **Pontos:** lista com busca por nome ou bairro e rolagem infinita, detalhe, cadastro, edição e exclusão, tudo pela API.
- **Favoritos:** ♡/♥ em cada ponto da lista e tela **Meus pontos** com os favoritos buscados na API pelo id.
- **Doações:** histórico com filtro por tipo de item e rolagem infinita, cadastro com o ponto de destino escolhido entre os pontos da API, detalhe, edição e exclusão.
- Mensagens próprias para carregando, lista vazia, API desligada, dados recusados (400) e registro não encontrado (404).

## Onde está a API

A API fica neste mesmo repositório, na pasta [`api/`](api/). É um projeto Spring Boot separado do app. Endpoints, regras e prints do Swagger estão em [`api/README.md`](api/README.md).

## Como executar

Pré-requisitos: **Java 21** (o projeto também compila com Java 17) e **Node.js 20 ou superior**. O Maven não precisa estar instalado: a API usa o Maven Wrapper (`mvnw`).

### 1. API

```bash
cd api
./mvnw spring-boot:run
```

No Windows (PowerShell ou cmd): `mvnw.cmd spring-boot:run`. A API sobe em `http://localhost:8085`.

- Swagger: http://localhost:8085/swagger-ui.html
- Testes da API: `./mvnw test`
- O banco H2 é gravado em `api/data/`. Para voltar aos dados iniciais (29 pontos e 12 doações), pare a API e apague essa pasta.

### 2. App

Em outro terminal, na raiz do repositório:

```bash
npm install
npm run web
```

Os testes da entrega foram feitos **no navegador** (`npm run web`), com a API em `http://localhost:8085`.

### Onde trocar o IP (celular com Expo Go)

A URL do servidor fica num lugar só: a constante `API_URL` em [`src/services/api.ts`](src/services/api.ts).

```ts
export const API_URL = 'http://localhost:8085/api/v1';
```

No celular, `localhost` é o próprio celular. Troque pelo IP do computador na rede (no Windows, `ipconfig`, campo "Endereço IPv4"), por exemplo `http://192.168.0.10:8085/api/v1`, e rode `npx expo start`. O celular precisa estar na mesma rede Wi-Fi e o firewall precisa liberar a porta 8085.

Para conferir os tipos do app: `npx tsc --noEmit`.

## Organização do código

```
App.tsx                      só monta a navegação
src/
  services/
    api.ts                   único arquivo com fetch: API_URL, get/post/put/del e ApiError(status)
    pontosService.ts         listar, buscar página com filtro, buscar por id, cadastrar, editar, excluir
    doacoesService.ts        listar página com filtro, buscar por id, cadastrar, editar, excluir
    favoritosStorage.ts      ids dos pontos favoritos no AsyncStorage
    storage.ts               lerJSON<T> e salvarJSON<T> sobre o AsyncStorage
  hooks/
    usePaginacao.ts          rolagem infinita sobre um endpoint paginado (pontos e doações)
    useFavoritos.ts          favoritos lidos do aparelho a cada foco da tela
  screens/                   uma tela por arquivo; nenhuma monta URL nem chama fetch
  components/                item de ponto, item de doação e detalhe do ponto
  types/                     Ponto, Doacao, Page<T> e as rotas (RootStackParamList)
  utils/                     confirmação de exclusão e formatação de data
api/                         API Spring Boot (pontos e doações)
docs/swagger/                prints do Swagger usados no README da API
```

## Decisões técnicas

**Por que favoritos ficam no aparelho e pontos e doações no servidor?** Pontos e doações são dados do Instituto: todos que usam o app precisam ver a mesma lista, e um ponto cadastrado ou uma doação registrada precisa continuar existindo se a pessoa trocar de celular. Por isso ficam na API, num banco só. Favorito é uma preferência pessoal de quem usa aquele aparelho: não interessa a mais ninguém e não precisa de login. Por isso fica no AsyncStorage, e guardamos **só o id**. Os dados do ponto (nome, horário, endereço) são buscados na API pelo id na tela **Meus pontos**, então um ponto editado aparece sempre atualizado e um ponto excluído (404) simplesmente sai da lista, sem quebrar a tela.

**Uma camada só para a rede.** Só `api.ts` chama `fetch`. Se a resposta não for 2xx ele lança `ApiError` com o status (0 quando nem conseguiu conectar), e as telas decidem o que mostrar: 404 vira "não encontrado", 400 mostra a mensagem que a API mandou e status 0 vira "API desligada". Trocar o endereço do servidor é mudar uma linha.

**Rolagem infinita sem pedir página repetida.** O `onEndReached` da FlatList pode disparar várias vezes antes do próximo render. O hook `usePaginacao` usa uma trava em `useRef` e um conjunto de páginas já pedidas, para quando chega na última página e volta para a página 0 a cada busca nova.

**Data da doação no servidor.** `criadoEm` é preenchido pela API no cadastro e não muda na edição. O app nunca manda a data, então o relógio errado de um celular não bagunça a ordem do histórico.

## Roteiro de demonstração

O roteiro de até 3 minutos está em [docs/roteiro-demonstracao.md](docs/roteiro-demonstracao.md).
