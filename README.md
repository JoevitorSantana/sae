# SAE - Sistema de Acompanhamento de Egressos

## Descrição
O **SAE - Sistema de Acompanhamento de Egressos** é uma aplicação web desenvolvida com o objetivo de acompanhar e gerenciar informações sobre egressos de uma instituição de ensino. O sistema permite o cadastro e a atualização de dados pessoais, acadêmicos e profissionais dos ex-alunos.

## Tecnologias Utilizadas
- **Next.js 14** (Diretório `app` habilitado)
- **Prisma ORM**
- **PostgreSQL** como banco de dados
- **Clerk** para autenticação de usuários
- **React Hook Form** para gestão de formulários
- **Zod** para validação de dados
- **Tailwind CSS** para estilização

## Estrutura do Projeto
```
/sae
├── /app
│   ├── /auth               # Autenticação de usuários (Clerk)
│   ├── /dashboard          # Painel do usuário
│   ├── /profile            # Perfil do egresso
|   ├── /submit             # Envio do formulário
│   ├── /api                # Rotas de API do Next.js
├── /components             # Componentes reutilizáveis
├── /data                   # Dados auxiliares (ex: lista de estados, cursos)
├── /prisma                 # Esquema do banco de dados Prisma
├── /schemas                # Esquemas de validação com Zod
├── .env                    # Variáveis de ambiente
├── package.json            # Dependências do projeto
├── prisma/schema.prisma    # Definição do banco de dados
├── README.md               # Documentação do projeto
```

## Configuração do Ambiente
1. Clone o repositório:
   ```sh
   git clone https://github.com/seu-usuario/sae.git
   ```
2. Instale as dependências:
   ```sh
   cd sae
   npm install
   ```
3. Configure as variáveis de ambiente em `.env`:
   ```env
   DATABASE_URL=postgresql://usuario:senha@localhost:5432/sae
   NEXT_PUBLIC_CLERK_FRONTEND_API=chave_do_clerk
   ```
4. Execute a migração do banco de dados:
   ```sh
   npx prisma migrate dev --name init
   ```
5. Inicie o servidor:
   ```sh
   npm run dev
   ```

## Funcionalidades Principais
- **Cadastro e autenticação** de egressos via Clerk
- **Gerenciamento de perfil** (dados pessoais, contato, endereço, curso concluído)
- **Sistema de seleção dependente** (Estados e Cidades dinâmicos)
- **Banco de dados PostgreSQL** com Prisma ORM
- **Painel de acompanhamento** para exibir informações e estatísticas

## Contato
Para mais informações ou contribuições, entre em contato via [joevitoralvessantana@gmail.com] ou abra uma issue no repositório.

---
Desenvolvido por [JoevitorSantana]