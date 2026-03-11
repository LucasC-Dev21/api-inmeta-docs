# API de Gerenciamento de Documentação de Colaboradores

API responsável pelo gerenciamento de colaboradores e seus documentos obrigatórios. Permite cadastrar colaboradores, definir tipos de documentos, vincular documentos obrigatórios e armazenar os arquivos enviados.

## Tecnologias

- **NestJS** – estrutura da API
- **TypeScript** – tipagem e organização do código
- **Prisma ORM** – acesso e gerenciamento do banco
- **PostgreSQL** – banco de dados relacional
- **Docker** – para subir o banco facilmente

---

## Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar arquivo de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=postgresql://inmeta:inmeta@localhost:5433/inmeta?schema=public
PORT=3000
```

### 3. Subir o banco de dados

O projeto utiliza Docker para iniciar o PostgreSQL:

```bash
docker-compose up -d
```

### 4. Rodar migrations e gerar o client do Prisma

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Iniciar a aplicação

```bash
npm run start:dev
```

A API ficará disponível em: `http://localhost:3000`

---

## Estrutura da API

A API é organizada em quatro domínios principais:

- **Collaborators** – gerenciamento de colaboradores
- **Document Types** – tipos de documentos exigidos
- **Documents** – documentos enviados pelos colaboradores
- **Statistics** – estatísticas gerais

---

## Rotas

### Colaboradores

Gerencia o cadastro de colaboradores.

```
POST   /collaborators
Body: { name, email }

GET    /collaborators

GET    /collaborators/:id

PATCH  /collaborators/:id
Body: { name?, email? }

DELETE /collaborators/:id
```

---

### Tipos de Documento

Define quais tipos de documentos podem existir no sistema.

```
POST   /document-types
Body: { name, description? }

GET    /document-types

GET    /document-types/:id

PATCH  /document-types/:id
Body: { name?, description? }

DELETE /document-types/:id
```

---

### Vinculação de Documento ao Colaborador

Permite definir quais documentos são obrigatórios para um colaborador.

```
POST   /collaborators/:collaboratorId/document-types/:documentTypeId

DELETE /collaborators/:collaboratorId/document-types/:documentTypeId
```

---

### Documentos

Upload e consulta de documentos enviados pelos colaboradores.

```
POST /collaborators/:collaboratorId/documents
```

Body:

```json
{
  "documentTypeId": "uuid",
  "fileName": "string",
  "filePath": "string",
  "mimeType": "string (opcional)"
}
```

Buscar documento por tipo:

```
GET /collaborators/:collaboratorId/documents/:documentTypeId
```

---

### Documentos Pendentes

Lista documentos obrigatórios que ainda não foram enviados.

```
GET /documents/pending
```

Query params disponíveis:

| Parâmetro        | Tipo   | Descrição                     |
| ---------------- | ------ | ----------------------------- |
| `collaboratorId` | uuid   | Filtra por colaborador        |
| `documentTypeId` | uuid   | Filtra por tipo de documento  |
| `page`           | number | Página (padrão: 1)            |
| `limit`          | number | Itens por página (padrão: 10) |

Exemplo:

```
GET /documents/pending?collaboratorId=uuid&documentTypeId=uuid&page=1&limit=10
```

---

### Estatísticas

Retorna métricas gerais do sistema.

```
GET /statistics
```

---

## Deploy

O projeto conta com um workflow de CI/CD em `.github/workflows/deploy.yml` que, ao fazer merge de um PR na branch `production`, executa os testes automaticamente e realiza o deploy na VPS via SSH usando PM2.

> **Atenção:** esse arquivo de deploy não foi validado em ambiente real. Ele foi montado com auxílio de IA, inspirado em um workflow de deploy que eu utilizo em outros projetos em produção.

---

## Testes

Para rodar os testes automatizados:

```bash
npm run test
```
