# MAP — Mind Assistant Protocol 🧠✨

> **A desktop-first cognitive second brain and multimodal knowledge engine that captures ideas via voice, image, and text, organizes them using semantic vector embeddings, and builds interactive knowledge graphs.**

[![Next.js](https://img.shields.io/badge/Next.js-15%2B%20App%20Router-black.svg?logo=nextdotjs&logoColor=white)](#tech-stack)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg?logo=typescript&logoColor=white)](#tech-stack)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4%20%7C%20shadcn%2Fui-38B2AC.svg?logo=tailwind-css&logoColor=white)](#tech-stack)
[![Vector DB](https://img.shields.io/badge/Database-Supabase%20(pgvector)-3ECF8E.svg?logo=supabase&logoColor=white)](#tech-stack)
[![Graph](https://img.shields.io/badge/Graph-React%20Flow-FF0072.svg)](#interactive-knowledge-graph)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

---

## Overview

Human thoughts and insights arrive spontaneously across different media—voice memos while walking, whiteboard photos, or quick text snippets. Traditional note apps store them in static folders where connections decay.

**MAP (Mind Assistant Protocol)** is an intelligent second brain engineered for rapid desktop-first thought synthesis. It captures raw inputs through multimodal pipelines, uses vector embeddings to map conceptual affinities, and renders an interactive idea graph you can explore and chat with.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MIND ASSISTANT PROTOCOL                         │
├────────────────────────────────┬───────────────────────────────────────┤
│  [🎙️] Multimodal Ingestion      │  [🧬] Semantic Vector Core            │
│  · Web Speech API audio stream │  · text-embedding-3-small (Supabase)  │
│  · GPT-4o Vision image extract │  · pgvector cosine similarity search  │
│  · Rapid markdown text capture │  · Automated AI topic categorization  │
├────────────────────────────────┴───────────────────────────────────────┤
│                   [⚡] Synthesis & Relationship Mesh                    │
│  React Flow Dynamic Knowledge Graph ──▶ Interactive Node Expansions   │
├────────────────────────────────┬───────────────────────────────────────┤
│  [💬] Conversational Synthesis │  [📋] Actionable Task Engine          │
│  · Chat with specific clusters │  · Contextual deadline extraction     │
│  · GPT-4o-mini ideation partner│  · Native browser push notifications  │
└────────────────────────────────┴───────────────────────────────────────┘
```

---

## Key Capabilities

### 1. Multimodal Capture Engine
- **Voice Transcription**: Frictionless in-browser voice capture powered by the native **Web Speech API** (zero latency, zero external API cost).
- **Visual Intelligence**: Image ingestion with **OpenAI GPT-4o Vision** parsing diagrams, receipts, mind maps, and handwritten whiteboard notes into structured ideas.
- **Fast Text Ingestion**: Keyboard-first modal with instant markdown formatting.

### 2. Semantic Clustering & Vector Search
- Stored ideas are embedded with OpenAI `text-embedding-3-small` and indexed in **Supabase PostgreSQL** via **pgvector**.
- Automatically surfaces serendipitous connections and related thoughts when browsing or creating new entries.

### 3. Interactive Knowledge Graph (`React Flow`)
- Visualizes your memory base as an interactive semantic network graph.
- Node proximity reflects conceptual similarity. Click any node to inspect context, trace backlinks, or branch new thoughts.

### 4. Deepening via Conversational AI
- Chat directly with individual ideas or entire subject clusters to brainstorm, outline essays, or draft implementation specs.

### 5. Actionable Task Engine
- Extracts commitments and action items from captured notes.
- Integrated reminder scheduler dispatching native desktop browser notifications.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 15+ (App Router, Server Components & Server Actions) |
| **Language** | TypeScript (Strict Mode) |
| **Styling & UI** | Tailwind CSS v4, shadcn/ui primitives, Framer Motion |
| **Graph Visualization** | React Flow (`@xyflow/react`) |
| **State Management** | Zustand (`lib/stores/appStore.ts`) |
| **Database & Auth** | Supabase (PostgreSQL, pgvector, Auth, Storage, Realtime) |
| **AI Processing** | OpenAI API (`gpt-4o-mini`, `gpt-4o-vision`, `text-embedding-3-small`) |
| **Audio Processing** | Browser Web Speech API |

---

## Getting Started

### Prerequisites

- **Node.js** 20+ & **pnpm** (or npm)
- A **Supabase** account with `pgvector` enabled
- An **OpenAI API Key**

### 1. Clone & Install

```bash
git clone https://github.com/gust330/map-webapp.git
cd map-webapp

npm install
```

### 2. Environment Setup

Create `.env.local` in the project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# OpenAI Configuration (Server-Side Only)
OPENAI_API_KEY="sk-..."
```

### 3. Database Schema

Enable `vector` extension and run migrations in your Supabase SQL Editor:

```sql
create extension if not exists vector;

-- Ideas table
create table ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  content text,
  category text,
  tags text[],
  embedding vector(1536),
  created_at timestamptz default now()
);

-- Semantic similarity search function
create or replace function match_ideas (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  title text,
  content text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    ideas.id,
    ideas.title,
    ideas.content,
    1 - (ideas.embedding <=> query_embedding) as similarity
  from ideas
  where 1 - (ideas.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
end;
$$;
```

### 4. Run Development Server

```bash
npm run dev
```

Open **`http://localhost:3000`** in your browser.

---

## Project Structure

```
map-webapp/
├── app/
│   ├── (auth)/             # Login, signup, and authentication flows
│   ├── (dashboard)/        # Main app shell (Feed, Graph, Tasks, Chat)
│   ├── api/                # Secure server-side routes (embeddings, vision, AI)
│   ├── layout.tsx          # Root layout and theme provider
│   └── globals.css         # Tailwind v4 theme configuration
├── components/
│   ├── auth/               # Login and registration components
│   ├── capture/            # Voice, image, and markdown capture modals
│   ├── ideas/              # Idea cards, detail view, and cluster drawer
│   ├── layout/             # Sidebar, header, and search palette
│   └── ui/                 # Accessible shadcn/ui primitives
├── lib/
│   ├── hooks/              # Custom hooks (useSpeechToText, useVectorSearch)
│   ├── stores/             # Zustand global state (appStore.ts)
│   └── supabase/           # Server and browser Supabase clients
├── CLAUDE.md               # Development architecture guidelines
└── README.md
```

---

## Author & License

Engineered by **Gustavo Teixeira** ([@gust330](https://github.com/gust330)).  
Licensed under the [MIT License](LICENSE).
