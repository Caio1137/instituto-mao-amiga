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
                new Ponto("Ponto Praça Cívica", "Praça Dr. Pedro Ludovico Teixeira, s/n", "Setor Central", "Seg a Sex, 9h às 16h", COLETA),
                new Ponto("Ponto Feira Hippie", "Praça do Trabalhador, s/n", "Setor Norte Ferroviário", "Dom, 7h às 12h", COLETA),
                new Ponto("Ponto Vila Nova", "Rua 202, Praça Boaventura", "Vila Nova", "Qua, 8h às 17h", DISTRIBUICAO),
                new Ponto("Ponto Setor Marista", "Rua 1136, esquina com Av. 85", "Setor Marista", "Seg a Sex, 14h às 18h", COLETA),
                new Ponto("Ponto Parque Atheneu", "Av. Primavera, Praça da Igreja", "Parque Atheneu", "Sáb, 8h às 13h", DISTRIBUICAO),
                new Ponto("Ponto Jardim América", "Praça C-201, s/n", "Jardim América", "Ter e Qui, 8h às 12h", COLETA),
                new Ponto("Ponto Bosque do Jardim Botânico", "Jardim Botânico Amália Franco, Av. Botafogo", "Setor Pedro Ludovico", "Qui, 13h às 17h", COLETA),
                new Ponto("Ponto Setor Coimbra", "Av. Castelo Branco, 2100", "Setor Coimbra", "Seg a Sex, 8h às 17h", DISTRIBUICAO),
                new Ponto("Ponto Setor Aeroporto", "Praça Gilson Alves, Rua 9-A", "Setor Aeroporto", "Seg e Qua, 9h às 15h", COLETA),
                new Ponto("Ponto Jardim Guanabara", "Av. Jardim Guanabara, Centro Comunitário", "Jardim Guanabara", "Sáb, 9h às 13h", DISTRIBUICAO),
                new Ponto("Ponto Jardim Curitiba", "Av. Mangalô, Praça do Jardim Curitiba", "Jardim Curitiba", "Ter, 14h às 18h", DISTRIBUICAO),
                new Ponto("Ponto Vila Mutirão", "Av. Perimetral Norte, Escola Municipal", "Vila Mutirão", "Qua e Sex, 8h às 12h", DISTRIBUICAO),
                new Ponto("Ponto Parque Amazônia", "Av. Rio Verde, Praça do Parque Amazônia", "Parque Amazônia", "Seg a Sex, 13h às 17h", COLETA),
                new Ponto("Ponto Jardim Europa", "Parque Macambira Anicuns, Av. Milão", "Jardim Europa", "Sáb, 8h às 12h", COLETA),
                new Ponto("Ponto Faiçalville", "Praça do Faiçalville, Rua F-35", "Faiçalville", "Qui, 8h às 12h", DISTRIBUICAO),
                new Ponto("Ponto Parque Oeste Industrial", "Av. Pedro Paulo de Souza, Salão Comunitário", "Parque Oeste Industrial", "Ter e Qui, 14h às 18h", DISTRIBUICAO),
                new Ponto("Ponto Residencial Real Conquista", "Av. Real Conquista, Centro de Saúde", "Residencial Real Conquista", "Sex, 13h às 17h", DISTRIBUICAO),
                new Ponto("Ponto Setor Sul", "Praça do Cruzeiro, Rua 115", "Setor Sul", "Seg a Sex, 8h às 12h", COLETA),
                new Ponto("Ponto Setor Bueno", "Av. T-4, Praça T-23", "Setor Bueno", "Seg a Sex, 9h às 18h", COLETA),
                new Ponto("Ponto Jardim Goiás Norte", "Av. E, Estádio Serra Dourada", "Jardim Goiás", "Dom, 8h às 12h", DISTRIBUICAO)
        ));
    }
}
