package br.com.institutomaoamiga.api.dto;

import br.com.institutomaoamiga.api.entity.Ponto;

public record PontoResponse(
        Long id,
        String nome,
        String endereco,
        String horario,
        String atendimento,
        Double latitude,
        Double longitude
) {
    public static PontoResponse de(Ponto ponto) {
        return new PontoResponse(
                ponto.getId(),
                ponto.getNome(),
                ponto.getEndereco(),
                ponto.getHorario(),
                ponto.getAtendimento(),
                ponto.getLatitude(),
                ponto.getLongitude()
        );
    }
}
