package br.com.neki.eventos.security;

import br.com.neki.eventos.model.Administrador;
import br.com.neki.eventos.repository.AdministradorRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AdministradorRepository administradorRepository;

    public CustomUserDetailsService(AdministradorRepository administradorRepository) {
        this.administradorRepository = administradorRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Administrador admin = administradorRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Administrador não encontrado: " + email));

        return User.withUsername(admin.getEmail())
                .password(admin.getSenha())
                .roles("ADMIN")
                .build();
    }
}
