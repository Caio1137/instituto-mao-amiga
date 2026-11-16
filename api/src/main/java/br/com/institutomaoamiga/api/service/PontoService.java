package br.com.institutomaoamiga.api.service;

import br.com.institutomaoamiga.api.dto.PontoRequestDTO;
import br.com.institutomaoamiga.api.dto.PontoResponseDTO;
import br.com.institutomaoamiga.api.entity.Ponto;
import br.com.institutomaoamiga.api.exception.RecursoNaoEncontradoException;
import br.com.institutomaoamiga.api.repository.PontoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PontoService {

    private final PontoRepository pontoRepository;

    public List<PontoResponseDTO> listar() {
        return pontoRepository.findAll(Sort.by("nome")).stream()
                .map(PontoResponseDTO::toDto)
                .toList();
    }

    public Page<PontoResponseDTO> buscarPorFiltro(String filtro, Pageable pageable) {
        String texto = filtro == null ? "" : filtro.trim();
        return pontoRepository.buscarPorFiltro(texto, pageable).map(PontoResponseDTO::toDto);
    }

    public PontoResponseDTO buscarPorId(UUID id) {
        return PontoResponseDTO.toDto(buscarEntidade(id));
    }

    public PontoResponseDTO cadastrar(PontoRequestDTO dto) {
        return PontoResponseDTO.toDto(pontoRepository.save(Ponto.toEntity(dto)));
    }

    public PontoResponseDTO editar(UUID id, PontoRequestDTO dto) {
        Ponto ponto = buscarEntidade(id);
        ponto.atualizar(dto);
        return PontoResponseDTO.toDto(pontoRepository.save(ponto));
    }

    public void excluir(UUID id) {
        if (!pontoRepository.existsById(id)) {
            throw naoEncontrado(id);
        }
        pontoRepository.deleteById(id);
    }

    private Ponto buscarEntidade(UUID id) {
        return pontoRepository.findById(id).orElseThrow(() -> naoEncontrado(id));
    }

    private RecursoNaoEncontradoException naoEncontrado(UUID id) {
        return new RecursoNaoEncontradoException("Ponto não encontrado: " + id);
    }
}
