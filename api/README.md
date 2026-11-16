# API Instituto Mão Amiga

API Spring Boot com os pontos de coleta e distribuição e as doações do Instituto Mão Amiga. O app na raiz do repositório consome esta API.

- Java 21 (o projeto também compila com Java 17), Spring Boot 4, Spring Web, Spring Data JPA, H2, Lombok, Bean Validation e Swagger (springdoc-openapi).
- Pacotes: `entity`, `repository`, `service`, `controller`, `dto`, `config` e `exception` (tratamento de 400/404).

## Como executar

```bash
./mvnw spring-boot:run
```

No Windows: `mvnw.cmd spring-boot:run`. A API sobe em `http://localhost:8085`.

- Swagger UI: http://localhost:8085/swagger-ui.html
- Console do H2: http://localhost:8085/h2-console (JDBC URL `jdbc:h2:file:./data/institutodb`, usuário `sa`, sem senha)

O banco H2 é gravado em arquivo na pasta `api/data/` (fora do Git). Os dados cadastrados continuam lá depois de reiniciar a API. Para voltar à carga inicial, pare a API e apague a pasta `data/`.

Testes automatizados (CRUD, 400, 404, CORS e carga inicial):

```bash
./mvnw test
```

## Pontos de coleta

Campos do ponto: `id` (UUID), `nome`, `endereco`, `bairro`, `horario` (texto, ex.: `"Seg a Sex, 8h às 17h"`) e `tipo` (`"coleta"` ou `"distribuição"`).

| Método | URL | Resposta |
| --- | --- | --- |
| GET | `http://localhost:8085/api/v1/pontos` | 200 com a lista de pontos ordenada por nome |
| GET | `http://localhost:8085/api/v1/pontos/filtro?filtro=&page=0&size=10` | 200 com uma página de pontos (ver busca paginada) |
| GET | `http://localhost:8085/api/v1/pontos/{id}` | 200 com o ponto, 404 se o id não existe |
| POST | `http://localhost:8085/api/v1/pontos` | 201 com o ponto criado, 400 se faltar campo |
| PUT | `http://localhost:8085/api/v1/pontos/{id}` | 200 com o ponto alterado, 400 se faltar campo, 404 se o id não existe |
| DELETE | `http://localhost:8085/api/v1/pontos/{id}` | 204 sem corpo, 404 se o id não existe |

Exemplo de corpo para POST e PUT:

```json
{
  "nome": "Ponto Praça do Trabalhador",
  "endereco": "Praça do Trabalhador, s/n",
  "bairro": "Setor Norte Ferroviário",
  "horario": "Dom, 7h às 12h",
  "tipo": "coleta"
}
```

Regras:

- `PontoRequestDTO` usa Bean Validation (`@NotBlank` em todos os campos e `@Pattern` no tipo) e o controller recebe com `@Valid`. Campo vazio ou só com espaços responde **400** com a mensagem do campo e nada é gravado.
- O controller sempre devolve o record `PontoResponseDTO`, nunca a entidade `Ponto`.
- `@CrossOrigin(origins = "*")` no controller libera o acesso do app (navegador e celular).
- Erros têm o formato `{ "status": 404, "mensagem": "Ponto não encontrado: ..." }`.
- `CargaInicialPontos` cadastra os pontos em Goiânia só quando a tabela está vazia, então reiniciar a API não duplica nada.

### Busca paginada

`GET http://localhost:8085/api/v1/pontos/filtro?filtro=...&page=0&size=10` devolve um `Page<PontoResponseDTO>`.

- O `filtro` procura no **nome** ou no **bairro**, sem diferenciar maiúsculas (`@Query` com `LOWER(...) LIKE` no `PontoRepository`).
- Sem `filtro` (ou vazio), devolve todos os pontos paginados.
- Padrão: 10 itens por página ordenados por nome (`@PageableDefault(size = 10, sort = "nome")`). `sort=bairro,asc` na URL troca a ordem. No máximo 50 por página.
- A resposta vem no formato `content` + `page` (`spring.data.web.pageable.serialization-mode=via_dto`).
- A carga inicial tem 29 pontos, então a lista sem filtro tem 3 páginas de 10.

