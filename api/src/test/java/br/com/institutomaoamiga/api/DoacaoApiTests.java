package br.com.institutomaoamiga.api;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:doacoes;DB_CLOSE_DELAY=-1",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
@AutoConfigureMockMvc
class DoacaoApiTests {

    private static final String DOACOES = "/api/v1/doacoes";
    private static final String VALIDA = """
            {"tipoItem":"Arroz de teste", "quantidade":5, "pontoDestino":"Sede Central"}
            """;

    @Autowired MockMvc mvc;

    private long total() throws Exception {
        String resposta = mvc.perform(get(DOACOES + "/filtro")).andReturn().getResponse().getContentAsString();
        return ((Number) JsonPath.read(resposta, "$.page.totalElements")).longValue();
    }

    @Test
    void crudCompletoMantemIdECriadoEmNaEdicao() throws Exception {
        String criada = mvc.perform(post(DOACOES).contentType(MediaType.APPLICATION_JSON)
                        // criadoEm enviado pelo app é ignorado.
                        .content(VALIDA.replace("}", ", \"criadoEm\":\"2000-01-01T00:00:00\"}")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.criadoEm").isNotEmpty())
                .andReturn().getResponse().getContentAsString();
        String id = JsonPath.read(criada, "$.id");
        String criadoEm = JsonPath.read(criada, "$.criadoEm");
        assertTrue(LocalDateTime.parse(criadoEm).isAfter(LocalDateTime.now().minusMinutes(1)));

        mvc.perform(get(DOACOES + "/" + id)).andExpect(status().isOk())
                .andExpect(jsonPath("$.criadoEm").value(criadoEm))
                .andExpect(jsonPath("$.tipoItem").value("Arroz de teste"))
                .andExpect(jsonPath("$.quantidade").value(5))
                .andExpect(jsonPath("$.pontoDestino").value("Sede Central"));

        mvc.perform(put(DOACOES + "/" + id).contentType(MediaType.APPLICATION_JSON)
                        .content(VALIDA.replace("5", "7").replace("Sede Central", "Espaço Areião")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.quantidade").value(7))
                .andExpect(jsonPath("$.pontoDestino").value("Espaço Areião"))
                .andExpect(jsonPath("$.criadoEm").value(criadoEm));

        mvc.perform(delete(DOACOES + "/" + id)).andExpect(status().isNoContent()).andExpect(content().string(""));
        mvc.perform(get(DOACOES + "/" + id)).andExpect(status().isNotFound())
                .andExpect(jsonPath("$.mensagem").isNotEmpty());
    }

    @Test
    void dadosInvalidosRespondem400ENaoGravam() throws Exception {
        long antes = total();
        for (String corpo : List.of(
                VALIDA.replace("5", "0"),
                VALIDA.replace("5", "-3"),
                VALIDA.replace("5", "1.5"),
                VALIDA.replace("\"quantidade\":5,", ""),
                VALIDA.replace("Arroz de teste", ""),
                VALIDA.replace("Arroz de teste", "   "),
                VALIDA.replace("Sede Central", ""),
                "{}")) {
            mvc.perform(post(DOACOES).contentType(MediaType.APPLICATION_JSON).content(corpo))
                    .andExpect(status().isBadRequest()).andExpect(jsonPath("$.mensagem").isNotEmpty());
        }
        assertEquals(antes, total());

        String pagina = mvc.perform(get(DOACOES + "/filtro")).andReturn().getResponse().getContentAsString();
        String id = JsonPath.read(pagina, "$.content[0].id");
        Integer quantidade = JsonPath.read(pagina, "$.content[0].quantidade");
        mvc.perform(put(DOACOES + "/" + id).contentType(MediaType.APPLICATION_JSON).content(VALIDA.replace("5", "0")))
                .andExpect(status().isBadRequest());
        mvc.perform(get(DOACOES + "/" + id)).andExpect(jsonPath("$.quantidade").value(quantidade));
    }

    @Test
    void idInexistenteResponde404() throws Exception {
        String rota = DOACOES + "/" + UUID.randomUUID();
        mvc.perform(get(rota)).andExpect(status().isNotFound());
        mvc.perform(put(rota).contentType(MediaType.APPLICATION_JSON).content(VALIDA)).andExpect(status().isNotFound());
        mvc.perform(delete(rota)).andExpect(status().isNotFound());
    }

    @Test
    void filtroPorTipoSemDiferenciarMaiusculasDaMaisNovaParaAMaisAntiga() throws Exception {
        String resposta = mvc.perform(get(DOACOES + "/filtro").param("filtro", " ARROZ "))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page.size").value(10))
                .andReturn().getResponse().getContentAsString();
        List<String> tipos = JsonPath.read(resposta, "$.content[*].tipoItem");
        assertTrue(tipos.size() >= 2);
        assertTrue(tipos.stream().allMatch(tipo -> tipo.toLowerCase().contains("arroz")));

        String todas = mvc.perform(get(DOACOES + "/filtro")).andReturn().getResponse().getContentAsString();
        List<String> datas = JsonPath.read(todas, "$.content[*].criadoEm");
        for (int i = 1; i < datas.size(); i++) {
            assertTrue(LocalDateTime.parse(datas.get(i - 1)).compareTo(LocalDateTime.parse(datas.get(i))) >= 0,
                    "lista deve vir da mais nova para a mais antiga");
        }

        // Uma doação nova vai para o topo.
        mvc.perform(post(DOACOES).contentType(MediaType.APPLICATION_JSON).content(VALIDA.replace("Arroz de teste", "Doação mais nova")))
                .andExpect(status().isCreated());
        mvc.perform(get(DOACOES + "/filtro")).andExpect(jsonPath("$.content[0].tipoItem").value("Doação mais nova"));
    }
}
