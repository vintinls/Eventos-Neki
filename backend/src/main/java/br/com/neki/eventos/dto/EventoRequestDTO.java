package br.com.neki.eventos.dto;

import java.time.LocalDateTime;

public class EventoRequestDTO {
    private String nome;
    private LocalDateTime data;
    private String localizacao;
    private String imagem;
    private Long administradorId;

    // Getters e Setters
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }

    public LocalDateTime getData() {
        return data;
    }
    public void setData(LocalDateTime data) {
        this.data = data;
    }

    public String getLocalizacao() {
        return localizacao;
    }
    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }

    public String getImagem() {
        return imagem;
    }
    public void setImagem(String imagem) {
        this.imagem = imagem;
    }

    public Long getAdministradorId() {
        return administradorId;
    }
    public void setAdministradorId(Long administradorId) {
        this.administradorId = administradorId;
    }
}
