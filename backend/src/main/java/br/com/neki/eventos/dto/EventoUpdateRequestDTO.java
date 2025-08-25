package br.com.neki.eventos.dto;

import java.time.LocalDateTime;

public class EventoUpdateRequestDTO {
    private LocalDateTime data;
    private String localizacao;

    public EventoUpdateRequestDTO() {}

    public EventoUpdateRequestDTO(LocalDateTime data, String localizacao) {
        this.data = data;
        this.localizacao = localizacao;
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
}
