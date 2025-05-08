-- Inserir categorias
INSERT INTO categories (name, color)
VALUES 
  ('Problema técnico', '#EF4444'),
  ('Dúvida', '#3B82F6'),
  ('Solicitação', '#10B981'),
  ('Reclamação', '#F59E0B'),
  ('Sugestão', '#8B5CF6')
ON CONFLICT DO NOTHING;

-- Inserir prioridades
INSERT INTO priorities (name, color)
VALUES 
  ('Baixa', '#10B981'),
  ('Média', '#F59E0B'),
  ('Alta', '#EF4444'),
  ('Crítica', '#7F1D1D')
ON CONFLICT DO NOTHING;

-- Inserir status
INSERT INTO statuses (name, color)
VALUES 
  ('Aberto', '#3B82F6'),
  ('Em andamento', '#F59E0B'),
  ('Aguardando', '#8B5CF6'),
  ('Finalizado', '#10B981'),
  ('Cancelado', '#EF4444')
ON CONFLICT DO NOTHING;

-- Inserir um usuário administrador (senha: admin123)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin@example.com',
  '$2a$10$Ql9XLaOAYjZM0YXVxlRwNuRDQIKFcQgXFpFEghNPJwgKBCLXpwALi',
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Administrador"}',
  now()
);

-- Inserir perfil de administrador
INSERT INTO profiles (id, name, email, is_admin)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Administrador',
  'admin@example.com',
  true
);
