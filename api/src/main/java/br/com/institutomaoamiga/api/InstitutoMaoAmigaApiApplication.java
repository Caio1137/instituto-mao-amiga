package br.com.institutomaoamiga.api;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(info = @Info(title = "API Instituto Mão Amiga", version = "v1",
        description = "Pontos de coleta e distribuição do Instituto Mão Amiga."))
public class InstitutoMaoAmigaApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(InstitutoMaoAmigaApiApplication.class, args);
    }
}
