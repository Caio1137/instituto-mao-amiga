# Instituto Mão Amiga

Aplicativo mobile para apoiar o registro e o acompanhamento de doações destinadas ao Instituto Mão Amiga.

## Funcionalidades

- Consulta dos pontos de coleta e distribuição, buscados na API do Instituto.
- Visualização dos detalhes de cada ponto, buscados por id na API.
- Cadastro de doações com validação dos campos e escolha do ponto de destino entre os pontos da API.
- Histórico de doações salvo no aparelho.
- Busca de doações por tipo de item.
- Visualização, edição e exclusão de registros.
- Resumo das quantidades doadas por tipo de item.

## Tecnologias

- App: React Native, Expo, TypeScript (`strict`), React Navigation e AsyncStorage
- API: Java 21, Spring Boot (Spring Web, Spring Data JPA) e H2

## Onde está a API

A API dos pontos fica neste mesmo repositório, na pasta [`api/`](api/). Ela é um projeto Spring Boot separado do app.

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/pontos` | Lista paginada (`page`, `size`, `sort`). 20 por página por padrão, no máximo 50. Resposta no formato `{ content, page }`. |
| GET | `/pontos/{id}` | Devolve um ponto. Responde 404 quando o id não existe. |

Ao subir, a API carrega 9 pontos em Goiânia com coordenadas reais tiradas do OpenStreetMap. A documentação fica em http://localhost:8085/swagger-ui.html.

## Como executar

É necessário ter o Node.js e o Java 21 (ou superior) instalados.

### 1. API

```bash
cd api
./mvnw spring-boot:run
```

No Windows: `mvnw.cmd spring-boot:run`. A API sobe em `http://localhost:8085`.

### 2. App

```bash
npm install
npm run web
```

Para usar no celular com o Expo Go, troque `localhost` pelo IP do computador na constante `API_URL` de [`src/services/api.ts`](src/services/api.ts) e rode `npx expo start`. O celular precisa estar na mesma rede do computador.

Para conferir os tipos:

```bash
npx tsc --noEmit
```

## Organização do código

```
App.tsx                  monta só a navegação
src/
  types/                 Ponto (espelha o record da API), Doacao, Page<T> e RootStackParamList
  services/
    api.ts               único arquivo que chama fetch, com a URL da API
    pontosService.ts     listar pontos e buscar ponto por id
    storage.ts           lerJSON<T> e salvarJSON<T> sobre o AsyncStorage
    doacoesStorage.ts    histórico de doações salvo no aparelho
  utils/doacoes.ts       filtro, totais por tipo e formatação de data
  components/            itens de lista, detalhe do ponto e resumo
  screens/               uma tela por arquivo, tipadas com NativeStackScreenProps
api/                     API Spring Boot dos pontos
```

## Fluxo de uso

1. Consulte os pontos de coleta e distribuição disponíveis.
2. Registre uma doação informando o tipo do item, a quantidade e o ponto de destino.
3. Acesse **Minhas doações** para consultar o histórico e o resumo.
4. Use a busca para localizar registros por tipo de item.
5. Abra uma doação para editar seus dados ou excluí-la com confirmação.

Os pontos vêm da API. As doações ficam armazenadas localmente no aparelho e permanecem disponíveis ao reabrir o aplicativo. Se a API estiver desligada, a lista de pontos mostra uma mensagem de erro com a opção de tentar novamente.

## Demonstração

O roteiro sugerido para apresentar os principais fluxos do aplicativo está em [docs/roteiro-demonstracao.md](docs/roteiro-demonstracao.md).
