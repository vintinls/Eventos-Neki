package br.com.neki.eventos.dto;

public class LoginResponseDTO {
    private String token;
    private AdministradorDTO administrador;
    private Long expiresIn; // tempo de expiração em milissegundos

    public LoginResponseDTO() {}

    public LoginResponseDTO(String token, AdministradorDTO administrador, Long expiresIn) {
        this.token = token;
        this.administrador = administrador;
        this.expiresIn = expiresIn;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public AdministradorDTO getAdministrador() { return administrador; }
    public void setAdministrador(AdministradorDTO administrador) { this.administrador = administrador; }

    public Long getExpiresIn() { return expiresIn; }
    public void setExpiresIn(Long expiresIn) { this.expiresIn = expiresIn; }
}
