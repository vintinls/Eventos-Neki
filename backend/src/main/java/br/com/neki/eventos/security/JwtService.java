package br.com.neki.eventos.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    @Value("${app.jwt.secret:default-default-default-default-default}")
    private String jwtSecret;

    @Value("${app.jwt.expiration:86400000}")
    private long jwtExpirationMs;

    @PostConstruct
    public void logKeyInfo() {
        int len = jwtSecret.getBytes(StandardCharsets.UTF_8).length;
        String start = jwtSecret.length() >= 4 ? jwtSecret.substring(0, 4) : jwtSecret;
        String end = jwtSecret.length() >= 4 ? jwtSecret.substring(jwtSecret.length() - 4) : jwtSecret;
        System.out.println("🔐 JWT secret bytes=" + len + " (startsWith='" + start + "', endsWith='" + end + "')");
        if (len < 32) {
            System.out.println("⚠️ ATENÇÃO: secret precisa ter >= 32 bytes para HS256.");
        }
    }

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String subjectEmail) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(subjectEmail)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return parseAllClaims(token).getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            parseAllClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            System.out.println("❌ Token inválido: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            return false;
        }
    }

    private Claims parseAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
