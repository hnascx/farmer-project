# Farmer Project

Este projeto é uma aplicação full-stack para gerenciamento de agricultores, construída com tecnologias modernas e boas práticas de desenvolvimento.

## 🚀 Tecnologias Utilizadas

### Frontend

- [Next.js 15](https://nextjs.org/) - Framework React com App Router
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first
- [shadcn/ui](https://ui.shadcn.com/) - Componentes React reutilizáveis
- [React Hook Form](https://react-hook-form.com/) - Gerenciamento de formulários
- [Zod](https://zod.dev/) - Validação de schemas

### Backend

- [NestJS](https://nestjs.com/) - Framework Node.js progressivo
- [MongoDB](https://www.mongodb.com/) - Banco de dados NoSQL
- [Zod](https://zod.dev/) - Validação de schemas
- [Vitest](https://vitest.dev/) - Framework de testes

### DevOps

- [Docker](https://www.docker.com/) - Containerização
- [Docker Compose](https://docs.docker.com/compose/) - Orquestração de containers

## 🔧 Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [pnpm](https://pnpm.io/) (v8 ou superior)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

## 🚀 Como Rodar o Projeto

1. Clone o repositório:

```bash
git clone https://github.com/hnascx/farmer-project.git
cd farmer-project
```

2. Inicie o MongoDB via Docker:

```bash
docker-compose up -d
```

3. Configure o Backend:

```bash
cd backend
cp .env.example # Copie o arquivo de exemplo e configure as variáveis
pnpm install
pnpm start:dev
```

4. Configure o Frontend:

```bash
cd frontend
cp .env.example # Copie o arquivo de exemplo e configure as variáveis
pnpm install
pnpm dev
```

5. Acesse a aplicação:

- Frontend: http://localhost:3000
- Backend: http://localhost:3333

## 📝 Variáveis de Ambiente

#### Backend (.env.local)

##### MongoDB

MONGODB_URI=mongodb://localhost:27017/farmer_db

#### Frontend (.env.local)

##### API

NEXT_PUBLIC_API_URL=http://localhost:3333

## 📚 Documentação da API

### Farmers

#### Listar Agricultores

```http
GET /farmers
```

Query Parameters:

- `page` (opcional): Número da página (default: 1)
- `limit` (opcional): Itens por página (default: 20)
- `search` (opcional): Busca por nome ou CPF

Resposta:

```json
{
  "farmers": [
    {
      "_id": "string",
      "fullName": "string",
      "cpf": "string",
      "birthDate": "string (YYYY-MM-DD)",
      "phone": "string",
      "active": "boolean",
      "createdAt": "string (ISO date)",
      "updatedAt": "string (ISO date)"
    }
  ],
  "total": "number",
  "page": "number",
  "totalPages": "number"
}
```

#### Criar Agricultor

```http
POST /farmers
```

Body:

```json
{
  "fullName": "string (min: 3 caracteres)",
  "cpf": "string (formato válido)",
  "birthDate": "string (YYYY-MM-DD) (opcional)",
  "phone": "string (com DDD) (opcional)",
  "active": "boolean (default: true)"
}
```

#### Buscar Agricultor por ID

```http
GET /farmers/:id
```

Parâmetros:

- `id`: ID do agricultor (MongoDB ObjectId)

Resposta:

```json
{
  "_id": "string",
  "fullName": "string",
  "cpf": "string",
  "birthDate": "string (YYYY-MM-DD)",
  "phone": "string",
  "active": "boolean",
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

#### Atualizar Agricultor

```http
PUT /farmers/:id/profile
```

Parâmetros:

- `id`: ID do agricultor (MongoDB ObjectId)

Body (todos os campos são opcionais):

```json
{
  "fullName": "string (min: 3 caracteres)",
  "birthDate": "string (YYYY-MM-DD)",
  "phone": "string (com DDD)",
  "active": "boolean"
}
```

#### Alternar Status do Agricultor

```http
PATCH /farmers/:id/status
```

Parâmetros:

- `id`: ID do agricultor (MongoDB ObjectId)

Resposta:

```json
{
  "_id": "string",
  "fullName": "string",
  "cpf": "string",
  "birthDate": "string (YYYY-MM-DD)",
  "phone": "string",
  "active": "boolean", // Status alternado (true -> false ou false -> true)
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

#### Deletar Agricultor

```http
DELETE /farmers/:id
```

Parâmetros:

- `id`: ID do agricultor (MongoDB ObjectId)

## 🔍 Considerações Adicionais

### Validações

- CPF: Validação do formato e dígitos verificadores
- Telefone: Formato brasileiro (com DDD)
- Data de Nascimento: Entre 01/01/1900 e a data atual
- Nome: Mínimo de 3 caracteres

### Segurança

- Validação de dados com Zod tanto no frontend quanto no backend
- Sanitização de inputs
- Rate limiting na API

### Performance

- Debounce nas buscas (500ms)
- Paginação server-side
- Otimização de imagens no frontend
- Lazy loading de componentes
- Busca otimizada por prefixo no MongoDB
- Cache de resultados de busca no frontend

### Interface

- Design responsivo (mobile-first)
- Layout adaptativo para desktop e mobile
- Suporte a temas claro/escuro
- Feedback visual para todas as ações
- Máscaras de input para CPF e telefone
- Filtros combinados (nome, CPF e status)

### Regras de Negócio

- CPF único por agricultor
- Apenas agricultores inativos podem ser excluídos
- Ordenação por data de criação (mais recentes primeiro)
- Busca por nome usa case-insensitive
- Busca parcial por CPF e nome (começo da string)

### Acessibilidade

- Suporte a temas claro/escuro
- Navegação por tab otimizada
- Mensagens de erro claras e descritivas
