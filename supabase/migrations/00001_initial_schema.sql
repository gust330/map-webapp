-- MAP initial schema (PRD secção 5 + extensão pgvector + RLS completo)
-- No Supabase: Database → Extensions → ativar "vector" antes de correr, ou usar a linha abaixo se tiveres permissões.

CREATE EXTENSION IF NOT EXISTS vector;

-- Ideias
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  input_method TEXT CHECK (input_method IN ('text', 'voice', 'image')) DEFAULT 'text',
  image_url TEXT,
  image_analysis TEXT,
  categories TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  is_task BOOLEAN DEFAULT false,
  status TEXT CHECK (status IN ('active', 'archived')) DEFAULT 'active',
  ai_source TEXT CHECK (ai_source IN ('local', 'cloud')) DEFAULT 'cloud',
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tarefas
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  idea_id UUID REFERENCES ideas(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  notes TEXT,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  due_date TIMESTAMPTZ,
  reminder_at TIMESTAMPTZ,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Relações entre ideias
CREATE TABLE idea_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_a UUID REFERENCES ideas(id) ON DELETE CASCADE,
  idea_b UUID REFERENCES ideas(id) ON DELETE CASCADE,
  similarity FLOAT NOT NULL,
  relation_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(idea_a, idea_b)
);

-- Chat de desenvolvimento
CREATE TABLE idea_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Categorias personalizadas
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índice semântico (ajusta lists quando tiveres mais linhas; ver documentação pgvector)
CREATE INDEX ideas_embedding_ivfflat ON ideas USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users own ideas" ON ideas FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users own tasks" ON tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users own chats" ON idea_chats FOR ALL USING (
  idea_id IN (SELECT id FROM ideas WHERE user_id = auth.uid())
);
CREATE POLICY "users own idea_relations" ON idea_relations FOR ALL USING (
  EXISTS (SELECT 1 FROM ideas i1 WHERE i1.id = idea_relations.idea_a AND i1.user_id = auth.uid())
  AND EXISTS (SELECT 1 FROM ideas i2 WHERE i2.id = idea_relations.idea_b AND i2.user_id = auth.uid())
);
CREATE POLICY "users own categories" ON categories FOR ALL USING (auth.uid() = user_id);
