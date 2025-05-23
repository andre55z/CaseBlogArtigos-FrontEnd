# 🖼️ Blog Frontend

Este é o **frontend** da aplicação de blog desenvolvida com **Vite + React + TypeScript**, conectada a uma API REST construída com Node.js e Express. A interface foi baseada em um modelo do Figma.

## 🚀 Tecnologias Utilizadas

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Axios](https://axios-http.com/)
- [React Router DOM](https://reactrouter.com/)
- JWT (armazenado via `localStorage`)

## 🔐 Funcionalidades

- Login de usuário com autenticação JWT
- Validação de login com mensagens de erro
- Integração com backend (cadastro, login, criação de post)
- Upload de imagem (armazenada no backend)
- Páginas protegidas com verificação de token
- Consumo e exibição de dados da API
- Interface moderna baseada em layout do Figma

## 📁 Estrutura de Pastas
src/
├── components/ # Componentes reutilizáveis (ex: Input, CardPost)
├── pages/ # Páginas (Login, Home, CriarPost, etc)
├── services/ # Configuração do Axios e chamadas de API
├── App.tsx # Configuração de rotas
├── main.tsx # Entrada principal da aplicação
