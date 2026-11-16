package br.com.institutomaoamiga.api.entity;

import br.com.institutomaoamiga.api.dto.PontoRequestDTO;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "TB_PONTO")
@Getter
@Setter
@NoArgsConstructor
public class Ponto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 200)
    private String endereco;

    @Column(nullable = false, length = 80)
    private String bairro;

    /** Texto livre, por exemplo "Seg a Sex, 8h às 17h". */
    @Column(nullable = false, length = 100)
    private String horario;

    /** "coleta" ou "distribuição". */
    @Column(nullable = false, length = 20)
    private String tipo;

    public Ponto(String nome, String endereco, String bairro, String horario, String tipo) {
        this.nome = nome;
        this.endereco = endereco;
        this.bairro = bairro;
        this.horario = horario;
        this.tipo = tipo;
    }

    public static Ponto toEntity(PontoRequestDTO dto) {
        Ponto ponto = new Ponto();
        ponto.atualizar(dto);
        return ponto;
    }

    public void atualizar(PontoRequestDTO dto) {
        this.nome = dto.nome();
        this.endereco = dto.endereco();
        this.bairro = dto.bairro();
        this.horario = dto.horario();
        this.tipo = dto.tipo();
    }
}
