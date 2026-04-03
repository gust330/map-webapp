# MAP — Mind Assistant Protocol (Web App)

## O que é este projeto
Web app desktop-first que funciona como segundo cérebro inteligente.
O utilizador captura ideias por texto, voz e imagem. A IA categoriza,
relaciona ideias semanticamente e desenvolve-as via chat.
Inclui sistema de tarefas com browser notifications.

## Stack
- Next.js 15+ (App Router, TypeScript strict)
- Tailwind CSS v4 + shadcn/ui
- Supabase (PostgreSQL + pgvector + Auth + Storage + Realtime)
- OpenAI API (GPT-4o-mini chat/categorize, GPT-4o Vision, text-embedding-3-small)
- Zustand (estado global)
- React Flow (grafo de relações)
- Framer Motion (animações)
- Web Speech API (transcrição de voz, browser nativo)

## Arquitetura
- App Router do Next.js: (auth) e (dashboard) route groups
- Server Components por defeito; Client Components só onde necessário ('use client')
- API Routes em /app/api/ para toda a lógica server-side
- Supabase client: lib/supabase/client.ts (browser) e lib/supabase/server.ts (server)
- OpenAI calls sempre server-side (nunca expor API key no cliente)
- Zustand store em lib/stores/appStore.ts para estado UI

## Regras de Código
- TypeScript strict — sem 'any', sem @ts-ignore
- Comentários em português, código (variáveis, funções, tipos) em inglês
- Server Components para data fetching; Client Components para interatividade
- Sempre usar async/await, nunca .then() encadeado
- Erros tratados com try/catch e mensagens user-friendly (nunca silenciar)
- Componentes máximo 150 linhas — dividir se necessário
- Custom hooks para lógica reutilizável (useIdeas, useTasks, etc.)
- Zod para validação de todos os inputs de API
- Nunca fazer fetch() diretamente nas páginas — usar hooks ou server actions

## Base de Dados
- Schema e RLS: `supabase/migrations/00001_initial_schema.sql` (alinhado ao PRD)
- Migrations via Supabase CLI (pasta supabase/migrations/)
- pgvector para embeddings (dimensão 1536 — text-embedding-3-small)

## Variáveis de Ambiente
- Ver .env.example para lista completa
- NUNCA usar variáveis SUPABASE_SERVICE_ROLE_KEY ou OPENAI_API_KEY no cliente
- Apenas NEXT_PUBLIC_* são seguras para o browser

## Estado do Projeto
- PRD completo: `MAP_WebApp_PRD.md` (pasta pai do repositório, se aplicável)

## Comandos Úteis
- Dev: npm run dev
- Build: npm run build
- Supabase local: npx supabase start
- Gerar tipos Supabase: npx supabase gen types typescript --local > lib/types/supabase.ts
