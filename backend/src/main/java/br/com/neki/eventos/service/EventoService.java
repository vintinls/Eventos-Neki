package br.com.neki.eventos.service;

import br.com.neki.eventos.dto.EventoDTO;
import br.com.neki.eventos.dto.EventoRequestDTO;
import br.com.neki.eventos.dto.EventoUpdateRequestDTO;
import br.com.neki.eventos.model.Administrador;
import br.com.neki.eventos.model.Evento;
import br.com.neki.eventos.repository.AdministradorRepository;
import br.com.neki.eventos.repository.EventoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private AdministradorRepository administradorRepository;

    /**
     * Cria um novo evento associado a um administrador usando upload de imagem.
     */
    public EventoDTO criar(EventoRequestDTO dto) throws IOException {
        if (dto.getData().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("A data do evento deve ser no presente ou no futuro");
        }

        Administrador admin = administradorRepository.findById(dto.getAdministradorId())
                .orElseThrow(() -> new EntityNotFoundException("Administrador não encontrado"));

        Evento evento = new Evento();
        evento.setNome(dto.getNome());
        evento.setData(dto.getData());
        evento.setLocalizacao(dto.getLocalizacao());

        MultipartFile imagem = dto.getImagem();
        if (imagem != null && !imagem.isEmpty()) {
            // Salva no banco
            evento.setImagem(imagem.getBytes());

            // Salva em disco
            String fileName = System.currentTimeMillis() + "_" + imagem.getOriginalFilename();
            Path filePath = Paths.get("uploads", fileName);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, imagem.getBytes());

            // URL para acessar a imagem
            evento.setImagemUrl("/uploads/" + fileName);
        }

        evento.setAdministrador(admin);

        Evento salvo = eventoRepository.save(evento);
        return mapToDTO(salvo);
    }

    /**
     * Cria um novo evento associado a um administrador usando apenas uma URL.
     */
    public EventoDTO criarComUrl(String nome, LocalDateTime data, String localizacao, Long administradorId, String imagemUrl) {
        if (data.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("A data do evento deve ser no presente ou no futuro");
        }

        Administrador admin = administradorRepository.findById(administradorId)
                .orElseThrow(() -> new EntityNotFoundException("Administrador não encontrado"));

        Evento evento = new Evento();
        evento.setNome(nome);
        evento.setData(data);
        evento.setLocalizacao(localizacao);
        evento.setAdministrador(admin);

        // neste caso, não salva binário, só a URL
        evento.setImagem(null);
        evento.setImagemUrl(imagemUrl);

        Evento salvo = eventoRepository.save(evento);
        return mapToDTO(salvo);
    }

    /**
     * Lista todos os eventos de um administrador.
     */
    public List<EventoDTO> listarPorAdministrador(Long administradorId) {
        return eventoRepository.findByAdministradorId(administradorId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Lista todos os eventos cadastrados.
     */
    public List<EventoDTO> listarTodos() {
        return eventoRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Atualiza informações de um evento existente.
     */
    public EventoDTO atualizar(Long eventoId, EventoUpdateRequestDTO dto) {
        Evento evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new EntityNotFoundException("Evento não encontrado"));

        if (dto.getLocalizacao() != null) {
            evento.setLocalizacao(dto.getLocalizacao());
        }
        if (dto.getData() != null) {
            if (dto.getData().isBefore(LocalDateTime.now())) {
                throw new IllegalArgumentException("A data do evento deve ser no presente ou no futuro");
            }
            evento.setData(dto.getData());
        }

        Evento atualizado = eventoRepository.save(evento);
        return mapToDTO(atualizado);
    }

    /**
     * Exclui um evento pelo ID.
     */
    public void excluir(Long eventoId) {
        if (!eventoRepository.existsById(eventoId)) {
            throw new EntityNotFoundException("Evento não encontrado");
        }
        eventoRepository.deleteById(eventoId);
    }

    /**
     * Busca a imagem de um evento pelo ID (binário).
     */
    public byte[] buscarImagem(Long id) {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Evento não encontrado"));
        return evento.getImagem();
    }

    /**
     * Converte entidade para DTO.
     */
    private EventoDTO mapToDTO(Evento e) {
        return new EventoDTO(
                e.getId(),
                e.getNome(),
                e.getData(),
                e.getLocalizacao(),
                e.getImagem(),
                e.getImagemUrl()
        );
    }
}
