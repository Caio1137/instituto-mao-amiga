package br.com.institutomaoamiga.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.Locale;

public record PontoRequestDTO(
        @Schema(example = "Ponto Praça Universitária")
        @NotBlank(message = "O nome é obrigatório.")
        @Size(max = 100, message = "O nome deve ter até 100 caracteres.") String nome,

        @Schema(example = "Praça Universitária, s/n")
        @NotBlank(message = "O endereço é obrigatório.")
        @Size(max = 200, message = "O endereço deve ter até 200 caracteres.") String endereco,

        @Schema(example = "Setor Universitário")
        @NotBlank(message = "O bairro é obrigatório.")
        @Size(max = 80, message = "O bairro deve ter até 80 caracteres.") String bairro,

        @Schema(example = "Seg a Sex, 8h às 17h")
        @NotBlank(message = "O horário é obrigatório.")
        @Size(max = 100, message = "O horário deve ter até 100 caracteres.") String horario,

        @Schema(example = "coleta", allowableValues = {"coleta", "distribuição"})
        @NotBlank(message = "O tipo é obrigatório.")
        @Pattern(regexp = "coleta|distribuição", message = "O tipo deve ser \"coleta\" ou \"distribuição\".") String tipo
) {
    // Tira espaços das pontas: "   " vira "" e cai no @NotBlank.
    public PontoRequestDTO {
        nome = nome == null ? null : nome.trim();
        endereco = endereco == null ? null : endereco.trim();
        bairro = bairro == null ? null : bairro.trim();
        horario = horario == null ? null : horario.trim();
        tipo = tipo == null ? null : tipo.trim().toLowerCase(Locale.ROOT);
    }
}
