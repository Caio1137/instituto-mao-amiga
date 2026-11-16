package br.com.institutomaoamiga.api.repository;

import br.com.institutomaoamiga.api.entity.Ponto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PontoRepository extends JpaRepository<Ponto, UUID> {

    /** Procura o texto no nome ou no bairro, sem diferenciar maiúsculas. Filtro vazio traz todos. */
    @Query("""
            SELECT p FROM Ponto p
            WHERE LOWER(p.nome) LIKE LOWER(CONCAT('%', :filtro, '%'))
               OR LOWER(p.bairro) LIKE LOWER(CONCAT('%', :filtro, '%'))
            """)
    Page<Ponto> buscarPorFiltro(@Param("filtro") String filtro, Pageable pageable);
}
