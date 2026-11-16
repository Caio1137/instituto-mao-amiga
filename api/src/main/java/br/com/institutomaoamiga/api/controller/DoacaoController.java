package br.com.institutomaoamiga.api.controller;

import br.com.institutomaoamiga.api.dto.DoacaoRequestDTO;
import br.com.institutomaoamiga.api.dto.DoacaoResponseDTO;
import br.com.institutomaoamiga.api.service.DoacaoService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/doacoes")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Tag(name = "Doacoes", description = "Doações registradas para os pontos")
public class DoacaoController {

    private final DoacaoService doacaoService;

    /** Ex.: /api/v1/doacoes/filtro?filtro=arroz&page=0&size=10 (mais nova primeiro). */
    @GetMapping("/filtro")
    public Page<DoacaoResponseDTO> buscarDoacoes(
            @RequestParam(required = false, defaultValue = "") String filtro,
            @ParameterObject @PageableDefault(size = 10, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable) {
        return doacaoService.buscarPorFiltro(filtro, pageable);
    }

    @GetMapping("/{id}")
    public DoacaoResponseDTO buscarDoacaoPorId(@PathVariable UUID id) {
        return doacaoService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DoacaoResponseDTO cadastrarDoacao(@Valid @RequestBody DoacaoRequestDTO doacao) {
        return doacaoService.cadastrar(doacao);
    }

    @PutMapping("/{id}")
    public DoacaoResponseDTO editarDoacao(@PathVariable UUID id, @Valid @RequestBody DoacaoRequestDTO doacao) {
        return doacaoService.editar(id, doacao);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluirDoacao(@PathVariable UUID id) {
        doacaoService.excluir(id);
    }
}
