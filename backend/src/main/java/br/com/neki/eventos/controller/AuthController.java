package br.com.neki.eventos.controller;

import br.com.neki.eventos.dto.*;
import br.com.neki.eventos.model.Administrador;
import br.com.neki.eventos.security.JwtService;
import br.com.neki.eventos.service.AdministradorService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticação", description = "Cadastro e login de administrador")
public class AuthController {

    @Autowired
    private AdministradorService administradorService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<AdministradorDTO> register(@RequestBody AdministradorRequestDTO dto) {
        AdministradorDTO criado = administradorService.cadastrar(dto);
        return ResponseEntity.ok(criado);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO dto) {
        Administrador admin = administradorService.buscarPorEmail(dto.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Credenciais inválidas"));

        if (!administradorService.checkPassword(dto.getSenha(), admin.getSenha())) {
            throw new UsernameNotFoundException("Credenciais inválidas");
        }

        String token = jwtService.generateToken(admin.getEmail());
        AdministradorDTO adminDTO = new AdministradorDTO(admin.getId(), admin.getNome(), admin.getEmail());

        return ResponseEntity.ok(new LoginResponseDTO(token, adminDTO));
    }
}
