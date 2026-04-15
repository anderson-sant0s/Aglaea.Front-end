# 🎨 Aglaea - Frontend

Frontend da plataforma **Aglaea**, uma aplicação para compartilhamento de projetos e interação entre usuários.

---

## 🚀 Tecnologias utilizadas

- Next.js 16
- React 19
- Apollo Client
- GraphQL
- TailwindCSS
- Radix UI
- TypeScript

---

## 📁 Estrutura do projeto

```
app/										→ Páginas da aplicação (App Router)
components/							→ Componentes reutilizáveis
hooks/									→ Hooks auxiliares
lib/
├── graphql/						→ Queries, mutations e hooks
├── adapters/						→ Transformação de dados
├── apollo-client.ts		→ Configuração do Apollo Client
├── providers.tsx				→ Provider global
├── search-context.tsx	→ Contexto de busca
public/									→ Arquivos estáticos
styles/									→ Estilos globais
```

---

## ⚙️ Instalação

Clone o projeto:

```bash
git clone https://github.com/anderson-sant0s/Aglaea.Front-end.git
cd Aglaea.Front-end-main
````

Instale as dependências:

```bash
npm install
```

---

## ▶️ Rodando o projeto

```bash
npm run dev
```

A aplicação estará disponível em:

```
http://localhost:3000
```

---

## 🔗 Backend

O frontend se conecta ao backend GraphQL em:

```
http://localhost:5000/graphql
```

Essa URL está definida diretamente em:

```
lib/apollo-client.ts
```

---

## 🔐 Autenticação

* O token JWT é salvo no `localStorage`
* Enviado automaticamente em todas as requisições GraphQL

Header utilizado:

```
Authorization: Bearer <token>
```
