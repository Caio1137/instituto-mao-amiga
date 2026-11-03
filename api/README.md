# API Instituto Mão Amiga

API Spring Boot com os pontos de coleta e distribuição do Instituto Mão Amiga. O app na raiz do repositório só lê esses dados.

## Como executar

```bash
./mvnw spring-boot:run
```

No Windows: `mvnw.cmd spring-boot:run`. A API sobe em `http://localhost:8085`.

- Swagger UI: http://localhost:8085/swagger-ui.html
- Console do H2: http://localhost:8085/h2-console (JDBC URL `jdbc:h2:mem:institutodb`, usuário `sa`, sem senha)

## Endpoints

- `GET /pontos?page=0&size=20&sort=nome`: página de pontos no formato `{ content, page }`. 20 por página por padrão, no máximo 50.
- `GET /pontos/{id}`: um ponto. Um id que não existe responde 404.

O controller devolve o record `PontoResponse`, nunca a entidade JPA `Ponto`.

## Dados iniciais

`CargaInicialPontos` cadastra 9 pontos em parques e praças de Goiânia, com latitude e longitude tiradas do OpenStreetMap.
