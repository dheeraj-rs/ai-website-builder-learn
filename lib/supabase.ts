import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Project = {
  id: string;
  user_id: string | null;
  name: string;
  html_content: string;
  css_content: string;
  js_content: string;
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  project_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

export type ProjectSection = {
  id: string;
  project_id: string;
  section_type: string;
  content: string;
  order_index: number;
  created_at: string;
};
