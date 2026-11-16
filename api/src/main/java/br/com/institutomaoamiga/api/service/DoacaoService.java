package br.com.institutomaoamiga.api.service;

import br.com.institutomaoamiga.api.dto.DoacaoRequestDTO;
import br.com.institutomaoamiga.api.dto.DoacaoResponseDTO;
import br.com.institutomaoamiga.api.entity.Doacao;
import br.com.institutomaoamiga.api.exception.RecursoNaoEncontradoException;
import br.com.institutomaoamiga.api.repository.DoacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DoacaoService {

    private final DoacaoRepository doacaoRepository;

    public Page<DoacaoResponseDTO> buscarPorFiltro(String filtro, Pageable pageable) {
        String texto = filtro == null ? "" : filtro.trim();
        return doacaoRepository.buscarPorFiltro(texto, pageable).map(DoacaoResponseDTO::toDto);
    }

    public DoacaoResponseDTO buscarPorId(UUID id) {
        return DoacaoResponseDTO.toDto(buscarEntidade(id));
    }

    public DoacaoResponseDTO cadastrar(DoacaoRequestDTO dto) {
        // A data de cadastro é do servidor, não vem do app. Truncada em segundos para o valor
        // devolvido no POST ser igual ao que fica gravado no banco.
        LocalDateTime agora = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
        Doacao doacao = new Doacao(dto.tipoItem(), dto.quantidade(), dto.pontoDestino(), agora);
        return DoacaoResponseDTO.toDto(doacaoRepository.save(doacao));
    }

    public DoacaoResponseDTO editar(UUID id, DoacaoRequestDTO dto) {
        Doacao doacao = buscarEntidade(id);
        doacao.setTipoItem(dto.tipoItem());
        doacao.setQuantidade(dto.quantidade());
        doacao.setPontoDestino(dto.pontoDestino());
        // id e criadoEm continuam os mesmos.
        return DoacaoResponseDTO.toDto(doacaoRepository.save(doacao));
    }

    public void excluir(UUID id) {
        if (!doacaoRepository.existsById(id)) {
            throw naoEncontrada(id);
        }
        doacaoRepository.deleteById(id);
    }

    private Doacao buscarEntidade(UUID id) {
        return doacaoRepository.findById(id).orElseThrow(() -> naoEncontrada(id));
    }

    private RecursoNaoEncontradoException naoEncontrada(UUID id) {
        return new RecursoNaoEncontradoException("Doação não encontrada: " + id);
    }
}
