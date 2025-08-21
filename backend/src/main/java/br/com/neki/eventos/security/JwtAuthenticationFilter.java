package br.com.neki.eventos.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String prefix = "Bearer ";

        String username = null;
        String jwt = null;

        // Verifica se o header Authorization contém o token JWT
        if (authHeader != null && authHeader.startsWith(prefix)) {
            jwt = authHeader.substring(prefix.length());

            try {
                if (jwtService.isTokenValid(jwt)) {
                    username = jwtService.extractUsername(jwt);
                } else {
                    logger.warn("Token JWT inválido para request: " + request.getRequestURI());
                }
            } catch (Exception e) {
                logger.error("Erro ao validar JWT: " + e.getMessage());
            }
        }

        // Se encontrou um usuário no token e não há autenticação no contexto, autentica
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails user = userDetailsService.loadUserByUsername(username);

            if (user != null) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);
                logger.info("Usuário autenticado: " + username + " para " + request.getRequestURI());
            }
        }

        // Continua a cadeia de filtros
        chain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();

        // Ignora autenticação para endpoints públicos
        return path.startsWith("/auth") ||
               path.startsWith("/swagger") ||
               path.startsWith("/v3/api-docs") ||
               request.getMethod().equalsIgnoreCase("OPTIONS"); // ignora preflight CORS
    }
}
