# NLW Agents - Backend API

Este projeto foi desenvolvido durante o evento **NLW (Next Level Week)** da [Rocketseat](https://rocketseat.com.br/), focando na criação de uma API robusta para gerenciamento de agentes inteligentes, salas e perguntas.

## 🚀 Tecnologias Utilizadas

### Core Framework
- **[Fastify](https://fastify.dev/)** - Framework web ultra-rápido e eficiente para Node.js
- **[fastify-type-provider-zod](https://github.com/turkerdev/fastify-type-provider-zod)** - Provider de tipagem para Fastify usando Zod
- **[@fastify/cors](https://github.com/fastify/fastify-cors)** - Plugin CORS para Fastify

### Banco de Dados & ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[pgvector](https://github.com/pgvector/pgvector)** - Extensão PostgreSQL para vetores (Docker image: `pgvector/pgvector:pg17`)
- **[Drizzle ORM](https://orm.drizzle.team/)** - ORM type-safe para TypeScript
- **[drizzle-kit](https://orm.drizzle.team/kit-docs/overview)** - CLI para migrations e gerenciamento do schema
- **[postgres](https://github.com/porsager/postgres)** - Driver PostgreSQL para Node.js

### Validação e Tipagem
- **[Zod](https://zod.dev/)** - Schema validation e type inference
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado do JavaScript

### Qualidade de Código
- **[Biome](https://biomejs.dev/)** - Linter e formatter ultra-rápido
- **[Ultracite](https://github.com/dimitarnestorov/ultracite)** - Configuração de regras de código avançadas

### Containerização
- **[Docker](https://www.docker.com/)** & **Docker Compose** - Containerização do banco de dados

## 🏗️ Arquitetura e Padrões

### Estrutura de Pastas
```
src/
├── db/                    # Configurações de banco de dados
│   ├── connection.ts      # Conexão com PostgreSQL
│   ├── seed.ts           # Scripts de seeding
│   ├── migrations/       # Migrations do Drizzle
│   └── schema/           # Schemas das tabelas
│       ├── index.ts
│       ├── questions.ts
│       └── rooms.ts
├── http/
│   └── routes/           # Rotas da API
│       ├── create-question.ts
│       ├── create-room.ts
│       ├── get-rooms-questions.ts
│       └── get-rooms.ts
├── env.ts                # Validação de variáveis de ambiente
└── server.ts             # Configuração principal do servidor
```

### Padrões Implementados
- **Type Safety**: Uso extensivo do TypeScript com Zod para validação runtime
- **Plugin Architecture**: Utilização do sistema de plugins do Fastify
- **Schema-First**: Definição de schemas usando Drizzle ORM
- **Environment Validation**: Validação rigorosa de variáveis de ambiente
- **Code Quality**: Linting e formatting automatizados com Biome

## ⚙️ Setup e Configuração

### Pré-requisitos
- Node.js 20+ 
- Docker e Docker Compose
- PostgreSQL (via Docker)

### 1. Clone o Repositório
```bash
git clone <repository-url>
cd nlw-agents/server
```

### 2. Instalação das Dependências
```bash
npm install
```

### 3. Configuração do Ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
PORT=3333
DATABASE_URL=postgresql://docker:docker@localhost:5432/agents
```

### 4. Subir o Banco de Dados (Docker)
```bash
docker-compose up -d
```

### 5. Executar Migrations
```bash
npm run db:migrate
```

### 6. Executar Seed (Opcional)
```bash
npm run db:seed
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento (watch mode)
npm run dev

# Produção
npm start

# Banco de Dados
npm run db:generate    # Gerar migrations
npm run db:migrate     # Executar migrations
npm run db:seed        # Executar seed
npm run db:studio      # Abrir Drizzle Studio
```

## 📡 API Endpoints

A API estará disponível em `http://localhost:3333` com os seguintes endpoints:

- `GET /health` - Health check
- `GET /rooms` - Listar salas
- `POST /rooms` - Criar nova sala
- `GET /rooms/:id/questions` - Listar perguntas de uma sala
- `POST /rooms/:id/questions` - Criar pergunta em uma sala

## 🗄️ Schema do Banco de Dados

### Tabela: rooms
```sql
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### Tabela: questions
```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

## 🐳 Docker

O projeto utiliza Docker Compose para subir uma instância do PostgreSQL com a extensão pgvector:

```yaml
services:
  nlw-agents-pg:
    image: pgvector/pgvector:pg17
    environment:
      POSTGRES_USER: docker
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: agents
    ports:
      - "5432:5432"
```

## 🔍 Monitoramento

- **Drizzle Studio**: Execute `npm run db:studio` para abrir uma interface visual do banco de dados
- **Health Check**: Endpoint `/health` para verificar status da API

## 📝 Convenções de Código

O projeto utiliza configurações rigorosas de linting através do Biome e Ultracite, seguindo:
- Padrões de acessibilidade (ARIA, semântica HTML)
- Best practices do TypeScript/JavaScript
- Convenções de naming e estrutura
- Regras de performance e segurança

---

**Desenvolvido durante o NLW da Rocketseat** 🚀
