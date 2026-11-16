package br.com.institutomaoamiga.api.config;

import br.com.institutomaoamiga.api.entity.Ponto;
import br.com.institutomaoamiga.api.repository.PontoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Pontos de coleta e distribuição em Goiânia. Só grava quando a tabela está vazia,
 * então reiniciar a API não duplica os pontos (o H2 fica salvo em arquivo).
 */
@Component
@RequiredArgsConstructor
public class CargaInicialPontos implements CommandLineRunner {

    private static final String COLETA = "coleta";
    private static final String DISTRIBUICAO = "distribuição";

    private final PontoRepository pontoRepository;

    @Override
    public void run(String... args) {
        if (pontoRepository.count() > 0) {
            return;
        }

        pontoRepository.saveAll(List.of(
                new Ponto("Sede Central", "Bosque dos Buritis, Rua 1, s/n", "Setor Oeste", "Seg a Sex, 8h às 17h", COLETA),
                new Ponto("Ponto Lago das Rosas", "Parque Lago das Rosas, Av. Anhanguera", "Setor Oeste", "Ter e Qui, 13h às 18h", DISTRIBUICAO),
                new Ponto("Ponto Vaca Brava", "Parque Vaca Brava, Av. T-10", "Setor Bueno", "Sáb, 9h às 14h", COLETA),
                new Ponto("Espaço Areião", "Parque Areião, Av. Areião", "Setor Pedro Ludovico", "Seg e Qua, 14h às 18h", DISTRIBUICAO),
                new Ponto("Centro Comunitário Jardim Goiás", "Parque Flamboyant, Rua 46", "Jardim Goiás", "Sex, 9h às 16h", COLETA),
                new Ponto("Ponto Parque Cascavel", "Parque Cascavel, Av. Rio Verde", "Jardim Atlântico", "Sáb, 8h às 12h", DISTRIBUICAO),
                new Ponto("Ponto Praça Universitária", "Praça Universitária, s/n", "Setor Universitário", "Seg a Sex, 13h às 18h", COLETA),
                new Ponto("Ponto Jardim Novo Mundo", "Praça Washington, Av. New York", "Jardim Novo Mundo", "Ter, 8h às 17h", DISTRIBUICAO),
                new Ponto("Ponto Campinas", "Praça Joaquim Lúcio, Av. 24 de Outubro", "Campinas", "Seg a Sex, 8h às 12h", COLETA),
                new Ponto("Ponto Praça Cívica", "Praça Dr. Pedro Ludovico Teixeira, s/n", "Setor Central", "Seg a Sex, 9h às 16h", COLETA)
        ));
    }
}
