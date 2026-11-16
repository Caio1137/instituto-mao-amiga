package br.com.institutomaoamiga.api;

import br.com.institutomaoamiga.api.config.CargaInicialPontos;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:pontos;DB_CLOSE_DELAY=-1",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
@AutoConfigureMockMvc
class InstitutoMaoAmigaApiApplicationTests {

    private static final String PONTOS = "/api/v1/pontos";
    private static final String PONTO_VALIDO = """
            {"nome":"Ponto de teste", "endereco":"Rua 10, 100", "bairro":"Setor Teste",
             "horario":"Seg a Sex, 8h às 17h", "tipo":"coleta"}
            """;

    @Autowired MockMvc mvc;
    @Autowired CargaInicialPontos cargaInicialPontos;

    private int totalDePontos() throws Exception {
        String resposta = mvc.perform(get(PONTOS)).andReturn().getResponse().getContentAsString();
        return JsonPath.<List<?>>read(resposta, "$").size();
    }

    @Test
    void cargaInicialNaoDuplicaAoRodarDeNovo() throws Exception {
        int antes = totalDePontos();
        cargaInicialPontos.run();
        org.junit.jupiter.api.Assertions.assertTrue(antes >= 8);
        org.junit.jupiter.api.Assertions.assertEquals(antes, totalDePontos());
    }

    @Test
    void listaDevolveDtoOrdenadoPorNome() throws Exception {
        mvc.perform(get(PONTOS)).andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").isNotEmpty())
                .andExpect(jsonPath("$[0].bairro").isNotEmpty())
                .andExpect(jsonPath("$[0].tipo").isNotEmpty())
                .andExpect(jsonPath("$[0].nome").value("Centro Comunitário Jardim Goiás"));
    }

    @Test
    void crudCompletoDePonto() throws Exception {
        String criado = mvc.perform(post(PONTOS).contentType(MediaType.APPLICATION_JSON).content(PONTO_VALIDO))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.tipo").value("coleta"))
                .andReturn().getResponse().getContentAsString();
        String id = JsonPath.read(criado, "$.id");

        mvc.perform(get(PONTOS + "/" + id)).andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Ponto de teste"));

        mvc.perform(put(PONTOS + "/" + id).contentType(MediaType.APPLICATION_JSON)
                        .content(PONTO_VALIDO.replace("Ponto de teste", "Ponto editado").replace("\"coleta\"", "\"distribuição\"")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.nome").value("Ponto editado"))
                .andExpect(jsonPath("$.tipo").value("distribuição"));

        mvc.perform(delete(PONTOS + "/" + id)).andExpect(status().isNoContent()).andExpect(content().string(""));
        mvc.perform(get(PONTOS + "/" + id)).andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.mensagem").isNotEmpty());
    }

    @Test
    void campoVazioResponde400ENaoGrava() throws Exception {
        int antes = totalDePontos();
        for (String campo : List.of("Ponto de teste", "Rua 10, 100", "Setor Teste", "Seg a Sex, 8h às 17h")) {
            String corpo = PONTO_VALIDO.replace("\"" + campo + "\"", "\"   \"");
            mvc.perform(post(PONTOS).contentType(MediaType.APPLICATION_JSON).content(corpo))
                    .andExpect(status().isBadRequest()).andExpect(jsonPath("$.mensagem").isNotEmpty());
        }
        for (String corpo : List.of(PONTO_VALIDO.replace("\"coleta\"", "\"\""),
                PONTO_VALIDO.replace("\"coleta\"", "\"outro\""), "{}", "{invalido")) {
            mvc.perform(post(PONTOS).contentType(MediaType.APPLICATION_JSON).content(corpo))
                    .andExpect(status().isBadRequest()).andExpect(jsonPath("$.mensagem").isNotEmpty());
        }
        org.junit.jupiter.api.Assertions.assertEquals(antes, totalDePontos());

        // Edição com campo vazio também não altera o ponto.
        String primeiro = mvc.perform(get(PONTOS)).andReturn().getResponse().getContentAsString();
        String id = JsonPath.read(primeiro, "$[0].id");
        String nome = JsonPath.read(primeiro, "$[0].nome");
        mvc.perform(put(PONTOS + "/" + id).contentType(MediaType.APPLICATION_JSON)
                        .content(PONTO_VALIDO.replace("\"Ponto de teste\"", "\"\"")))
                .andExpect(status().isBadRequest());
        mvc.perform(get(PONTOS + "/" + id)).andExpect(jsonPath("$.nome").value(nome));
    }

    @Test
    void idInexistenteResponde404() throws Exception {
        String rota = PONTOS + "/" + UUID.randomUUID();
        mvc.perform(get(rota)).andExpect(status().isNotFound());
        mvc.perform(put(rota).contentType(MediaType.APPLICATION_JSON).content(PONTO_VALIDO)).andExpect(status().isNotFound());
        mvc.perform(delete(rota)).andExpect(status().isNotFound());
        mvc.perform(get(PONTOS + "/nao-e-uuid")).andExpect(status().isBadRequest());
    }

    @Test
    void filtroSemTextoDevolvePaginaDe10OrdenadaPorNome() throws Exception {
        mvc.perform(get(PONTOS + "/filtro")).andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(10))
                .andExpect(jsonPath("$.content[0].nome").value("Centro Comunitário Jardim Goiás"))
                .andExpect(jsonPath("$.page.size").value(10))
                .andExpect(jsonPath("$.page.number").value(0))
                .andExpect(jsonPath("$.page.totalElements").value(org.hamcrest.Matchers.greaterThanOrEqualTo(25)))
                .andExpect(jsonPath("$.pageable").doesNotExist());
    }

    @Test
    void filtroProcuraNomeOuBairroSemDiferenciarMaiusculas() throws Exception {
        // "SETOR OESTE" está no bairro de 2 pontos.
        mvc.perform(get(PONTOS + "/filtro").param("filtro", "  SETOR oeste "))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page.totalElements").value(2));
        // "vaca" está só no nome.
        mvc.perform(get(PONTOS + "/filtro").param("filtro", "vaca"))
                .andExpect(jsonPath("$.page.totalElements").value(1))
                .andExpect(jsonPath("$.content[0].nome").value("Ponto Vaca Brava"));
        mvc.perform(get(PONTOS + "/filtro").param("filtro", "nao-existe"))
                .andExpect(jsonPath("$.content.length()").value(0));
    }

    @Test
    void segundaPaginaEOrdenacaoPorBairro() throws Exception {
        String pagina0 = mvc.perform(get(PONTOS + "/filtro").param("page", "0"))
                .andReturn().getResponse().getContentAsString();
        String pagina1 = mvc.perform(get(PONTOS + "/filtro").param("page", "1"))
                .andExpect(jsonPath("$.page.number").value(1))
                .andReturn().getResponse().getContentAsString();
        List<String> ids0 = JsonPath.read(pagina0, "$.content[*].id");
        List<String> ids1 = JsonPath.read(pagina1, "$.content[*].id");
        org.junit.jupiter.api.Assertions.assertTrue(ids1.stream().noneMatch(ids0::contains));

        mvc.perform(get(PONTOS + "/filtro").param("sort", "bairro,asc"))
                .andExpect(jsonPath("$.content[0].bairro").value("Campinas"));
        mvc.perform(get(PONTOS + "/filtro").param("sort", "campoInvalido"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void corsLiberado() throws Exception {
        mvc.perform(get(PONTOS).header("Origin", "http://localhost:8081"))
                .andExpect(header().string("Access-Control-Allow-Origin", "*"));
    }
}
