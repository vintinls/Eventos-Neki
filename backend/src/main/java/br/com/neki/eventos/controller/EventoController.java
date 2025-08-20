package br.com.neki.eventos.controller;

import br.com.neki.eventos.dto.EventoDTO;
import br.com.neki.eventos.dto.EventoRequestDTO;
import br.com.neki.eventos.dto.EventoUpdateRequestDTO;
import br.com.neki.eventos.service.EventoService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/eventos")
@Tag(name = "Eventos", description = "CRUD de eventos do administrador")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    // 🔹 Criar evento com upload de arquivo (JSON + imagem)
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<EventoDTO> criarComUpload(
            @RequestPart("dados") @Valid EventoRequestDTO request,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem) throws IOException {

        return ResponseEntity.ok(eventoService.criarComUpload(request, imagem));
    }

    // 🔹 Criar evento passando apenas a URL da imagem (JSON puro)
    @PostMapping("/url")
    public ResponseEntity<EventoDTO> criarComUrl(@Valid @RequestBody EventoRequestDTO request) {
        return ResponseEntity.ok(eventoService.criarComUrl(request));
    }

    // 🔹 Lista eventos de um administrador específico
    @GetMapping("/admin/{administradorId}")
    public ResponseEntity<List<EventoDTO>> listarPorAdmin(@PathVariable Long administradorId) {
        return ResponseEntity.ok(eventoService.listarPorAdministrador(administradorId));
    }

    // 🔹 Lista todos os eventos
    @GetMapping
    public ResponseEntity<List<EventoDTO>> listarTodos() {
        return ResponseEntity.ok(eventoService.listarTodos());
    }

    // 🔹 Atualiza informações do evento
    @PutMapping("/{eventoId}")
    public ResponseEntity<EventoDTO> atualizar(
            @PathVariable Long eventoId,
            @Valid @RequestBody EventoUpdateRequestDTO dto) {
        return ResponseEntity.ok(eventoService.atualizar(eventoId, dto));
    }

    // 🔹 Deleta um evento
    @DeleteMapping("/{eventoId}")
    public ResponseEntity<Void> excluir(@PathVariable Long eventoId) {
        eventoService.excluir(eventoId);
        return ResponseEntity.noContent().build();
    }

    // 🔹 Retorna a imagem do evento em binário
    @GetMapping("/{id}/imagem")
    public ResponseEntity<byte[]> buscarImagem(@PathVariable Long id) {
        byte[] imagem = eventoService.buscarImagem(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"evento_" + id + ".jpg\"")
                .contentType(MediaType.IMAGE_JPEG)
                .body(imagem);
    }
}
