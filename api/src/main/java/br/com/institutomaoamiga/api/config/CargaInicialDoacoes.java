package br.com.institutomaoamiga.api.config;

import br.com.institutomaoamiga.api.entity.Doacao;
import br.com.institutomaoamiga.api.repository.DoacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

/**
 * Algumas doações de exemplo, para o histórico já ter mais de uma página na demonstração.
 * Só grava quando a tabela está vazia, então reiniciar a API não duplica nada.
 */
@Component
@RequiredArgsConstructor
public class CargaInicialDoacoes implements CommandLineRunner {

    private final DoacaoRepository doacaoRepository;

    @Override
    public void run(String... args) {
        if (doacaoRepository.count() > 0) {
            return;
        }

        String[][] exemplos = {
                {"Arroz 5 kg", "10", "Sede Central"},
                {"Feijão 1 kg", "20", "Ponto Vaca Brava"},
                {"Cobertor", "8", "Centro Comunitário Jardim Goiás"},
                {"Leite longa vida", "24", "Ponto Parque Cascavel"},
                {"Kit de higiene", "15", "Espaço Areião"},
                {"Roupa infantil", "30", "Ponto Campinas"},
                {"Arroz 1 kg", "12", "Ponto Praça Universitária"},
                {"Material escolar", "18", "Ponto Praça Cívica"},
                {"Óleo de soja", "9", "Sede Central"},
                {"Macarrão", "16", "Ponto Feira Hippie"},
                {"Calçados", "6", "Ponto Setor Marista"},
                {"Produto de limpeza", "11", "Ponto Setor Bueno"}
        };

        // Uma doação a cada 6 horas para trás, a primeira da lista é a mais recente.
        LocalDateTime agora = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
        List<Doacao> doacoes = new ArrayList<>();
        for (int i = 0; i < exemplos.length; i++) {
            String[] exemplo = exemplos[i];
            doacoes.add(new Doacao(exemplo[0], Integer.parseInt(exemplo[1]), exemplo[2], agora.minusHours(6L * (i + 1))));
        }
        doacaoRepository.saveAll(doacoes);
    }
}
