-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS priorities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#F59E0B',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS statuses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6B7280',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id),
  status_id UUID NOT NULL REFERENCES statuses(id),
  priority_id UUID NOT NULL REFERENCES priorities(id),
  created_by UUID NOT NULL REFERENCES profiles(id),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS operations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  description TEXT NOT NULL,
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Insert default data
INSERT INTO categories (name, color)
VALUES 
  ('Problema técnico', '#EF4444'),
  ('Dúvida', '#3B82F6'),
  ('Solicitação', '#10B981'),
  ('Reclamação', '#F59E0B'),
  ('Sugestão', '#8B5CF6')
ON CONFLICT DO NOTHING;

INSERT INTO priorities (name, color)
VALUES 
  ('Baixa', '#10B981'),
  ('Média', '#F59E0B'),
  ('Alta', '#EF4444'),
  ('Crítica', '#7F1D1D')
ON CONFLICT DO NOTHING;

INSERT INTO statuses (name, color)
VALUES 
  ('Aberto', '#3B82F6'),
  ('Em andamento', '#F59E0B'),
  ('Aguardando', '#8B5CF6'),
  ('Finalizado', '#10B981'),
  ('Cancelado', '#EF4444')
ON CONFLICT DO NOTHING;

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" 
  ON profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile" 
  ON profiles FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can insert profiles" 
  ON profiles FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete profiles" 
  ON profiles FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Categories policies
CREATE POLICY "Categories are viewable by everyone" 
  ON categories FOR SELECT 
  USING (true);

CREATE POLICY "Admins can insert categories" 
  ON categories FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update categories" 
  ON categories FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete categories" 
  ON categories FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Priorities policies
CREATE POLICY "Priorities are viewable by everyone" 
  ON priorities FOR SELECT 
  USING (true);

CREATE POLICY "Admins can insert priorities" 
  ON priorities FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update priorities" 
  ON priorities FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete priorities" 
  ON priorities FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Statuses policies
CREATE POLICY "Statuses are viewable by everyone" 
  ON statuses FOR SELECT 
  USING (true);

CREATE POLICY "Admins can insert statuses" 
  ON statuses FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update statuses" 
  ON statuses FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete statuses" 
  ON statuses FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Tickets policies
CREATE POLICY "Tickets are viewable by admins" 
  ON tickets FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Users can view their own tickets" 
  ON tickets FOR SELECT 
  USING (created_by = auth.uid());

CREATE POLICY "Users can insert their own tickets" 
  ON tickets FOR INSERT 
  WITH CHECK (
    created_by = auth.uid() AND
    NOT EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Users can update their own tickets" 
  ON tickets FOR UPDATE 
  USING (
    created_by = auth.uid() AND
    NOT EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update any ticket" 
  ON tickets FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Users can delete their own tickets" 
  ON tickets FOR DELETE 
  USING (
    created_by = auth.uid() AND
    NOT EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Operations policies
CREATE POLICY "Operations are viewable by everyone" 
  ON operations FOR SELECT 
  USING (true);

CREATE POLICY "Admins can insert operations" 
  ON operations FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update their own operations" 
  ON operations FOR UPDATE 
  USING (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete their own operations" 
  ON operations FOR DELETE 
  USING (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" 
  ON comments FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert comments" 
  ON comments FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own comments" 
  ON comments FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments" 
  ON comments FOR DELETE 
  USING (user_id = auth.uid());

-- Create functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_updated_at_profiles
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_categories
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_priorities
BEFORE UPDATE ON priorities
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_statuses
BEFORE UPDATE ON statuses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_tickets
BEFORE UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_operations
BEFORE UPDATE ON operations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_comments
BEFORE UPDATE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Function to set completed_at when status changes to "Finalizado"
CREATE OR REPLACE FUNCTION set_completed_at()
RETURNS TRIGGER AS $$
DECLARE
  finished_status_id UUID;
BEGIN
  SELECT id INTO finished_status_id FROM statuses WHERE name = 'Finalizado' LIMIT 1;
  
  IF NEW.status_id = finished_status_id AND OLD.status_id != finished_status_id THEN
    NEW.completed_at = NOW();
  ELSIF NEW.status_id != finished_status_id AND OLD.status_id = finished_status_id THEN
    NEW.completed_at = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_ticket_completed_at
BEFORE UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION set_completed_at();
