package br.com.neki.eventos.service;

import br.com.neki.eventos.dto.EventoDTO;
import br.com.neki.eventos.dto.EventoRequestDTO;
import br.com.neki.eventos.dto.EventoUpdateRequestDTO;
import br.com.neki.eventos.model.Administrador;
import br.com.neki.eventos.model.Evento;
import br.com.neki.eventos.repository.AdministradorRepository;
import br.com.neki.eventos.repository.EventoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class EventoService {

    private final EventoRepository eventoRepository;
    private final AdministradorRepository administradorRepository;

    public EventoService(EventoRepository eventoRepository, AdministradorRepository administradorRepository) {
        this.eventoRepository = eventoRepository;
        this.administradorRepository = administradorRepository;
    }

    // Cria evento com upload de imagem (salva binário no banco)
    public EventoDTO criarComUpload(EventoRequestDTO dto, MultipartFile imagem) throws IOException {
        Administrador admin = buscarAdministrador(dto.getAdministradorId());

        Evento evento = new Evento();
        evento.setNome(dto.getNome());
        evento.setData(dto.getData());
        evento.setLocalizacao(dto.getLocalizacao());
        evento.setAdministrador(admin);

        if (imagem != null && !imagem.isEmpty()) {
            evento.setImagem(imagem.getBytes());
            evento.setImagemUrl(null);
        }

        return mapToDTO(eventoRepository.save(evento));
    }

    // Cria evento com imagem via URL
    public EventoDTO criarComUrl(EventoRequestDTO dto) {
        Administrador admin = buscarAdministrador(dto.getAdministradorId());

        Evento evento = new Evento();
        evento.setNome(dto.getNome());
        evento.setData(dto.getData());
        evento.setLocalizacao(dto.getLocalizacao());
        evento.setAdministrador(admin);
        evento.setImagemUrl(dto.getImagemUrl());
        evento.setImagem(null);

        return mapToDTO(eventoRepository.save(evento));
    }

    
    public List<EventoDTO> listarPorAdministrador(Long administradorId) {
        return eventoRepository.findByAdministradorId(administradorId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    
    public List<EventoDTO> listarTodos() {
        return eventoRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

  
    public EventoDTO atualizar(Long eventoId, EventoUpdateRequestDTO dto) {
        Evento evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new EntityNotFoundException("Evento não encontrado"));

        if (dto.getLocalizacao() != null) {
            evento.setLocalizacao(dto.getLocalizacao());
        }
        if (dto.getData() != null) {
            evento.setData(dto.getData());
        }

        return mapToDTO(eventoRepository.save(evento));
    }

  
    public void excluir(Long eventoId) {
        if (!eventoRepository.existsById(eventoId)) {
            throw new EntityNotFoundException("Evento não encontrado");
        }
        eventoRepository.deleteById(eventoId);
    }

    // Busca imagem em binário
    public byte[] buscarImagem(Long id) {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Evento não encontrado"));
        return evento.getImagem();
    }

    // Mapeia entidade para DTO
    private EventoDTO mapToDTO(Evento e) {
        String resolvedUrl = null;

        if (e.getImagemUrl() != null) {
            resolvedUrl = e.getImagemUrl();
        } else if (e.getImagem() != null) {
            resolvedUrl = "/eventos/" + e.getId() + "/imagem";
        }

        return new EventoDTO(
                e.getId(),
                e.getNome(),
                e.getData(),
                e.getLocalizacao(),
                resolvedUrl
        );
    }

    private Administrador buscarAdministrador(Long id) {
        return administradorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Administrador não encontrado"));
    }
}
