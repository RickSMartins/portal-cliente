# Portal do Cliente – TechServ

Portal para os clientes da TechServ (empresa fictícia de manutenção e suporte técnico) se cadastrarem, entrarem com login, abrirem solicitações de serviço e acompanharem o andamento de cada uma.

Teste técnico para Desenvolvedor Júnior.

## Funcionalidades

- Cadastro de cliente (nome, e-mail, telefone e senha), com e-mail único
- Login e logout; só usuários autenticados acessam o portal
- Meu perfil: visualizar e editar os dados (exceto o e-mail)
- Abrir solicitação (título, descrição, categoria e prioridade), que nasce com status **Aberta** e data de criação
- Minhas solicitações: somente as do cliente logado, da mais recente para a mais antiga, com filtro por status
- Detalhe da solicitação, com todos os campos e o status atual
- Cancelar solicitação, permitido apenas enquanto estiver **Aberta**

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Banco de dados | PostgreSQL 16 (Docker) |
| Backend | ASP.NET Core (.NET 10) com Controllers, EF Core 10 e Npgsql |
| Autenticação | JWT em cookie `HttpOnly` + `SameSite=Strict`; senhas com hash PBKDF2 (`PasswordHasher`) |
| Frontend | React 19 + Vite, React Router 7 e axios (JavaScript) |

## Como rodar o projeto do zero

### Pré-requisitos