Para caber aqui, as listas de 10 pontos foram cortadas nos dois primeiros itens.

**1. Sem filtro** — `GET /api/v1/pontos/filtro?page=0&size=10`

```json
{
  "content": [
    {
      "id": "4cf3ddcc-a4fb-410d-a582-362390251e47",
      "nome": "Centro Comunitário Jardim Goiás",
      "endereco": "Parque Flamboyant, Rua 46",
      "bairro": "Jardim Goiás",
      "horario": "Sex, 9h às 16h",
      "tipo": "coleta"
    },
    {
      "id": "b4641ebf-3112-4702-a68d-6fbbcb92550e",
      "nome": "Espaço Areião",
      "endereco": "Parque Areião, Av. Areião",
      "bairro": "Setor Pedro Ludovico",
      "horario": "Seg e Qua, 14h às 18h",
      "tipo": "distribuição"
    },
    "... mais 8 pontos"
  ],
  "page": { "size": 10, "number": 0, "totalElements": 29, "totalPages": 3 }
}
```

**2. Filtrando por bairro** — `GET /api/v1/pontos/filtro?filtro=setor oeste&page=0&size=10`

```json
{
  "content": [
    {
      "id": "de3c7c38-49b7-4287-9f6d-542c26499ef0",
      "nome": "Ponto Lago das Rosas",
      "endereco": "Parque Lago das Rosas, Av. Anhanguera",
      "bairro": "Setor Oeste",
      "horario": "Ter e Qui, 13h às 18h",
      "tipo": "distribuição"
    },
    {
      "id": "11e88cb5-7135-466b-86fd-24070f17d263",
      "nome": "Sede Central",
      "endereco": "Bosque dos Buritis, Rua 1, s/n",
      "bairro": "Setor Oeste",
      "horario": "Seg a Sex, 8h às 17h",
      "tipo": "coleta"
    }
  ],
  "page": { "size": 10, "number": 0, "totalElements": 2, "totalPages": 1 }
}
```

**3. Segunda página** — `GET /api/v1/pontos/filtro?page=1&size=10`

```json
{
  "content": [
    {
      "id": "f45101ce-9218-4893-9b5f-88c2c5a5972d",
      "nome": "Ponto Jardim Guanabara",
      "endereco": "Av. Jardim Guanabara, Centro Comunitário",
      "bairro": "Jardim Guanabara",
      "horario": "Sáb, 9h às 13h",
      "tipo": "distribuição"
    },
    {
      "id": "c666b62d-f19b-4efd-bdb6-471fc6da62bc",
      "nome": "Ponto Jardim Novo Mundo",
      "endereco": "Praça Washington, Av. New York",
      "bairro": "Jardim Novo Mundo",
      "horario": "Ter, 8h às 17h",
      "tipo": "distribuição"
    },
    "... mais 8 pontos"
  ],
  "page": { "size": 10, "number": 1, "totalElements": 29, "totalPages": 3 }
}
```

Com `sort=bairro,asc` a primeira página começa por Campinas, Faiçalville e Jardim América. Um campo de ordenação que não existe (`sort=xyz`) responde 400.

### Prints do Swagger

| Chamada | Print |
| --- | --- |
| GET lista (200) | ![GET lista 200](../docs/swagger/pontos-01-get-lista-200.png) |
| GET por id (200) | ![GET por id 200](../docs/swagger/pontos-02-get-id-200.png) |
| GET id inexistente (404) | ![GET 404](../docs/swagger/pontos-03-get-id-404.png) |
| POST (201) | ![POST 201](../docs/swagger/pontos-04-post-201.png) |
| POST com nome e bairro vazios (400) | ![POST 400](../docs/swagger/pontos-05-post-400.png) |
| PUT id inexistente (404) | ![PUT 404](../docs/swagger/pontos-06-put-404.png) |
| PUT (200) | ![PUT 200](../docs/swagger/pontos-07-put-200.png) |
| PUT com campos vazios (400) | ![PUT 400](../docs/swagger/pontos-08-put-400.png) |
| DELETE (204) | ![DELETE 204](../docs/swagger/pontos-09-delete-204.png) |
| DELETE id inexistente (404) | ![DELETE 404](../docs/swagger/pontos-10-delete-404.png) |

