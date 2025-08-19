package br.com.neki.eventos.controller;

import br.com.neki.eventos.dto.EventoDTO;
import br.com.neki.eventos.dto.EventoRequestDTO;
import br.com.neki.eventos.dto.EventoUpdateRequestDTO;
import br.com.neki.eventos.service.EventoService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.IOException;
import java.time.LocalDateTime;
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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<EventoDTO> criar(
            @RequestParam("nome") String nome,
            @RequestParam("data") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime data,
            @RequestParam("localizacao") String localizacao,
            @RequestParam("administradorId") Long administradorId,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem) throws IOException {

        EventoRequestDTO dto = new EventoRequestDTO();
        dto.setNome(nome);
        dto.setData(data);
        dto.setLocalizacao(localizacao);
        dto.setAdministradorId(administradorId);
        dto.setImagem(imagem);

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

    @GetMapping("/{id}/imagem")
    public ResponseEntity<byte[]> buscarImagem(@PathVariable Long id) {
        byte[] imagem = eventoService.buscarImagem(id);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG) // ou IMAGE_PNG
                .body(imagem);
    }
}
