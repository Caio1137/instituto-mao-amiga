package br.com.institutomaoamiga.api.repository;

import br.com.institutomaoamiga.api.entity.Ponto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PontoRepository extends JpaRepository<Ponto, Long> {
}
