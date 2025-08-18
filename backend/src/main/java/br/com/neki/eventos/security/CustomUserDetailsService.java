package br.com.neki.eventos.security;

import br.com.neki.eventos.model.Administrador;
import br.com.neki.eventos.repository.AdministradorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AdministradorRepository administradorRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Administrador admin = administradorRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Administrador não encontrado: " + email));

        // Sem perfis/roles específicos por enquanto (ROLE_ADMIN default)
        return User.withUsername(admin.getEmail())
                .password(admin.getSenha())
                .roles("ADMIN")
                .build();
    }
}
