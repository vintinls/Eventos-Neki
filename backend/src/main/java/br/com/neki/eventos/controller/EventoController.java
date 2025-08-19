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

    // 🔹 Criar evento com upload de arquivo
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<EventoDTO> criarComUpload(
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

    // 🔹 Criar evento passando apenas a URL da imagem
    @PostMapping("/url")
    public ResponseEntity<EventoDTO> criarComUrl(
            @RequestParam("nome") String nome,
            @RequestParam("data") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime data,
            @RequestParam("localizacao") String localizacao,
            @RequestParam("administradorId") Long administradorId,
            @RequestParam("imagemUrl") String imagemUrl) {

        return ResponseEntity.ok(eventoService.criarComUrl(nome, data, localizacao, administradorId, imagemUrl));
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

    // 🔹 Retorna a imagem do evento em binário (bytea → resposta HTTP)
    @GetMapping("/{id}/imagem")
    public ResponseEntity<byte[]> buscarImagem(@PathVariable Long id) {
        byte[] imagem = eventoService.buscarImagem(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"evento_" + id + ".jpg\"")
                .contentType(MediaType.IMAGE_JPEG)
                .body(imagem);
    }
}
