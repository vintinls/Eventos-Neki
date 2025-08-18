package br.com.neki.eventos.dto;

import java.time.LocalDateTime;

public class EventoDTO {
    private Long id;
    private String nome;
    private LocalDateTime data;
    private String localizacao;
    private String imagem;

    public EventoDTO() {}

    public EventoDTO(Long id, String nome, LocalDateTime data, String localizacao, String imagem) {
        this.id = id;
        this.nome = nome;
        this.data = data;
        this.localizacao = localizacao;
        this.imagem = imagem;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

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
}
