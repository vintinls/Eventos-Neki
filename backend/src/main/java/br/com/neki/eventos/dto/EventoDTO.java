package br.com.neki.eventos.dto;

import java.time.LocalDateTime;

public class EventoDTO {

    private Long id;
    private String nome;
    private LocalDateTime data;
    private String localizacao;
    private String imagemUrl;

    public EventoDTO() {}

    public EventoDTO(Long id, String nome, LocalDateTime data, String localizacao, String imagemUrl) {
        this.id = id;
        this.nome = nome;
        this.data = data;
        this.localizacao = localizacao;
        this.imagemUrl = imagemUrl;
    }

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

    public String getImagemUrl() {
        return imagemUrl;
    }

    public void setImagemUrl(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }
}
