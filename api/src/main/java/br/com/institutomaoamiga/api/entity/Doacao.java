package br.com.institutomaoamiga.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "TB_DOACAO")
@Getter
@Setter
@NoArgsConstructor
public class Doacao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String tipoItem;

    @Column(nullable = false)
    private Integer quantidade;

    /** Nome do ponto que recebe a doação. */
    @Column(nullable = false, length = 100)
    private String pontoDestino;

    /** Preenchido pelo service no cadastro; updatable = false garante que a edição não muda. */
    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    public Doacao(String tipoItem, Integer quantidade, String pontoDestino, LocalDateTime criadoEm) {
        this.tipoItem = tipoItem;
        this.quantidade = quantidade;
        this.pontoDestino = pontoDestino;
        this.criadoEm = criadoEm;
    }
}
