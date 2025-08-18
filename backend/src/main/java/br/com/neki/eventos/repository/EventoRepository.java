package br.com.neki.eventos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.neki.eventos.model.Evento;
import java.util.List;

public interface EventoRepository extends JpaRepository<Evento, Long> {
    List<Evento> findByAdministradorId(Long administradorId);
}
