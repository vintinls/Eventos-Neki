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

import java.io.IOException;
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
     * Cria um novo evento associado a um administrador.
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

        if (dto.getImagem() != null && !dto.getImagem().isEmpty()) {
            evento.setImagem(dto.getImagem().getBytes()); // converte MultipartFile para byte[]
        }

        evento.setAdministrador(admin);

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
     * Converte entidade para DTO.
     */
    private EventoDTO mapToDTO(Evento e) {
        // O construtor do EventoDTO já converte byte[] em Base64
        return new EventoDTO(
                e.getId(),
                e.getNome(),
                e.getData(),
                e.getLocalizacao(),
                e.getImagem()
        );
    }

    public byte[] buscarImagem(Long id) {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Evento não encontrado"));
        return evento.getImagem();
    }
}
