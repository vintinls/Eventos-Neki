# 📅 Gerenciador de Eventos – Neki

Sistema completo para **gestão de eventos**, desenvolvido como parte do **Desafio 2025**.  
O projeto contempla **frontend web (React)**, **aplicativo mobile (React Native/Expo)** e **backend (Spring Boot)**, com autenticação via **JWT** e documentação por **Swagger**.

---

## 🚀 Tecnologias Utilizadas

### Backend – Spring Boot
- **Java 23 + Spring Boot 3**
- **Spring Security + JWT** para autenticação
- **Spring Data JPA + Hibernate** para persistência
- **PostgreSQL** como banco de dados
- **Swagger/OpenAPI** para documentação
- **Maven** para gerenciamento de dependências

### Frontend Web – React
- **React + Vite + TypeScript**
- **Axios** para comunicação com a API
- **React Router DOM** para navegação
- **TailwindCSS** para estilização

### Mobile – React Native (Expo)
- **React Native + Expo + TypeScript**
- **AsyncStorage** para persistência de sessão
- **React Navigation (Stack)** para navegação
- **React Hook Form** para formulários
- **Axios** com interceptor JWT

---

## 📱 Funcionalidades

### 🔑 Autenticação
- Login de administrador com email e senha  
- Cadastro de administrador com validação de senha  
- Persistência de sessão (opção "lembrar senha")  

### 📋 Eventos
- Listagem de eventos do administrador autenticado
- Criação de evento (nome, data, localização e imagem via URL ou upload)
- Edição de evento (data e localização)
- Exclusão de evento
- Paginação de eventos
- Upload e exibição de imagens (armazenamento no servidor)

### ⚙️ Requisitos Extras
- Segurança **JWT** em todos os endpoints (exceto login)
- Documentação automática da API via **Swagger**
- Boas práticas RESTful

---

## 📂 Estrutura do Projeto

```bash
.
├── backend/        # API em Spring Boot
│   ├── src/main/java/br/com/neki/eventos
│   ├── src/main/resources
│   └── pom.xml
├── frontend/       # Interface web em React
│   ├── src
│   ├── public
│   └── package.json
└── mobile/         # Aplicativo mobile em React Native (Expo)
    ├── src
    ├── assets
    └── app.json
