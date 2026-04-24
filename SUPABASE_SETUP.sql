-- Execute este SQL no Supabase SQL Editor

-- 1. Criar tabela de admins
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Inserir um admin padrão (senha: admin123)
-- Nota: Em produção, use bcrypt. Este é apenas para desenvolvimento
INSERT INTO admin_users (email, password_hash) 
VALUES ('admin@papo10.com', 'admin123')
ON CONFLICT (email) DO NOTHING;

-- 3. Criar tabela de imagens de produtos
CREATE TABLE IF NOT EXISTS product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES camisetas(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Adicionar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

-- 5. Migrar imagens existentes da tabela camisetas para product_images
INSERT INTO product_images (product_id, image_url, display_order)
SELECT id, imagem_url, 0
FROM camisetas
WHERE imagem_url IS NOT NULL;

-- 6. Adicionar coluna id UUID na tabela camisetas se não existir
-- (caso a tabela use id serial, precisamos manter compatibilidade)
-- ALTER TABLE camisetas ADD COLUMN IF NOT EXISTS uuid_id UUID DEFAULT gen_random_uuid();

-- 7. Habilitar RLS (Row Level Security) - opcional mas recomendado
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- 8. Políticas de acesso
CREATE POLICY "Public read access" ON product_images FOR SELECT USING (true);
CREATE POLICY "Admin full access" ON product_images FOR ALL USING (true);
CREATE POLICY "Admin read access" ON admin_users FOR SELECT USING (true);
