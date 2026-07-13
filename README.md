# MuttiFlow

MuttiFlow é um projeto full-stack para uma experiência de pedidos de comida, com API em Node.js/Express, banco PostgreSQL e duas interfaces React:

- `cliente/`: vitrine pública, cardápio, produto, carrinho e checkout visual.
- `frontend/`: painel administrativo com login, dashboard, pedidos, eventos e custos de receitas.
- `backend/`: API REST, autenticação, carrinho e conexão com PostgreSQL.

## Estado Atual

Funcional no backend:

- `GET /health`
- `POST /auth/cadastro`
- `POST /auth/login`
- `GET /carrinho`
- `POST /carrinho/itens`
- `PATCH /carrinho/itens/:id`
- `DELETE /carrinho/itens/:id`
- `DELETE /carrinho`
- `POST /pedidos`
- `GET /pedidos` (autenticado)
- `PATCH /pedidos/:id/status` (autenticado)
- `PATCH /pedidos/:id/pagamento` (autenticado)
- `DELETE /pedidos/:id` (autenticado)
- `POST /eventos`
- `GET /eventos` (autenticado)
- `PATCH /eventos/:id/status` (autenticado)
- `DELETE /eventos/:id` (autenticado)
- `GET /dashboard` (autenticado)

## Tecnologias

Backend:

- Node.js
- Express 5
- PostgreSQL
- `pg`
- `bcrypt`
- `jsonwebtoken`
- `cors`
- `helmet`
- `morgan`
- `dotenv`
- `nodemon`

Cliente:

- React 19
- Vite
- React Router
- React Icons
- Oxlint

Painel admin:

- React 19
- Vite
- React Router
- Axios
- ESLint
- Tailwind/PostCSS disponíveis nas dependências

## Estrutura

```text
MuttiFlow/
  backend/
    src/
      app.js
      server.js
      config/
      controllers/
      database/
      middlewares/
      models/
      routes/
      services/
      utils/
  cliente/
    src/
      components/
      data/
      pages/
      services/
  frontend/
    src/
      components/
      pages/
      services/
```

## Pré-Requisitos

- Node.js 18 ou superior
- npm
- PostgreSQL instalado e rodando
- Banco local chamado `muttiflow`

## Instalação

Instale as dependências de cada parte:

```bash
cd backend
npm install
```

```bash
cd ../cliente
npm install
```

```bash
cd ../frontend
npm install
```

## Configuração Do Backend

O backend lê variáveis de ambiente em `backend/.env`.

