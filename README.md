# Rosetas Personalizados

Plataforma sob medida desenvolvida para catálogo digital e gestão de encomendas de papelaria e itens personalizados. O projeto é dividido em uma interface pública otimizada para conversão (Storefront) e um painel de controle administrativo privado (Admin).

## Stack Tecnológica

O projeto foi construído utilizando tecnologias modernas focadas em performance, tipagem estática e escalabilidade:

- Framework: Next.js 16 (App Router)
- Linguagem: TypeScript
- Estilização: Tailwind CSS
- Banco de Dados: PostgreSQL (hospedado via Supabase)
- ORM: Prisma
- Autenticação: Supabase Auth (Server-side com Middlewares)
- Animações e Interações: Framer Motion e dnd-kit
- Validação e Formulários: React Hook Form + Zod

## Arquitetura e Funcionalidades

### 1. Storefront (Área Pública)
Focada em performance e SEO, entregando uma experiência editorial de alto padrão.
- Catálogo Dinâmico: Filtragem de produtos em tempo real por categoria, com componentes renderizados de forma otimizada.
- Orçamentos via WhatsApp: Formulário estruturado que gera um payload de texto pré-formatado e redireciona de forma segura para a API do WhatsApp.
- Animações Baseadas em Scroll: Utilização de `useScroll` e `useTransform` do Framer Motion para transições de galeria e seções empilhadas.
- Tratamento de Erros Global: Fronteiras de erro (`error.tsx` e `not-found.tsx`) contextuais que preservam o layout da aplicação em caso de falhas.

### 2. Painel Administrativo (Área Privada)
Protegido por proxy/middleware no edge, garantindo que apenas usuários autenticados acessem as rotas `/admin`.
- Gestão de Catálogo: Criação, edição, ativação/desativação e exclusão de produtos com validação estrita (Zod).
- Gestão de Pedidos (Kanban): Pipeline de status de pedidos interativo (Drag and Drop).
- Interface Otimista (Optimistic UI): O painel utiliza `useOptimistic` do React para atualizar a interface imediatamente durante mutações de banco de dados, eliminando a latência percebida pelo usuário.

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
