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
    void corsLiberado() throws Exception {
        mvc.perform(get(PONTOS).header("Origin", "http://localhost:8081"))
                .andExpect(header().string("Access-Control-Allow-Origin", "*"));
    }
}
