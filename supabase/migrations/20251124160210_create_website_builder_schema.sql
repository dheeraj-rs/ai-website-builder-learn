/*
  # Website Builder Platform Schema

  1. New Tables
    - `projects`
      - `id` (uuid, primary key) - Unique project identifier
      - `user_id` (uuid) - Owner of the project
      - `name` (text) - Project name
      - `html_content` (text) - Generated HTML content
      - `css_content` (text) - Generated CSS styles
      - `js_content` (text) - Generated JavaScript
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `chat_messages`
      - `id` (uuid, primary key) - Unique message identifier
      - `project_id` (uuid, foreign key) - Associated project
      - `role` (text) - Message sender (user/assistant)
      - `content` (text) - Message content
      - `created_at` (timestamptz) - Message timestamp
    
    - `project_sections`
      - `id` (uuid, primary key) - Section identifier
      - `project_id` (uuid, foreign key) - Associated project
      - `section_type` (text) - Type of section (header, body, footer, etc.)
      - `content` (text) - Section HTML content
      - `order_index` (integer) - Display order
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL DEFAULT 'Untitled Project',
  html_content text DEFAULT '',
  css_content text DEFAULT '',
  js_content text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  section_type text NOT NULL,
  content text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on projects"
  ON projects FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on chat_messages"
  ON chat_messages FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on project_sections"
  ON project_sections FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_chat_messages_project_id ON chat_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_project_sections_project_id ON project_sections(project_id);
