# Como continuar o projeto em outro computador

Guia para abrir o projeto num computador novo (por exemplo, o notebook), deixar a API e o app rodando e saber onde mexer.

## Situação do projeto

As 8 issues da N2 estão feitas e fechadas no GitHub:

| Issue | Tema | Onde está no código |
| --- | --- | --- |
| #20 [N2-1] | CRUD de pontos na API | `api/.../entity/Ponto`, `PontoController`, `PontoService`, `CargaInicialPontos` |
| #21 [N2-2] | Busca de pontos com paginação | `PontoRepository.buscarPorFiltro`, `GET /api/v1/pontos/filtro` |
| #22 [N2-3] | App listando os pontos da API | `src/services/api.ts`, `pontosService.ts`, `ListaPontosScreen`, `usePaginacao` |
| #23 [N2-4] | App: cadastrar, editar e excluir pontos | `CadastroPontoScreen`, `DetalhePontoScreen`, `utils/confirmar.ts` |
| #24 [N2-5] | CRUD de doações na API | `api/.../entity/Doacao`, `DoacaoController`, `DoacaoService` |
| #25 [N2-6] | Histórico e cadastro de doações pela API | `doacoesService.ts`, `HistoricoDoacoesScreen`, `CadastroDoacaoScreen` |
| #26 [N2-7] | Editar e excluir doação pela API | `DetalheDoacaoScreen`, `CadastroDoacaoScreen` (edição) |
| #27 [N2-8] | Favoritos e roteiro de demonstração | `favoritosStorage.ts`, `useFavoritos`, `MeusPontosScreen`, `docs/roteiro-demonstracao.md` |

Apresentação: terça 17/11, na aula. O roteiro de até 3 minutos está em [roteiro-demonstracao.md](roteiro-demonstracao.md).

## 1. Instalar o que falta (só na primeira vez)

| Programa | Versão | Como conferir |
| --- | --- | --- |
| Git | qualquer recente | `git --version` |
| Java (JDK) | **21** (Temurin, em https://adoptium.net) | `java -version` |
| Node.js | **20 ou superior** (LTS, em https://nodejs.org) | `node -v` |

O Maven não precisa ser instalado: a API usa o Maven Wrapper (`mvnw`).

Se o notebook já tiver o Java 17 e não quiser instalar o 21, funciona também: veja o passo 3.

## 2. Baixar o projeto

```bash
git clone https://github.com/Caio1137/instituto-mao-amiga.git
cd instituto-mao-amiga
npm install
```

Se o projeto já estiver no notebook, basta atualizar: `git pull`.

## 3. Rodar a API (terminal 1)

```bash
cd api
./mvnw spring-boot:run
```

- Windows, PowerShell: `.\mvnw.cmd spring-boot:run`
- Windows, cmd: `mvnw.cmd spring-boot:run`
- Só com Java 17: acrescente `-Djava.version=17`. No PowerShell, entre aspas: `.\mvnw.cmd spring-boot:run "-Djava.version=17"`

A primeira execução baixa as dependências e demora alguns minutos. Está pronta quando aparecer `Started InstitutoMaoAmigaApiApplication`. Deixe esse terminal aberto.

Conferir no navegador:

- http://localhost:8085/api/v1/pontos mostra os 29 pontos.
- http://localhost:8085/swagger-ui.html abre o Swagger.

O banco é criado em `api/data/` na primeira execução, já com os 29 pontos e as 12 doações de exemplo. Essa pasta não vai para o Git: cada computador tem o seu banco.

## 4. Rodar o app (terminal 2, na raiz do projeto)

```bash
npm run web
```

Abra http://localhost:8081. A lista deve mostrar "10 de 29 pontos" no rodapé e carregar mais ao rolar.

Para testar no celular com o Expo Go, troque `localhost` pelo IP do notebook em `API_URL` ([src/services/api.ts](../src/services/api.ts)) e rode `npx expo start`. Mais detalhes no [README](../README.md#onde-trocar-o-ip-celular-com-expo-go). Antes de fazer commit, volte para `localhost`.

## 5. Conferir se está tudo certo

| O que | Comando | Resultado esperado |
| --- | --- | --- |
| Testes da API | `cd api` e `./mvnw test` (com Java 17: `./mvnw test -Djava.version=17`) | `Tests run: 13, Failures: 0, Errors: 0` |
| Tipos do app | `npm run typecheck` | termina sem nenhum erro listado |

## Problemas comuns

| Sintoma | Causa e solução |
| --- | --- |
| `release version 21 not supported` ao subir a API | O Java instalado é o 17. Use `-Djava.version=17` (passo 3) ou instale o JDK 21. |
| `Port 8085 was already in use` | Já tem uma API rodando (outro terminal ou o VS Code). Feche o outro terminal, ou no PowerShell: `Get-NetTCPConnection -LocalPort 8085 -State Listen \| ForEach-Object { Stop-Process -Id $_.OwningProcess }`. |
| `permission denied: ./mvnw` (Mac/Linux) | `chmod +x mvnw` dentro da pasta `api`. |
| PowerShell diz que `npm.ps1` não pode ser carregado | Rode uma vez `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` ou use o Prompt de Comando (cmd). |
| App mostra "Não foi possível conectar à API" | A API não está rodando ou `API_URL` aponta para o lugar errado. Suba a API e toque em "Tentar novamente". |
| App mostra telas antigas depois de mudar o código | Pare o Expo (Ctrl+C) e rode `npx expo start --web -c` para limpar o cache. |
| Quer voltar aos dados iniciais | Pare a API, apague a pasta `api/data/` e suba de novo. |
| Excluir no navegador abre um "OK/Cancelar" do navegador | É de propósito: o `Alert.alert` não aparece no navegador. No celular aparece o alerta com Cancelar e Excluir (`src/utils/confirmar.ts`). |

## Onde mexer para cada tipo de mudança

**Adicionar um campo no ponto** (o mesmo vale para a doação):

1. API: campo na entidade `entity/Ponto.java`, em `PontoRequestDTO` (com a validação) e em `PontoResponseDTO`. Ajuste `Ponto.atualizar` e o construtor usado em `CargaInicialPontos`.
2. Se a pasta `api/data/` já existir, o Hibernate cria a coluna nova sozinho (`ddl-auto=update`), mas os pontos antigos ficam com ela vazia. Para recriar com a carga inicial, apague `api/data/`.
3. App: tipo em `src/types/ponto.ts`, campo no formulário `CadastroPontoScreen.tsx` e onde for exibido (`DetalhePonto.tsx`, `PontoItem.tsx`).

**Novo endpoint:** repository, depois service, depois controller na API. No app, uma função nova em `pontosService.ts` ou `doacoesService.ts` usando `get/post/put/del` de `api.ts`. Telas nunca chamam `fetch` nem montam URL.

**Nova tela:** crie o arquivo em `src/screens/`, registre a rota em `src/types/navigation.ts` e em `App.tsx`.

**Lista paginada nova:** reaproveite o hook `usePaginacao` passando a função do service que busca uma página.

## Fluxo do Git

```bash
git pull                      # antes de começar, para pegar o que está no GitHub
# ... altera o código ...
git add .
git commit -m "fix: descricao curta refs #27"
git push
```

Os commits citam o número da issue (`refs #N`). Para algo novo, abra primeiro uma issue no GitHub e use o número que ela receber. `closes #N` na mensagem fecha a issue quando o commit chega ao GitHub.
