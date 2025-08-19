package br.com.neki.eventos.controller;

import br.com.neki.eventos.dto.AdministradorDTO;
import br.com.neki.eventos.model.Administrador;
import br.com.neki.eventos.service.AdministradorService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@Tag(name = "Administrador", description = "Operações com administrador autenticado")
public class AdministradorController {

    @Autowired
    private AdministradorService administradorService;

    /**
     * Retorna dados do Administrador logado
     */
    @GetMapping("/me")
    public ResponseEntity<AdministradorDTO> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("Não autenticado");
        }

        String email = authentication.getName();
        Administrador administrador = administradorService.buscarOuFalhar(email);

        AdministradorDTO dto = new AdministradorDTO(
                administrador.getId(),
                administrador.getNome(),
                administrador.getEmail()
        );
        return ResponseEntity.ok(dto);
    }
}
