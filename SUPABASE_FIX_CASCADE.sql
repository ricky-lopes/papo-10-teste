-- Execute este SQL no Supabase para corrigir problemas de exclusão

-- 1. Remover constraint antiga (se existir)
ALTER TABLE product_images 
DROP CONSTRAINT IF EXISTS product_images_product_id_fkey;

-- 2. Adicionar constraint com CASCADE DELETE
-- Isso garante que ao deletar um produto, suas imagens também sejam deletadas
ALTER TABLE product_images 
ADD CONSTRAINT product_images_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES camisetas(id) 
ON DELETE CASCADE;

-- 3. Verificar se funcionou
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

-- Resultado esperado: delete_rule = 'CASCADE'

-- 4. Testar (CUIDADO: isso vai deletar dados!)
-- Descomente apenas se quiser testar
-- DELETE FROM camisetas WHERE id = 999; -- Use um ID de teste
-- SELECT * FROM product_images WHERE product_id = 999; -- Deve retornar vazio

-- 5. Garantir que as políticas RLS estão corretas
-- Permitir todas as operações (para desenvolvimento)
DROP POLICY IF EXISTS "Enable all for authenticated users" ON product_images;
CREATE POLICY "Enable all for authenticated users" ON product_images
FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all for authenticated users" ON camisetas;
CREATE POLICY "Enable all for authenticated users" ON camisetas
FOR ALL USING (true);

-- 6. Políticas para o Storage
-- Permitir upload
DROP POLICY IF EXISTS "Enable upload for all" ON storage.objects;
CREATE POLICY "Enable upload for all" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'camisetas');

-- Permitir leitura
DROP POLICY IF EXISTS "Enable read for all" ON storage.objects;
CREATE POLICY "Enable read for all" ON storage.objects
FOR SELECT USING (bucket_id = 'camisetas');

-- Permitir delete
DROP POLICY IF EXISTS "Enable delete for all" ON storage.objects;
CREATE POLICY "Enable delete for all" ON storage.objects
FOR DELETE USING (bucket_id = 'camisetas');

-- Permitir update
DROP POLICY IF EXISTS "Enable update for all" ON storage.objects;
CREATE POLICY "Enable update for all" ON storage.objects
FOR UPDATE USING (bucket_id = 'camisetas');

-- 7. Verificar estrutura da tabela camisetas
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'camisetas'
ORDER BY ordinal_position;

-- 8. Verificar estrutura da tabela product_images
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'product_images'
ORDER BY ordinal_position;

-- NOTA: Se a tabela camisetas usar UUID em vez de serial/integer,
-- você precisará alterar o tipo de product_id em product_images:
-- ALTER TABLE product_images ALTER COLUMN product_id TYPE UUID USING product_id::UUID;
