package br.com.institutomaoamiga.api.config;

import br.com.institutomaoamiga.api.entity.Ponto;
import br.com.institutomaoamiga.api.repository.PontoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Pontos de coleta e distribuição em Goiânia. As coordenadas foram tiradas do
 * OpenStreetMap (parques e praças onde cada ponto funciona).
 */
@Component
public class CargaInicialPontos implements CommandLineRunner {

    private final PontoRepository pontoRepository;

    public CargaInicialPontos(PontoRepository pontoRepository) {
        this.pontoRepository = pontoRepository;
    }

    @Override
    public void run(String... args) {
        if (pontoRepository.count() > 0) {
            return;
        }

        pontoRepository.saveAll(List.of(
                new Ponto(
                        "Sede Central",
                        "Bosque dos Buritis - Setor Oeste, Goiânia",
                        "Segunda a sexta, das 8h às 17h",
                        "Recebe alimentos, roupas e produtos de higiene.",
                        -16.681841, -49.261937),
                new Ponto(
                        "Ponto Lago das Rosas",
                        "Parque Lago das Rosas - Setor Oeste, Goiânia",
                        "Terças e quintas, das 13h às 18h",
                        "Distribui cestas básicas para famílias cadastradas.",
                        -16.679453, -49.274176),
                new Ponto(
                        "Ponto Vaca Brava",
                        "Parque Vaca Brava - Nova Suíça, Goiânia",
                        "Sábados, das 9h às 14h",
                        "Recebe doações de alimentos não perecíveis e cobertores.",
                        -16.709577, -49.270764),
                new Ponto(
                        "Espaço Areião",
                        "Parque Areião - Setor Pedro Ludovico, Goiânia",
                        "Segundas e quartas, das 14h às 18h",
                        "Distribui kits de higiene para famílias encaminhadas.",
                        -16.706334, -49.255667),
                new Ponto(
                        "Centro Comunitário Jardim Goiás",
                        "Parque Flamboyant - Jardim Goiás, Goiânia",
                        "Sextas, das 9h às 16h",
                        "Recebe roupas de adulto e infantil em boas condições.",
                        -16.703132, -49.238199),
                new Ponto(
                        "Ponto Parque Cascavel",
                        "Parque Cascavel - Jardim Atlântico, Goiânia",
                        "Sábados, das 8h às 12h",
                        "Entrega cestas básicas e recebe leite longa vida.",
                        -16.735019, -49.292795),
                new Ponto(
                        "Ponto Praça Boaventura",
                        "Praça Senador Albino Boaventura - Elísio Campos, Goiânia",
                        "Quartas e sextas, das 8h às 12h",
                        "Recebe material escolar e livros infantis.",
                        -16.664932, -49.245421),
                new Ponto(
                        "Ponto Jardim Novo Mundo",
                        "Praça Washington - Jardim Novo Mundo, Goiânia",
                        "Terças, das 8h às 17h",
                        "Distribui roupas e calçados para famílias cadastradas.",
                        -16.674447, -49.216035),
                new Ponto(
                        "Ponto Praça Paraíso",
                        "Praça Paraíso - Jardim Novo Mundo, Goiânia",
                        "Domingos, das 8h às 12h",
                        "Recebe alimentos não perecíveis e produtos de limpeza.",
                        -16.693600, -49.228400)
        ));
    }
}
