package br.com.institutomaoamiga.api.dto;

public record ErroResponse(
        int status,
        String mensagem
) {
}
