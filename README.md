# Instituto Mão Amiga

Projeto da disciplina de Construção de Software. O app usa React Native com Expo e uma API Spring Boot na pasta `api/`.

Pontos de coleta e doações ficam no banco H2. Os favoritos ficam no AsyncStorage, guardando apenas os ids dos pontos.

## Como rodar

Requisitos: Node.js 24 LTS e JDK 17 ou 21. O Maven Wrapper já está no projeto.

Na raiz do projeto:

```bash
npm ci
npm run api
```

Espere aparecer `Started InstitutoMaoAmigaApiApplication`. O comando detecta o Java instalado.

Em outro terminal, na mesma pasta:

```bash
npm run web
```

- App: http://localhost:8081
- API: http://localhost:8085/api/v1
- Swagger: http://localhost:8085/swagger-ui.html

Para encerrar, use Ctrl+C nos dois terminais. O banco fica salvo em `api/data/`. Na primeira execução, são cadastrados 29 pontos de Goiânia e 12 doações de exemplo. Reiniciar a API mantém os dados.

Para executar diretamente pelo Maven no PowerShell, entre em `api/` e use `.\mvnw.cmd spring-boot:run`. Com Java 17, acrescente `"-Djava.version=17"`.

## No celular

Copie `.env.example` para `.env.local` e troque `localhost` pelo IPv4 do computador, consultado com `ipconfig`. Exemplo:

```dotenv
EXPO_PUBLIC_API_URL=http://192.168.0.10:8085/api/v1
```

Com a API ligada, rode `npm start`. O Expo usa a porta 8082. No iPhone, leia o QR code pela Câmera e abra no Expo Go.

O computador e o celular precisam estar na mesma rede, com acesso às portas 8082 e 8085. Se mudar o IP, atualize `.env.local` e recarregue o app. Sem esse arquivo, a URL padrão é `http://localhost:8085/api/v1`, definida em `src/services/api.ts`.

Os testes da interface foram feitos no navegador.

## Testes

```bash
npm run typecheck
npm run check:expo
npm run test:api
```

## Endpoints

As rotas abaixo usam a base `http://localhost:8085/api/v1`. Os links abrem as capturas das respostas no Swagger.

| Método | Rota | Respostas |
| --- | --- | --- |
| GET | `/pontos` | [200](docs/swagger/pontos-01-get-lista-200.png) |
| GET | `/pontos/filtro?filtro=&page=0&size=10` | 200, página de pontos |
| GET | `/pontos/{id}` | [200](docs/swagger/pontos-02-get-id-200.png), [404](docs/swagger/pontos-03-get-id-404.png) |
| POST | `/pontos` | [201](docs/swagger/pontos-04-post-201.png), [400](docs/swagger/pontos-05-post-400.png) |
| PUT | `/pontos/{id}` | [200](docs/swagger/pontos-07-put-200.png), [400](docs/swagger/pontos-08-put-400.png), [404](docs/swagger/pontos-06-put-404.png) |
| DELETE | `/pontos/{id}` | [204](docs/swagger/pontos-09-delete-204.png), [404](docs/swagger/pontos-10-delete-404.png) |
| GET | `/doacoes/filtro?filtro=&page=0&size=10` | [200](docs/swagger/doacoes-01-get-filtro-200.png) |
| GET | `/doacoes/{id}` | [200](docs/swagger/doacoes-02-get-id-200.png), [404](docs/swagger/doacoes-03-get-id-404.png) |
| POST | `/doacoes` | [201](docs/swagger/doacoes-04-post-201.png), [400](docs/swagger/doacoes-05-post-400.png), [400 com quantidade negativa](docs/swagger/doacoes-06-post-400-negativa.png) |
| PUT | `/doacoes/{id}` | [200](docs/swagger/doacoes-08-put-200.png), [400](docs/swagger/doacoes-09-put-400.png), [404](docs/swagger/doacoes-07-put-404.png) |
| DELETE | `/doacoes/{id}` | [204](docs/swagger/doacoes-10-delete-204.png), [404](docs/swagger/doacoes-11-delete-404.png) |

