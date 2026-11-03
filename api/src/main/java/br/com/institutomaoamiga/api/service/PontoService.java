package br.com.institutomaoamiga.api.service;

import br.com.institutomaoamiga.api.dto.PontoResponse;
import br.com.institutomaoamiga.api.exception.PontoNaoEncontradoException;
import br.com.institutomaoamiga.api.repository.PontoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class PontoService {

    private final PontoRepository pontoRepository;

    public PontoService(PontoRepository pontoRepository) {
        this.pontoRepository = pontoRepository;
    }

    public Page<PontoResponse> listar(Pageable pageable) {
        return pontoRepository.findAll(pageable).map(PontoResponse::de);
    }

    public PontoResponse buscarPorId(Long id) {
        return pontoRepository.findById(id)
                .map(PontoResponse::de)
                .orElseThrow(() -> new PontoNaoEncontradoException(id));
    }
}