## Doações

Campos da doação: `id` (UUID), `tipoItem`, `quantidade` (inteiro), `pontoDestino` (nome do ponto) e `criadoEm` (`LocalDateTime`).

| Método | URL | Resposta |
| --- | --- | --- |
| GET | `http://localhost:8085/api/v1/doacoes/filtro?filtro=...&page=0&size=10` | 200 com uma página de doações, da mais nova para a mais antiga |
| GET | `http://localhost:8085/api/v1/doacoes/{id}` | 200 com a doação, 404 se o id não existe |
| POST | `http://localhost:8085/api/v1/doacoes` | 201 com a doação criada, 400 se os dados forem inválidos |
| PUT | `http://localhost:8085/api/v1/doacoes/{id}` | 200 com a doação alterada, 400 se os dados forem inválidos, 404 se o id não existe |
| DELETE | `http://localhost:8085/api/v1/doacoes/{id}` | 204 sem corpo, 404 se o id não existe |

Exemplo de corpo para POST e PUT (o app não envia `id` nem `criadoEm`):

```json
{
  "tipoItem": "Cesta básica",
  "quantidade": 4,
  "pontoDestino": "Sede Central"
}
```

Regras:

- `DoacaoRequestDTO` com Bean Validation e `@Valid` no controller: `tipoItem` e `pontoDestino` obrigatórios (`@NotBlank`), `quantidade` obrigatória e maior que zero (`@NotNull` e `@Positive`). Quantidade zero, negativa, decimal ou tipo vazio respondem **400** e nada é gravado.
- `criadoEm` é preenchido no `DoacaoService` com `LocalDateTime.now()` no cadastro. Se o app mandar `criadoEm`, o valor é ignorado. Na edição o service não mexe na data e a coluna é `updatable = false`, então `id` e `criadoEm` continuam os mesmos.
- `DoacaoResponseDTO` devolve todos os campos, incluindo `id` e `criadoEm`.
- O filtro procura no tipo do item sem diferenciar maiúsculas (`@Query` no `DoacaoRepository`), com `@PageableDefault(size = 10, sort = "criadoEm", direction = Sort.Direction.DESC)`.
- `CargaInicialDoacoes` cadastra 12 doações de exemplo (só com a tabela vazia), para o histórico do app já ter mais de uma página.

### Prints do Swagger

| Chamada | Print |
| --- | --- |
| GET filtro `arroz` (200) | ![GET filtro 200](../docs/swagger/doacoes-01-get-filtro-200.png) |
| GET por id (200) | ![GET por id 200](../docs/swagger/doacoes-02-get-id-200.png) |
| GET id inexistente (404) | ![GET 404](../docs/swagger/doacoes-03-get-id-404.png) |
| POST (201) | ![POST 201](../docs/swagger/doacoes-04-post-201.png) |
| POST com tipo vazio e quantidade zero (400) | ![POST 400](../docs/swagger/doacoes-05-post-400.png) |
| POST com quantidade negativa (400) | ![POST 400 negativa](../docs/swagger/doacoes-06-post-400-negativa.png) |
| PUT id inexistente (404) | ![PUT 404](../docs/swagger/doacoes-07-put-404.png) |
| PUT (200), mesmo `id` e `criadoEm` | ![PUT 200](../docs/swagger/doacoes-08-put-200.png) |
| PUT com quantidade zero (400) | ![PUT 400](../docs/swagger/doacoes-09-put-400.png) |
| DELETE (204) | ![DELETE 204](../docs/swagger/doacoes-10-delete-204.png) |
| DELETE id inexistente (404) | ![DELETE 404](../docs/swagger/doacoes-11-delete-404.png) |
