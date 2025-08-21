package br.com.neki.eventos.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class EventoRequestDTO {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    private LocalDateTime data;

    @NotBlank(message = "Localização é obrigatória")
    private String localizacao;

    private Long administradorId;

    private String imagemUrl; // usado quando o evento for criado via URL

    // Getters e Setters
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public LocalDateTime getData() { return data; }
    public void setData(LocalDateTime data) { this.data = data; }

    public String getLocalizacao() { return localizacao; }
    public void setLocalizacao(String localizacao) { this.localizacao = localizacao; }

    public Long getAdministradorId() { return administradorId; }
    public void setAdministradorId(Long administradorId) { this.administradorId = administradorId; }

    public String getImagemUrl() { return imagemUrl; }
    public void setImagemUrl(String imagemUrl) { this.imagemUrl = imagemUrl; }
}