Exemplo:

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=8846
DB_NAME=muttiflow
DB_CONNECTION_TIMEOUT_MS=5000
JWT_SECRET=muttiflow-secret
```

Valores padrão usados pelo código se o `.env` não tiver alguma variável:

- `DB_HOST`: `127.0.0.1`
- `DB_PORT`: `5432`
- `DB_USER`: `postgres`
- `DB_PASSWORD`: `8846`
- `DB_NAME`: `muttiflow`
- `DB_CONNECTION_TIMEOUT_MS`: `5000`
- `PORT`: `3000`
- `JWT_SECRET`: `muttiflow-secret`

## Banco De Dados

Crie o banco:

```bash
sudo -u postgres createdb muttiflow
```

Se o banco já existir, esse comando pode avisar erro de banco duplicado. Nesse caso, siga para o próximo passo.

O backend aplica o schema automaticamente antes de começar a escutar a porta. Para aplicar manualmente:

```bash
cd backend
sudo -u postgres psql -d muttiflow -f src/database/init.sql
```

Se estiver usando senha TCP em vez de `sudo -u postgres`:

```bash
cd backend
PGPASSWORD=8846 psql -h 127.0.0.1 -U postgres -d muttiflow -f src/database/init.sql
```

O arquivo `backend/src/database/init.sql` cria:

- `categorias`
- `produtos` e os seis produtos iniciais
- `usuarios`
- `carrinhos`
- `carrinho_itens`
- `pedidos`
- `pedido_itens`
- `eventos`

## Rodando O Projeto

Terminal 1, backend:

```bash
cd backend
npm run dev
```

O backend roda em:

```text
http://localhost:3000
```

Terminal 2, cliente público:

```bash
cd cliente
npm run dev
```

O Vite geralmente roda em:

```text
http://localhost:5173
```

Terminal 3, painel admin:

```bash
cd frontend
npm run dev
```

Se a porta `5173` já estiver ocupada pelo `cliente`, o Vite escolherá outra, normalmente `5174`.

## Variáveis Do Frontend

Tanto `cliente/` quanto `frontend/` usam a API em:

```text
http://localhost:3000
```

Para alterar, crie `.env` no app desejado:

```env
VITE_API_URL=http://localhost:3000
```

No `cliente/`, o serviço do carrinho fica em:

```text
cliente/src/services/cartApi.js
```

Ele guarda um identificador de sessão no `localStorage`:

```text
muttiflow_session_id
```

Esse valor é enviado ao backend no header:

```http
x-session-id
```

## Backend

Entrada principal:

- `backend/src/server.js`: sobe o servidor.
- `backend/src/app.js`: configura middlewares e rotas.
- `backend/src/config/database.js`: configura o PostgreSQL.

Middlewares globais:

- `helmet()`
- `cors()`
- `morgan('dev')`
- `express.json()`

Rotas registradas atualmente:

```js
app.get('/health', ...)
app.use('/auth', authRoutes)
app.use('/carrinho', carrinhoRoutes)
app.use('/pedidos', pedidoRoutes)
app.use('/eventos', eventoRoutes)
app.use('/dashboard', dashboardRoutes)
```

Também existe um arquivo de compatibilidade:

```text
backend/src/routes/carrinhoRoutes.js
```

Ele apenas aponta para:

```text
backend/src/routes/carrinhosRoutes.js
```

Isso evita erro caso algum código antigo tente importar `./routes/carrinhoRoutes`.

## Autenticação

### Cadastro

```http
POST /auth/cadastro
```

Body:

```json
{
  "nome": "Joaquim",
  "email": "joaquim@email.com",
  "senha": "123456"
}
```

Respostas comuns:

- `201`: usuário criado
- `400`: campos ausentes
- `409`: e-mail já cadastrado
- `500`: erro interno

### Login

```http
POST /auth/login
```

Body:

```json
{
  "nome": "Joaquim",
  "senha": "123456"
}
```

Resposta de sucesso:

```json
{
  "token": "...",
  "usuario": {
    "id": 1,
    "nome": "Joaquim",
    "email": "joaquim@email.com"
  }
}
```

O token JWT expira em `30d` por padrão e a sessão fica salva no `localStorage`,
continuando ativa após fechar o navegador ou desligar o computador. Esse período
pode ser alterado pela variável `JWT_EXPIRES_IN` do backend.

## Pagamento Pix

Pix é a única forma de pagamento aceita. Depois de confirmar o pedido, o cliente
é direcionado para `/pagamento-pix/:pedidoId`, onde recebe o valor, a chave e o
código Pix Copia e Cola gerado pelo backend.

Configure no `backend/.env`:

```env
PIX_KEY=sua-chave-pix
PIX_RECEIVER_NAME=MuttiFlow
PIX_RECEIVER_CITY=Sao Paulo
```

O endpoint público `GET /pedidos/:id/pix` exige o mesmo identificador de sessão
usado para criar o pedido. A confirmação do recebimento é feita no painel,
alterando o pagamento de `Pendente` para `Pago`.

## Carrinho

O carrinho suporta visitante anônimo por sessão.

Toda chamada precisa enviar:

```http
x-session-id: algum-identificador
```

No frontend cliente, esse identificador é criado automaticamente com `crypto.randomUUID()` e salvo no `localStorage`.

### Buscar Carrinho

```http
GET /carrinho
```

Exemplo:

```bash
curl -H "x-session-id: teste123" http://localhost:3000/carrinho
```

Resposta:

```json
{
  "carrinho": {
    "id": 1,
    "sessao_id": "teste123"
  },
  "itens": [],
  "subtotal": 0,
  "desconto": 0,
  "total": 0
}
```

### Adicionar Item

```http
POST /carrinho/itens
```

Body:

```json
{
  "produto_id": 1,
  "quantidade": 2
}
```

Exemplo:

```bash
curl -H "Content-Type: application/json" \
  -H "x-session-id: teste123" \
  -d '{"produto_id":1,"quantidade":2}' \
  http://localhost:3000/carrinho/itens
