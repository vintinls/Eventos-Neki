package br.com.neki.eventos.service;

import br.com.neki.eventos.dto.AdministradorDTO;
import br.com.neki.eventos.dto.AdministradorRequestDTO;
import br.com.neki.eventos.model.Administrador;
import br.com.neki.eventos.repository.AdministradorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdministradorService {

    @Autowired
    private AdministradorRepository administradorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Cadastra um novo administrador com senha criptografada.
     */
    public AdministradorDTO cadastrar(AdministradorRequestDTO dto) {
        if (administradorRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email já cadastrado");
        }

        Administrador admin = new Administrador();
        admin.setNome(dto.getNome());
        admin.setEmail(dto.getEmail());
        admin.setSenha(passwordEncoder.encode(dto.getSenha()));

        Administrador salvo = administradorRepository.save(admin);
        return mapToDTO(salvo);
    }

    /**
     * Busca administrador pelo e-mail.
     */
    public Optional<Administrador> buscarPorEmail(String email) {
        return administradorRepository.findByEmail(email);
    }

    /**
     * Busca administrador pelo e-mail, lançando exceção se não encontrar.
     */
    public Administrador buscarOuFalhar(String email) {
        return administradorRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Administrador não encontrado"));
    }

    /**
     * Verifica se a senha informada corresponde à senha criptografada.
     */
    public boolean checkPassword(String raw, String encoded) {
        return passwordEncoder.matches(raw, encoded);
    }

    /**
     * Converte entidade para DTO.
     */
    private AdministradorDTO mapToDTO(Administrador admin) {
        return new AdministradorDTO(admin.getId(), admin.getNome(), admin.getEmail());
    }
}
