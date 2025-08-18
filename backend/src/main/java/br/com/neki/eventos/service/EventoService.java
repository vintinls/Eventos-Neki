package br.com.neki.eventos.service;

import br.com.neki.eventos.dto.EventoDTO;
import br.com.neki.eventos.dto.EventoRequestDTO;
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

        return new EventoDTO(salvo.getId(), salvo.getNome(), salvo.getData(), salvo.getLocalizacao(), salvo.getImagem());
    }

    public List<EventoDTO> listarPorAdministrador(Long administradorId) {
        return eventoRepository.findByAdministradorId(administradorId)
                .stream()
                .map(e -> new EventoDTO(e.getId(), e.getNome(), e.getData(), e.getLocalizacao(), e.getImagem()))
                .collect(Collectors.toList());
    }

    public EventoDTO atualizar(Long eventoId, String novaLocalizacao, String novaData) {
        Evento evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));

        if (novaLocalizacao != null) {
            evento.setLocalizacao(novaLocalizacao);
        }
        if (novaData != null) {
            evento.setData(java.time.LocalDateTime.parse(novaData));
        }

        Evento atualizado = eventoRepository.save(evento);

        return new EventoDTO(atualizado.getId(), atualizado.getNome(), atualizado.getData(), atualizado.getLocalizacao(), atualizado.getImagem());
    }

    public void excluir(Long eventoId) {
        if (!eventoRepository.existsById(eventoId)) {
            throw new RuntimeException("Evento não encontrado");
        }
        eventoRepository.deleteById(eventoId);
    }
}
