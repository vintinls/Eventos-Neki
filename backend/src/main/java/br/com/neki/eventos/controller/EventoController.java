package br.com.neki.eventos.controller;

import br.com.neki.eventos.dto.EventoDTO;
import br.com.neki.eventos.dto.EventoRequestDTO;
import br.com.neki.eventos.dto.EventoUpdateRequestDTO;
import br.com.neki.eventos.model.Administrador;
import br.com.neki.eventos.repository.AdministradorRepository;
import br.com.neki.eventos.service.EventoService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/eventos")
@Tag(name = "Eventos", description = "CRUD de eventos do administrador")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    @Autowired
    private AdministradorRepository administradorRepository;

    /**
     * Lista todos os eventos do administrador autenticado
     */
    @GetMapping
    public ResponseEntity<List<EventoDTO>> listarPorAdmin(Authentication authentication) {
        String email = authentication.getName();
        Administrador admin = administradorRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Administrador não encontrado"));

        return ResponseEntity.ok(eventoService.listarPorAdministrador(admin.getId()));
    }

    /**
     * Cria evento para o administrador autenticado
     */
    @PostMapping
    public ResponseEntity<EventoDTO> criar(@Valid @RequestBody EventoRequestDTO dto,
                                           Authentication authentication) {
        String email = authentication.getName();
        Administrador admin = administradorRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Administrador não encontrado"));

        return ResponseEntity.ok(eventoService.criar(dto, admin));
    }

    /**
     * Atualiza evento
     */
    @PutMapping("/{eventoId}")
    public ResponseEntity<EventoDTO> atualizar(@PathVariable Long eventoId,
                                               @Valid @RequestBody EventoUpdateRequestDTO dto) {
        return ResponseEntity.ok(eventoService.atualizar(eventoId, dto));
    }

    /**
     * Exclui evento
     */
    @DeleteMapping("/{eventoId}")
    public ResponseEntity<Void> excluir(@PathVariable Long eventoId) {
        eventoService.excluir(eventoId);
        return ResponseEntity.noContent().build();
    }
}
