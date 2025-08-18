package br.com.neki.eventos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.neki.eventos.model.Administrador;
import java.util.Optional;

public interface AdministradorRepository extends JpaRepository<Administrador, Long> {
    Optional<Administrador> findByEmail(String email);
}
