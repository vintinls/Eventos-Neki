package br.com.neki.eventos.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CustomUserDetailsService userDetailsService; // injeção explícita

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String prefix = "Bearer ";

        String username = null;
        String jwt = null;

        // Verifica se veio o Authorization header
        if (authHeader != null && authHeader.startsWith(prefix)) {
            jwt = authHeader.substring(prefix.length());

            // Valida o token
            if (jwtService.isTokenValid(jwt)) {
                username = jwtService.extractUsername(jwt);
            } else {
                // Token inválido ou expirado → retorna 401 e encerra a request
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token inválido ou expirado");
                return;
            }
        }

        // Se o usuário foi extraído do token e ainda não está autenticado no contexto
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails user = userDetailsService.loadUserByUsername(username);

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // Define o usuário como autenticado no contexto do Spring
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        // Continua a cadeia de filtros
        chain.doFilter(request, response);
    }
}
