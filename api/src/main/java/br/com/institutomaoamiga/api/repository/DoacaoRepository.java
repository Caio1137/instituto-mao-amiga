package br.com.institutomaoamiga.api.repository;

import br.com.institutomaoamiga.api.entity.Doacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DoacaoRepository extends JpaRepository<Doacao, UUID> {

    /** Procura no tipo do item, sem diferenciar maiúsculas. Filtro vazio traz todas. */
    @Query("""
            SELECT d FROM Doacao d
            WHERE LOWER(d.tipoItem) LIKE LOWER(CONCAT('%', :filtro, '%'))
            """)
    Page<Doacao> buscarPorFiltro(@Param("filtro") String filtro, Pageable pageable);
}
