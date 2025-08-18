package br.com.neki.eventos.service;

import br.com.neki.eventos.dto.AdministradorDTO;
import br.com.neki.eventos.dto.AdministradorRequestDTO;
import br.com.neki.eventos.model.Administrador;
import br.com.neki.eventos.repository.AdministradorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdministradorService {

    @Autowired
    private AdministradorRepository administradorRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AdministradorDTO cadastrar(AdministradorRequestDTO dto) {
        Administrador admin = new Administrador();
        admin.setNome(dto.getNome());
        admin.setEmail(dto.getEmail());
        admin.setSenha(passwordEncoder.encode(dto.getSenha())); // senha criptografada

        Administrador salvo = administradorRepository.save(admin);

        return new AdministradorDTO(salvo.getId(), salvo.getNome(), salvo.getEmail());
    }

    public Optional<Administrador> buscarPorEmail(String email) {
        return administradorRepository.findByEmail(email);
    }
}
