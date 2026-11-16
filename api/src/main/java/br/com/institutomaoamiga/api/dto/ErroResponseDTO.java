package br.com.institutomaoamiga.api.dto;

public record ErroResponseDTO(
        int status,
        String mensagem
) {
}
