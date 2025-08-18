package br.com.neki.eventos.controller;

import br.com.neki.eventos.dto.EventoDTO;
import br.com.neki.eventos.dto.EventoRequestDTO;
import br.com.neki.eventos.dto.EventoUpdateRequestDTO;
import br.com.neki.eventos.service.EventoService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/eventos")
@Tag(name = "Eventos", description = "CRUD de eventos do administrador")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    @GetMapping("/admin/{administradorId}")
    public ResponseEntity<List<EventoDTO>> listarPorAdmin(@PathVariable Long administradorId) {
        return ResponseEntity.ok(eventoService.listarPorAdministrador(administradorId));
    }

    @PostMapping
    public ResponseEntity<EventoDTO> criar(@RequestBody EventoRequestDTO dto) {
        return ResponseEntity.ok(eventoService.criar(dto));
    }

    @PutMapping("/{eventoId}")
    public ResponseEntity<EventoDTO> atualizar(@PathVariable Long eventoId,
                                               @RequestBody EventoUpdateRequestDTO dto) {
        return ResponseEntity.ok(eventoService.atualizar(eventoId, dto));
    }

    @DeleteMapping("/{eventoId}")
    public ResponseEntity<Void> excluir(@PathVariable Long eventoId) {
        eventoService.excluir(eventoId);
        return ResponseEntity.noContent().build();
    }
}