- [Git](https://git-scm.com/)
- [.NET SDK 10](https://dotnet.microsoft.com/download) (10.0.402 ou superior na linha 10.0.4xx; a versão é fixada em `backend/global.json`)
- [Node.js](https://nodejs.org/) LTS (20 ou superior)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/), aberto e com o engine rodando

### 1. Clonar o repositório

```bash
git clone https://github.com/RickSMartins/portal-cliente.git
cd portal-cliente
```

### 2. Subir o banco de dados

Na raiz do projeto:

```bash
docker compose up -d
```

Sobe um PostgreSQL 16 na porta `5432`, com o banco `portal_cliente` (usuário `portal`, senha `portal123`).

### 3. Criar as tabelas e rodar a API

```bash
cd backend
dotnet tool restore          # instala a ferramenta dotnet-ef na versão do manifesto
cd PortalCliente.Api
dotnet build                 # restaura os pacotes NuGet (necessário antes do dotnet ef)
dotnet ef database update    # aplica as migrations e cria as tabelas
dotnet run
```

A API fica disponível em `http://localhost:5194`.

### 4. Rodar o frontend

Em outro terminal, a partir da raiz do projeto:

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`.

### Usuário de teste

O projeto **não tem seed**: crie um usuário pela tela de cadastro (link "Cadastre-se" na tela de login).

### Recriar o banco do zero

```bash
docker compose down -v       # apaga o container e o volume com os dados
docker compose up -d
cd backend/PortalCliente.Api
dotnet ef database update
```

## Endpoints da API

Base: `http://localhost:5194/api`. Todas as rotas, exceto as de `auth`, exigem autenticação.

| Verbo | Rota | Descrição | Sucesso |
|---|---|---|---|
| POST | `/auth/cadastro` | Cadastra um cliente | 201 |
| POST | `/auth/login` | Autentica e grava o cookie com o token | 200 |
| POST | `/auth/logout` | Apaga o cookie | 204 |
| GET | `/perfil` | Dados do cliente logado | 200 |
| PUT | `/perfil` | Atualiza nome e telefone | 200 |
| POST | `/solicitacoes` | Abre uma solicitação | 201 |
| GET | `/solicitacoes?status=Aberta` | Lista as solicitações do cliente (filtro opcional) | 200 |
| GET | `/solicitacoes/{id}` | Detalhe de uma solicitação | 200 |
| PATCH | `/solicitacoes/{id}/cancelar` | Cancela uma solicitação Aberta | 200 |

Respostas de erro: `400` (dados inválidos ou regra de negócio), `401` (não autenticado), `404` (não encontrado ou pertencente a outro cliente) e `409` (e-mail já cadastrado). Os erros de regra de negócio vêm no formato `{ "mensagem": "..." }`.

O documento OpenAPI fica em `http://localhost:5194/openapi/v1.json` (ambiente de desenvolvimento).

## Estrutura do projeto

```
portal-cliente/
├── backend/
│   ├── PortalCliente.Api/
│   │   ├── Controllers/    # traduzem HTTP ⇄ services
│   │   ├── Services/       # regras de aplicação (auth, perfil, solicitações, token)
│   │   ├── Entities/       # Cliente, Solicitacao e enums (regras de domínio)
│   │   ├── DTOs/           # contratos de entrada e saída da API
│   │   ├── Data/           # AppDbContext e migrations
│   │   └── Program.cs      # injeção de dependência e pipeline
│   ├── dotnet-tools.json   # dotnet-ef como ferramenta local
│   └── global.json         # versão do SDK
├── frontend/
│   └── src/
│       ├── api/            # chamadas à API (axios)
│       ├── contexts/       # AuthContext (usuário logado)
│       ├── components/     # Layout, RotaPrivada, StatusBadge
│       ├── pages/          # as 6 telas
│       └── utils/          # textos de exibição e formatação de datas
└── docker-compose.yml      # PostgreSQL
```

## Decisões técnicas

- **Um único projeto de API organizado em pastas** (Controllers, Services, Entities, DTOs, Data), adequado ao tamanho do sistema. Com o crescimento, separaria em projetos por camada (Domain, Application, Infrastructure, Api).
- **Regras de negócio na entidade:** o `Status` da `Solicitacao` tem `set` privado e só muda pelo método `Cancelar()`, que valida se ela está Aberta. Toda solicitação nasce Aberta pela própria entidade.
- **Isolamento entre clientes:** o Id do cliente vem sempre do token (nunca do corpo da requisição), e toda consulta filtra por ele. Uma solicitação de outro cliente responde `404`, sem revelar que existe.
- **EF Core com migrations e Fluent API:** tamanhos máximos das colunas, índice único no e-mail, chave estrangeira com `DeleteBehavior.Restrict` (solicitações são histórico e não são apagadas em cascata) e enums salvos como texto (legíveis no banco e imunes a reordenação do enum).
- **E-mail normalizado** (trim + minúsculas) antes de salvar e de buscar, pois o PostgreSQL diferencia maiúsculas de minúsculas no índice único.
- **Senhas com hash PBKDF2 e salt** (`PasswordHasher` do ASP.NET Core); a senha nunca é armazenada.
- **Token JWT em cookie `HttpOnly` com `SameSite=Strict`:** o JavaScript da página não consegue ler o token (proteção contra XSS) e o cookie não é enviado em requisições originadas de outros sites (mitigação de CSRF). O front guarda apenas o nome do usuário para exibição.
- **CORS restrito à origem do frontend**, com `AllowCredentials` para o envio do cookie.
- **Mensagem genérica no login** ("E-mail ou senha inválidos"), para não revelar quais e-mails estão cadastrados.
- **.NET 10**, por ser a versão LTS atual (o .NET 8 encerra o suporte em novembro de 2026).
- **Versões fixadas** para reprodutibilidade: imagem do PostgreSQL, SDK (`global.json`), `dotnet-ef` (ferramenta local) e React Router 7.
- **JavaScript em vez de TypeScript** no frontend, para focar no essencial dentro do prazo.

## Configuração e segredos

As credenciais do banco e a chave do JWT em `appsettings.json` são **apenas para desenvolvimento local**. Em produção, seriam fornecidas por variáveis de ambiente, que sobrescrevem o `appsettings` sem alterar o código:

- `ConnectionStrings__DefaultConnection`
- `Jwt__Key`
- `Cors__Origins__0`

A URL da API usada pelo frontend fica em `frontend/.env.development` (`VITE_API_URL`).

## O que ficou faltando e o que eu melhoraria com mais tempo

**Diferenciais não implementados**

- Perfil de **Atendente**, que vê todas as solicitações e altera o status (Aberta → Em andamento → Concluída)
- **Histórico de status** (quem mudou, de qual para qual e quando)
- **Paginação** na listagem
- **Testes automatizados**, começando pelas regras da entidade (`Cancelar()`) e pelos services
- **Docker Compose** subindo também a API e o frontend com um comando
- **Interface de documentação** da API (Swagger UI ou Scalar) sobre o documento OpenAPI já gerado
- **Deploy** em um serviço gratuito

**Melhorias técnicas**

- Tratamento de erros centralizado (middleware/`IExceptionHandler` com Problem Details) em vez de `try/catch` em cada controller, e exceções de domínio próprias
- Leitura do Id do cliente logado em um único lugar (método de extensão ou controller base), em vez de repetida nos controllers
- Configurações tipadas com o *Options Pattern* (ex.: `JwtSettings`) em vez de chaves em texto
- Claims do JWT com os nomes curtos padronizados (`sub`, `name`, `email`)
- Projeção direta para DTO na consulta da listagem (`Select`), trazendo só as colunas necessárias
- Renovação de sessão (refresh token) e limite de tentativas de login
- TypeScript no frontend e validação de telefone com máscara
