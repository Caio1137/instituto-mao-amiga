package br.com.institutomaoamiga.api.controller;

import br.com.institutomaoamiga.api.dto.PontoResponse;
import br.com.institutomaoamiga.api.service.PontoService;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pontos")
public class PontoController {

    private final PontoService pontoService;

    public PontoController(PontoService pontoService) {
        this.pontoService = pontoService;
    }

    @GetMapping
    public Page<PontoResponse> listar(@ParameterObject @PageableDefault(size = 20, sort = "nome") Pageable pageable) {
        return pontoService.listar(pageable);
    }

    @GetMapping("/{id}")
    public PontoResponse buscarPorId(@PathVariable Long id) {
        return pontoService.buscarPorId(id);
    }
}
