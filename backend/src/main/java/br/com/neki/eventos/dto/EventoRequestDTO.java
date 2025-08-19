package br.com.neki.eventos.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class EventoRequestDTO {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @FutureOrPresent(message = "A data deve ser presente ou futura")
    private LocalDateTime data;

    @NotBlank(message = "Localização é obrigatória")
    private String localizacao;

    private String imagem; // URL da imagem (ou caminho salvo em /uploads)

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
}