Corpo para cadastrar ou editar um ponto:

```json
{
  "nome": "Ponto Demo",
  "endereco": "Rua 10, 100",
  "bairro": "Setor Sul",
  "horario": "Seg a Sex, 8h às 17h",
  "tipo": "coleta"
}
```

O tipo pode ser `coleta` ou `distribuição`. Todos os campos são obrigatórios.

Corpo para cadastrar ou editar uma doação:

```json
{
  "tipoItem": "Arroz 5 kg",
  "quantidade": 3,
  "pontoDestino": "Sede Central"
}
```

A quantidade deve ser inteira e maior que zero. O servidor gera o id e a data de cadastro, que são mantidos na edição.

## Exemplos da busca paginada

O filtro procura no nome ou bairro, sem diferenciar maiúsculas. O padrão é de 10 itens por página, ordenados pelo nome. Para ordenar por bairro, use `sort=bairro,asc`.

As respostas abaixo foram abreviadas para mostrar um item de `content`. Os ids variam conforme o banco.

Sem filtro: `GET /api/v1/pontos/filtro?page=0&size=10`

```json
{
  "content": [{
    "id": "4cf3ddcc-a4fb-410d-a582-362390251e47",
    "nome": "Centro Comunitário Jardim Goiás",
    "endereco": "Parque Flamboyant, Rua 46",
    "bairro": "Jardim Goiás",
    "horario": "Sex, 9h às 16h",
    "tipo": "coleta"
  }],
  "page": { "size": 10, "number": 0, "totalElements": 29, "totalPages": 3 }
}
```

Por bairro: `GET /api/v1/pontos/filtro?filtro=setor%20oeste&page=0&size=10`

```json
{
  "content": [{
    "id": "de3c7c38-49b7-4287-9f6d-542c26499ef0",
    "nome": "Ponto Lago das Rosas",
    "endereco": "Parque Lago das Rosas, Av. Anhanguera",
    "bairro": "Setor Oeste",
    "horario": "Ter e Qui, 13h às 18h",
    "tipo": "distribuição"
  }],
  "page": { "size": 10, "number": 0, "totalElements": 2, "totalPages": 1 }
}
```

Segunda página: `GET /api/v1/pontos/filtro?page=1&size=10`

```json
{
  "content": [{
    "id": "f45101ce-9218-4893-9b5f-88c2c5a5972d",
    "nome": "Ponto Jardim Guanabara",
    "endereco": "Av. Jardim Guanabara, Centro Comunitário",
    "bairro": "Jardim Guanabara",
    "horario": "Sáb, 9h às 13h",
    "tipo": "distribuição"
  }],
  "page": { "size": 10, "number": 1, "totalElements": 29, "totalPages": 3 }
}
```

O histórico de doações usa `/doacoes/filtro`, filtra pelo tipo do item e vem da mais nova para a mais antiga.

## Roteiro de demonstração

Com o app e o Swagger abertos, o roteiro é de até três minutos:

| Tempo | Ação |
| --- | --- |
| 0:00–0:20 | Rolar a lista e buscar `setor oeste`. Limpar a busca. |
| 0:20–0:50 | Cadastrar o Ponto Demo, abri-lo e editar o horário. |
| 0:50–1:20 | Favoritar o ponto, abrir Meus pontos e recarregar para mostrar a persistência. Desmarcar e favoritar novamente. |
| 1:20–1:40 | Excluir o Ponto Demo com confirmação e mostrar que o favorito também sai da lista. |
| 1:40–2:25 | Cadastrar uma doação para Sede Central, editar a quantidade e excluir. Mostrar que a edição manteve id e data. |
| 2:25–3:00 | No Swagger, enviar doação com quantidade zero para mostrar 400. Consultar um ponto com id `00000000-0000-0000-0000-000000000000` para mostrar 404. |

Pontos e doações ficam no servidor porque são dados compartilhados do Instituto. Favoritos são uma preferência do aparelho, por isso ficam no AsyncStorage. A tela Meus pontos busca os dados atuais na API pelo id e trata pontos excluídos sem interromper a lista.
