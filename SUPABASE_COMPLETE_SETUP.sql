-- ============================================
-- SETUP COMPLETO DO BANCO DE DADOS - PAPO 10
-- ============================================

-- 1. CRIAR TABELA DE CAMISETAS (se não existir)
CREATE TABLE IF NOT EXISTS camisetas (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  team TEXT NOT NULL,
  imagem_url TEXT, -- Mantido por compatibilidade, mas não será mais usado
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CRIAR TABELA DE USUÁRIOS ADMIN
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. INSERIR ADMIN PADRÃO (senha: admin123)
INSERT INTO admin_users (email, password_hash) 
VALUES ('admin@papo10.com', 'admin123')
ON CONFLICT (email) DO NOTHING;

-- 4. CRIAR TABELA DE IMAGENS DE PRODUTOS
CREATE TABLE IF NOT EXISTS product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. REMOVER CONSTRAINT ANTIGA E ADICIONAR COM CASCADE
ALTER TABLE product_images 
DROP CONSTRAINT IF EXISTS product_images_product_id_fkey;

ALTER TABLE product_images 
ADD CONSTRAINT product_images_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES camisetas(id) 
ON DELETE CASCADE;

-- 6. CRIAR ÍNDICES PARA MELHOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_product_images_product_id 
ON product_images(product_id);

CREATE INDEX IF NOT EXISTS idx_camisetas_created_at 
ON camisetas(created_at DESC);

-- 7. MIGRAR IMAGENS EXISTENTES (se houver)
INSERT INTO product_images (product_id, image_url, display_order)
SELECT id, imagem_url, 0
FROM camisetas
WHERE imagem_url IS NOT NULL 
  AND NOT EXISTS (
    SELECT 1 FROM product_images 
    WHERE product_id = camisetas.id 
    AND image_url = camisetas.imagem_url
  );

-- 8. HABILITAR RLS (Row Level Security)
ALTER TABLE camisetas ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 9. REMOVER POLÍTICAS ANTIGAS
DROP POLICY IF EXISTS "Public read access" ON camisetas;
DROP POLICY IF EXISTS "Admin full access" ON camisetas;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON camisetas;

DROP POLICY IF EXISTS "Public read access" ON product_images;
DROP POLICY IF EXISTS "Admin full access" ON product_images;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON product_images;

DROP POLICY IF EXISTS "Admin read access" ON admin_users;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON admin_users;

-- 10. CRIAR POLÍTICAS PERMISSIVAS (DESENVOLVIMENTO)
-- ATENÇÃO: Em produção, use políticas mais restritivas!

-- Camisetas: Leitura pública, escrita para todos (desenvolvimento)
CREATE POLICY "Enable read for all" ON camisetas
FOR SELECT USING (true);

CREATE POLICY "Enable insert for all" ON camisetas
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all" ON camisetas
FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all" ON camisetas
FOR DELETE USING (true);

-- Product Images: Leitura pública, escrita para todos (desenvolvimento)
CREATE POLICY "Enable read for all" ON product_images
FOR SELECT USING (true);

CREATE POLICY "Enable insert for all" ON product_images
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all" ON product_images
FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all" ON product_images
FOR DELETE USING (true);

-- Admin Users: Apenas leitura
CREATE POLICY "Enable read for all" ON admin_users
FOR SELECT USING (true);

-- 11. POLÍTICAS PARA STORAGE
-- Remover políticas antigas
DROP POLICY IF EXISTS "Enable upload for all" ON storage.objects;
DROP POLICY IF EXISTS "Enable read for all" ON storage.objects;
DROP POLICY IF EXISTS "Enable delete for all" ON storage.objects;
DROP POLICY IF EXISTS "Enable update for all" ON storage.objects;

-- Criar novas políticas
CREATE POLICY "Enable upload for all" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'camisetas');

CREATE POLICY "Enable read for all" ON storage.objects
FOR SELECT USING (bucket_id = 'camisetas');

CREATE POLICY "Enable delete for all" ON storage.objects
FOR DELETE USING (bucket_id = 'camisetas');

CREATE POLICY "Enable update for all" ON storage.objects
FOR UPDATE USING (bucket_id = 'camisetas');

-- 12. VERIFICAÇÕES
-- Verificar estrutura das tabelas
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name IN ('camisetas', 'product_images', 'admin_users')
ORDER BY table_name, ordinal_position;

-- Verificar constraints
SELECT 
  tc.constraint_name, 
  tc.table_name, 
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  rc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
  ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'product_images';

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('camisetas', 'product_images', 'admin_users')
ORDER BY tablename, policyname;

-- 13. DADOS DE TESTE (OPCIONAL - Descomente se quiser)
/*
INSERT INTO camisetas (name, price, team) VALUES
('Camisa Brasil 2026', 199.90, 'Brasil'),
('Camisa Argentina 2026', 189.90, 'Argentina'),
('Camisa Flamengo 2026', 179.90, 'Flamengo');
*/

-- ============================================
-- FIM DO SETUP
-- ============================================

-- NOTAS IMPORTANTES:
-- 1. Execute este script no SQL Editor do Supabase
-- 2. Verifique se o bucket 'camisetas' existe no Storage
-- 3. Configure o bucket como PÚBLICO
-- 4. Em produção, ajuste as políticas RLS para serem mais restritivas
