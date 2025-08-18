package br.com.neki.eventos.service;

import br.com.neki.eventos.dto.EventoDTO;
import br.com.neki.eventos.dto.EventoRequestDTO;
import br.com.neki.eventos.dto.EventoUpdateRequestDTO;
import br.com.neki.eventos.model.Administrador;
import br.com.neki.eventos.model.Evento;
import br.com.neki.eventos.repository.AdministradorRepository;
import br.com.neki.eventos.repository.EventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private AdministradorRepository administradorRepository;

    public EventoDTO criar(EventoRequestDTO dto) {
        Administrador admin = administradorRepository.findById(dto.getAdministradorId())
                .orElseThrow(() -> new RuntimeException("Administrador não encontrado"));

        Evento evento = new Evento();
        evento.setNome(dto.getNome());
        evento.setData(dto.getData());
        evento.setLocalizacao(dto.getLocalizacao());
        evento.setImagem(dto.getImagem());
        evento.setAdministrador(admin);

        Evento salvo = eventoRepository.save(evento);
        return mapToDTO(salvo);
    }

    public List<EventoDTO> listarPorAdministrador(Long administradorId) {
        return eventoRepository.findByAdministradorId(administradorId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public EventoDTO atualizar(Long eventoId, EventoUpdateRequestDTO dto) {
        Evento evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));

        if (dto.getLocalizacao() != null) {
            evento.setLocalizacao(dto.getLocalizacao());
        }
        if (dto.getData() != null) {
            evento.setData(dto.getData());
        }

        Evento atualizado = eventoRepository.save(evento);
        return mapToDTO(atualizado);
    }

    public void excluir(Long eventoId) {
        if (!eventoRepository.existsById(eventoId)) {
            throw new RuntimeException("Evento não encontrado");
        }
        eventoRepository.deleteById(eventoId);
    }

    private EventoDTO mapToDTO(Evento e) {
        return new EventoDTO(e.getId(), e.getNome(), e.getData(), e.getLocalizacao(), e.getImagem());
    }
}
