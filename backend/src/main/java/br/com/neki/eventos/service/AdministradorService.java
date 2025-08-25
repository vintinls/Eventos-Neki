package br.com.neki.eventos.service;

import br.com.neki.eventos.dto.AdministradorDTO;
import br.com.neki.eventos.dto.AdministradorRequestDTO;
import br.com.neki.eventos.exception.EmailJaCadastradoException;
import br.com.neki.eventos.model.Administrador;
import br.com.neki.eventos.repository.AdministradorRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdministradorService {

    private final AdministradorRepository administradorRepository;
    private final PasswordEncoder passwordEncoder;

    public AdministradorService(AdministradorRepository administradorRepository,
                                PasswordEncoder passwordEncoder) {
        this.administradorRepository = administradorRepository;
        this.passwordEncoder = passwordEncoder;
    }

   
    public AdministradorDTO cadastrar(AdministradorRequestDTO dto) {
        if (administradorRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new EmailJaCadastradoException("Já existe uma conta com esse e-mail.");
        }

        Administrador admin = new Administrador();
        admin.setNome(dto.getNome());
        admin.setEmail(dto.getEmail());
        admin.setSenha(passwordEncoder.encode(dto.getSenha()));

        Administrador salvo = administradorRepository.save(admin);
        return new AdministradorDTO(salvo.getId(), salvo.getNome(), salvo.getEmail());
    }

    
    public Optional<Administrador> buscarPorEmail(String email) {
        return administradorRepository.findByEmail(email);
    }

    // Verifica senha fornecida com a senha criptografada
    public boolean checkPassword(String raw, String encoded) {
        return passwordEncoder.matches(raw, encoded);
    }
}
