# MuttiFlow

Projeto full-stack simples com backend em Node.js/Express e frontend em React (Vite).

## Sobre

MuttiFlow é uma aplicação exemplo que demonstra uma arquitetura com backend REST em Node.js (Express) e frontend em React usando Vite. O backend conecta-se a um banco PostgreSQL.

## Estrutura do repositório

- `backend/` — API Node.js/Express, configurações e rotas
- `frontend/` — aplicação React com Vite
- `docs/` — documentação adicional

## Tecnologias

- Backend: Node.js, Express, pg (Postgres)
- Frontend: React, Vite
- Dev: nodemon, eslint, tailwindcss (opcional)

## Pré-requisitos

- Node.js (>=18 recomendado)
- npm (ou pnpm/yarn conforme preferência)
- PostgreSQL (se for usar persistência)

## Configuração e execução

1) Backend

```bash
cd backend
npm install
# criar a configuração local a partir do exemplo
cp .env.example .env
# criar a tabela de usuários (com o banco muttiflow já criado)
psql -U postgres -d muttiflow -f database/init.sql
npm run dev
```

O backend por padrão executa `src/app.js` com `nodemon` no script `dev`.

2) Frontend

```bash
cd frontend
npm install
npm run dev
```

O Vite roda normalmente em http://localhost:5173 — abra no navegador.

## Variáveis de ambiente (exemplo)

- `DATABASE_URL` — string de conexão do Postgres (ou usar `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGPORT`)
- `PORT` — porta em que o backend irá escutar (padrão 3000 se não definido)

Crie um arquivo `.env` em `backend/` com as variáveis necessárias antes de rodar em desenvolvimento.

Para o frontend, opcionalmente copie `frontend/.env.example` para `frontend/.env` se a API não estiver em `http://localhost:3000`.

## Autenticação

- `POST /auth/cadastro` cria a conta, valida os campos e não permite e-mails duplicados.
- `POST /auth/login` valida as credenciais e devolve um token JWT válido por 8 horas.
- O frontend salva a sessão no navegador e bloqueia o acesso direto a `/dashboard` sem login.

## Scripts úteis

- Backend
	- `npm run dev` — inicia o servidor em modo desenvolvedor (nodemon)
	- `npm test` — placeholder (se houver testes, configure aqui)
- Frontend
	- `npm run dev` — inicia Vite
	- `npm run build` — gera build de produção
	- `npm run preview` — preview do build

## Banco de dados

Crie o banco Postgres localmente e configure as variáveis de ambiente antes de iniciar o backend. Não há migrations automáticas incluídas neste repositório por padrão — adicione sua ferramenta de migrations (por exemplo, `knex`, `sequelize` ou `prisma`) se desejar.

## Contribuição

1. Abra uma issue descrevendo a mudança ou bug.
2. Faça um fork e uma branch de feature/bugfix.
3. Envie um pull request com descrição clara das alterações.

## Licença

Projeto sem licença especificada — adicione um `LICENSE` se quiser torná-lo público.

---
Se quiser, preparo um `README` mais detalhado (ex.: exemplos de endpoints, arquivo `.env.example`, instruções de deploy ou scripts de database). Diga o que prefere.
