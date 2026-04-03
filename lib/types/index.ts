// ── Tipos globais alinhados com o schema PostgreSQL (PRD secção 5) ──

export type InputMethod = "text" | "voice" | "image";
export type IdeaStatus = "active" | "archived";
export type TaskPriority = "high" | "medium" | "low";
export type ChatRole = "user" | "assistant";

export interface Idea {
  id: string;
  user_id: string;
  content: string;
  input_method: InputMethod;
  image_url: string | null;
  image_analysis: string | null;
  categories: string[];
  tags: string[];
  is_task: boolean;
  status: IdeaStatus;
  ai_source: "local" | "cloud";
  embedding: number[] | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  idea_id: string | null;
  title: string;
  notes: string | null;
  priority: TaskPriority;
  due_date: string | null;
  reminder_at: string | null;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface IdeaRelation {
  id: string;
  idea_a: string;
  idea_b: string;
  similarity: number;
  relation_type: string | null;
  created_at: string;
}

export interface IdeaChat {
  id: string;
  idea_id: string;
  role: ChatRole;
  content: string;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string | null;
  created_at: string;
}

// ── DTOs para criação/atualização ──

export interface CreateIdeaDTO {
  content: string;
  input_method?: InputMethod;
  image_url?: string;
  categories?: string[];
  tags?: string[];
}

export interface UpdateIdeaDTO {
  content?: string;
  categories?: string[];
  tags?: string[];
  status?: IdeaStatus;
  is_task?: boolean;
}
