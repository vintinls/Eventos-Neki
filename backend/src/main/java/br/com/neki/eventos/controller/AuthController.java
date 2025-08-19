package br.com.neki.eventos.controller;

import br.com.neki.eventos.dto.AdministradorDTO;
import br.com.neki.eventos.dto.AdministradorRequestDTO;
import br.com.neki.eventos.dto.LoginRequestDTO;
import br.com.neki.eventos.dto.LoginResponseDTO;
import br.com.neki.eventos.model.Administrador;
import br.com.neki.eventos.security.JwtService;
import br.com.neki.eventos.service.AdministradorService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticação", description = "Cadastro e login de administrador")
public class AuthController {

    @Autowired
    private AdministradorService administradorService;

    @Autowired
    private JwtService jwtService;

    @Value("${app.jwt.expiration:86400000}") // pega do application.properties
    private long jwtExpirationMs;

    /**
     * Cadastro de Administrador
     */
    @PostMapping("/register")
    public ResponseEntity<AdministradorDTO> register(@Valid @RequestBody AdministradorRequestDTO dto) {
        AdministradorDTO criado = administradorService.cadastrar(dto);
        return ResponseEntity.ok(criado);
    }

    /**
     * Login do Administrador
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        Administrador admin = administradorService.buscarPorEmail(dto.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("Administrador não encontrado"));

        if (!administradorService.checkPassword(dto.getSenha(), admin.getSenha())) {
            throw new IllegalArgumentException("Credenciais inválidas");
        }

        String token = jwtService.generateToken(admin.getEmail());
        AdministradorDTO adminDTO = new AdministradorDTO(admin.getId(), admin.getNome(), admin.getEmail());

        return ResponseEntity.ok(new LoginResponseDTO(token, adminDTO, jwtExpirationMs));
    }
}