```

Regras:

- `produto_id` é obrigatório.
- `quantidade` precisa ser maior que `0`.
- O backend busca o preço no banco, nunca confia no preço enviado pelo frontend.
- Se o item já existe no carrinho, a quantidade é somada.
- O produto precisa existir e estar com `status = 'ativo'`.

### Atualizar Quantidade

```http
PATCH /carrinho/itens/:id
```

Body:

```json
{
  "quantidade": 3
}
```

### Remover Item

```http
DELETE /carrinho/itens/:id
```

### Limpar Carrinho

```http
DELETE /carrinho
```

## Cliente Público

Pasta:

```text
cliente/
```

Páginas principais:

- `/`: Home
- `/cardapio`: listagem visual do cardápio
- `/produto/:id`: detalhe do produto
- `/carrinho`: carrinho dinâmico conectado ao backend
- `/checkout`: checkout visual
- `/confirmacao`: confirmação visual
- `/pedido-finalizado` e `/obrigado`: finalização
- `/contato`
- `/historia`
- `/eventos`

Arquivos importantes:

- `cliente/src/pages/Carrinho.jsx`: tela do carrinho.
- `cliente/src/pages/Produto.jsx`: adiciona produto ao carrinho.
- `cliente/src/services/cartApi.js`: chamadas para `/carrinho`.
- `cliente/src/components/ui.jsx`: componentes reutilizáveis, incluindo `OrderSummary`, `CartLine` e `QuantityStepper`.
- `cliente/src/data/menuData.js`: dados locais do cardápio usado pela interface pública.

### Carrinho No Cliente

O carrinho:

- busca itens no backend;
- mostra loading;
- mostra erro;
- mostra estado vazio;
- aumenta quantidade;
- diminui quantidade;
- remove item;
- limpa carrinho;
- calcula resumo com subtotal, frete, cupom e total.

### Cupom E Frete

O cupom atual é:

```text
MUTTI15
```

Mesmo com esse nome, o desconto atual configurado é:

```text
R$ 10,00
```

O frete padrão atual é:

```text
R$ 7,00
```

Onde alterar:

- Desconto do cupom: `cliente/src/pages/Carrinho.jsx`, função `handleApplyCoupon`.
- Frete padrão: `cliente/src/components/ui.jsx`, componente `OrderSummary`.

Exemplo atual da lógica:

```js
if (couponCode.trim().toUpperCase() === 'MUTTI15') {
  setCouponDiscount(10)
  setCouponMessage('Cupom aplicado com sucesso')
  return
}
```

## Painel Administrativo

Pasta:

```text
frontend/
```

Rotas:

- `/`: Login
- `/cadastro`: Cadastro
- `/dashboard`: protegida
- `/pedidos`: protegida
- `/eventos`: protegida
- `/custos-receitas`: protegida

Arquivos importantes:

- `frontend/src/services/api.js`: cliente Axios.
- `frontend/src/components/ProtectedRoute.jsx`: bloqueia rotas sem sessão.
- `frontend/src/pages/Login.jsx`
- `frontend/src/pages/Cadastro.jsx`
- `frontend/src/pages/Dashboard.jsx`

## Scripts

Na raiz do projeto:

```bash
npm run dev:backend
npm run dev:cliente
npm run dev:admin
npm run check
```

Backend:

```bash
npm run dev
npm start
```

Cliente:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

Painel admin:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Testes Manuais Rápidos

Health check:

```bash
curl http://localhost:3000/health
```

Carrinho vazio:

```bash
curl -H "x-session-id: teste123" http://localhost:3000/carrinho
```

Adicionar produto:

```bash
curl -H "Content-Type: application/json" \
  -H "x-session-id: teste123" \
  -d '{"produto_id":1,"quantidade":1}' \
  http://localhost:3000/carrinho/itens
```

Cadastro:

```bash
curl -H "Content-Type: application/json" \
  -d '{"nome":"Joaquim","email":"joaquim@email.com","senha":"123456"}' \
  http://localhost:3000/auth/cadastro
```

Login:

```bash
curl -H "Content-Type: application/json" \
  -d '{"email":"joaquim@email.com","senha":"123456"}' \
  http://localhost:3000/auth/login
```

## Erros Comuns

### `Cannot find module './routes/carrinhoRoutes'`

Esse erro acontece quando o código tenta importar `carrinhoRoutes.js`, mas só existe `carrinhosRoutes.js`.

Neste projeto, os dois caminhos foram deixados funcionando:

- `backend/src/routes/carrinhoRoutes.js`
- `backend/src/routes/carrinhosRoutes.js`

O arquivo sem `s` apenas reexporta o arquivo com `s`.

### `Peer authentication failed for user "postgres"`

No Ubuntu, o usuário `postgres` do banco pode exigir que o comando seja executado como usuário Linux `postgres`.

Use:

```bash
sudo -u postgres psql -d muttiflow
```

Ou conecte via TCP com senha:

```bash
PGPASSWORD=8846 psql -h 127.0.0.1 -U postgres -d muttiflow
```

### `relation "produtos" does not exist`

Reinicie o backend para que `initializeDatabase()` aplique o schema completo. Manualmente:

```bash
cd backend
PGPASSWORD=sua-senha psql -h 127.0.0.1 -U postgres -d muttiflow -f src/database/init.sql
```

### `Produto não encontrado`

O backend procura produtos assim:

```sql
SELECT * FROM produtos WHERE id = $1 AND status = 'ativo'
```

Então confira se:

- o `id` existe;
- a coluna `status` está com valor `ativo`;
- o frontend está enviando `produto_id` numérico correto.

### Backend sobe, mas frontend não encontra a API

Confira se o backend está rodando em:

```text
http://localhost:3000
```

E se `VITE_API_URL` aponta para essa URL.

## Próximos Passos Recomendados

- Conectar o cardápio público ao backend em vez de depender de `cliente/src/data/menuData.js`.
- Adicionar testes automatizados para autenticação e carrinho.
- Criar uma área administrativa para gerenciar os produtos do cardápio.

## Observações De Segurança

- Não use `JWT_SECRET=muttiflow-secret` em produção.
- Não deixe senha real do PostgreSQL versionada.
- Não confie em preço enviado pelo frontend.
- Valide cupons, frete e total no backend antes de finalizar pedidos.
- Em produção, configure CORS para aceitar apenas os domínios corretos.

## Licença

O `backend/package.json` declara licença `ISC`. Se o projeto for publicado, recomenda-se adicionar um arquivo `LICENSE` na raiz.
