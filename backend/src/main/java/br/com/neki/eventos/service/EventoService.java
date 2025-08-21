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
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private AdministradorRepository administradorRepository;

    /**
     * Cria um novo evento associado a um administrador usando upload de imagem (salva binário no banco).
     */
    public EventoDTO criarComUpload(EventoRequestDTO dto, MultipartFile imagem) throws IOException {
        Administrador admin = administradorRepository.findById(dto.getAdministradorId())
                .orElseThrow(() -> new EntityNotFoundException("Administrador não encontrado"));

        Evento evento = new Evento();
        evento.setNome(dto.getNome());
        evento.setData(dto.getData());
        evento.setLocalizacao(dto.getLocalizacao());
        evento.setAdministrador(admin);

        if (imagem != null && !imagem.isEmpty()) {
            evento.setImagem(imagem.getBytes()); // salva apenas no banco
            evento.setImagemUrl(null);           // limpa URL
        }

        Evento salvo = eventoRepository.save(evento);
        return mapToDTO(salvo);
    }

    /**
     * Cria um novo evento associado a um administrador usando apenas uma URL.
     */
    public EventoDTO criarComUrl(EventoRequestDTO dto) {
        Administrador admin = administradorRepository.findById(dto.getAdministradorId())
                .orElseThrow(() -> new EntityNotFoundException("Administrador não encontrado"));

        Evento evento = new Evento();
        evento.setNome(dto.getNome());
        evento.setData(dto.getData());
        evento.setLocalizacao(dto.getLocalizacao());
        evento.setAdministrador(admin);

        evento.setImagemUrl(dto.getImagemUrl()); // salva só a URL
        evento.setImagem(null);                  // limpa binário

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
        String resolvedUrl = null;

        if (e.getImagemUrl() != null) {
            // Caso seja imagem externa
            resolvedUrl = e.getImagemUrl();
        } else if (e.getImagem() != null) {
            // Caso seja imagem em binário → o React precisa buscar via endpoint protegido
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

}
