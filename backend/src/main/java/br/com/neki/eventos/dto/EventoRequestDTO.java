package br.com.neki.eventos.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

public class EventoRequestDTO {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @FutureOrPresent(message = "A data deve ser presente ou futura")
    private LocalDateTime data;

    @NotBlank(message = "Localização é obrigatória")
    private String localizacao;

    private MultipartFile imagem; // agora vem como arquivo multipart
    private Long administradorId;

    // Getters e Setters
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public LocalDateTime getData() { return data; }
    public void setData(LocalDateTime data) { this.data = data; }

    public String getLocalizacao() { return localizacao; }
    public void setLocalizacao(String localizacao) { this.localizacao = localizacao; }

    public MultipartFile getImagem() { return imagem; }
    public void setImagem(MultipartFile imagem) { this.imagem = imagem; }

    public Long getAdministradorId() { return administradorId; }
    public void setAdministradorId(Long administradorId) { this.administradorId = administradorId; }
}
