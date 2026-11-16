package br.com.institutomaoamiga.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

/** O app não envia id nem criadoEm: o id é gerado pelo banco e a data pelo service. */
public record DoacaoRequestDTO(
        @Schema(example = "Arroz 5 kg")
        @NotBlank(message = "O tipo do item é obrigatório.")
        @Size(max = 100, message = "O tipo do item deve ter até 100 caracteres.") String tipoItem,

        @Schema(example = "10")
        @NotNull(message = "A quantidade é obrigatória.")
        @Positive(message = "A quantidade deve ser maior que zero.") Integer quantidade,

        @Schema(example = "Sede Central")
        @NotBlank(message = "O ponto de destino é obrigatório.")
        @Size(max = 100, message = "O ponto de destino deve ter até 100 caracteres.") String pontoDestino
) {
    public DoacaoRequestDTO {
        tipoItem = tipoItem == null ? null : tipoItem.trim();
        pontoDestino = pontoDestino == null ? null : pontoDestino.trim();
    }
}
