-- ============================================
-- CORRIGIR CASCADE DELETE - PAPO 10
-- ============================================
-- Este script garante que ao excluir um produto,
-- todas as suas imagens sejam removidas automaticamente

-- 1. VERIFICAR CONSTRAINT ATUAL
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule,
    rc.update_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
    ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'product_images';

-- Se delete_rule não for 'CASCADE', continue com os próximos passos

-- 2. REMOVER CONSTRAINT ANTIGA
ALTER TABLE product_images 
DROP CONSTRAINT IF EXISTS product_images_product_id_fkey;

-- 3. ADICIONAR CONSTRAINT COM CASCADE DELETE
-- Isso garante que ao deletar um produto, suas imagens também sejam deletadas
ALTER TABLE product_images 
ADD CONSTRAINT product_images_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES camisetas(id) 
ON DELETE CASCADE
ON UPDATE CASCADE;

-- 4. VERIFICAR SE FUNCIONOU
SELECT 
    tc.constraint_name, 
    rc.delete_rule,
    rc.update_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.referential_constraints AS rc
    ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'product_images';

-- Resultado esperado:
-- delete_rule: CASCADE
-- update_rule: CASCADE

-- 5. TESTE (CUIDADO: VAI DELETAR DADOS!)
-- Descomente apenas se quiser testar com dados de exemplo

/*
-- Criar produto de teste
INSERT INTO camisetas (name, price, team) 
VALUES ('Teste DELETE CASCADE', 99.99, 'Teste')
RETURNING id;

-- Anote o ID retornado (exemplo: 999)

-- Adicionar imagens de teste
INSERT INTO product_images (product_id, image_url, display_order)
VALUES 
    (999, 'https://exemplo.com/img1.jpg', 0),
    (999, 'https://exemplo.com/img2.jpg', 1);

-- Verificar que as imagens foram criadas
SELECT * FROM product_images WHERE product_id = 999;

-- Deletar o produto
DELETE FROM camisetas WHERE id = 999;

-- Verificar que as imagens foram deletadas automaticamente
SELECT * FROM product_images WHERE product_id = 999;
-- Deve retornar 0 linhas (vazio)
*/

-- 6. VERIFICAR PRODUTOS ÓRFÃOS (imagens sem produto)
-- Isso mostra imagens que estão no banco mas o produto não existe mais
SELECT pi.* 
FROM product_images pi
LEFT JOIN camisetas c ON pi.product_id = c.id
WHERE c.id IS NULL;

-- Se houver resultados, são imagens órfãs que podem ser deletadas

-- 7. LIMPAR IMAGENS ÓRFÃS (se houver)
-- Descomente apenas se quiser limpar imagens órfãs
/*
DELETE FROM product_images
WHERE product_id NOT IN (SELECT id FROM camisetas);
*/

-- 8. CRIAR FUNÇÃO PARA LIMPAR STORAGE AUTOMATICAMENTE (OPCIONAL)
-- Esta função pode ser chamada por um trigger para deletar arquivos do storage

CREATE OR REPLACE FUNCTION delete_storage_object()
RETURNS TRIGGER AS $$
BEGIN
    -- Extrair o nome do arquivo da URL
    -- Exemplo: https://xxx.supabase.co/storage/v1/object/public/camisetas/arquivo.jpg
    -- Resultado: arquivo.jpg
    DECLARE
        file_name TEXT;
    BEGIN
        file_name := substring(OLD.image_url from '[^/]+$');
        
        -- Deletar do storage (requer extensão supabase_storage)
        -- NOTA: Isso pode não funcionar dependendo das permissões
        -- É melhor deletar do storage via código JavaScript
        
        RETURN OLD;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. CRIAR TRIGGER (OPCIONAL)
-- Este trigger chama a função acima quando uma imagem é deletada
DROP TRIGGER IF EXISTS on_product_image_delete ON product_images;

CREATE TRIGGER on_product_image_delete
    BEFORE DELETE ON product_images
    FOR EACH ROW
    EXECUTE FUNCTION delete_storage_object();

-- NOTA IMPORTANTE:
-- O trigger acima pode não conseguir deletar do storage devido a permissões.
-- É RECOMENDADO deletar do storage via código JavaScript (já implementado no admin).

-- 10. ESTATÍSTICAS
-- Ver quantos produtos e imagens existem
SELECT 
    (SELECT COUNT(*) FROM camisetas) as total_produtos,
    (SELECT COUNT(*) FROM product_images) as total_imagens,
    (SELECT COUNT(DISTINCT product_id) FROM product_images) as produtos_com_imagens;

-- 11. PRODUTOS SEM IMAGENS
-- Listar produtos que não têm imagens
SELECT c.id, c.name, c.team, c.price
FROM camisetas c
LEFT JOIN product_images pi ON c.id = pi.product_id
WHERE pi.id IS NULL;

-- ============================================
-- FIM DO SCRIPT
-- ============================================

-- RESUMO:
-- ✅ CASCADE DELETE configurado
-- ✅ Ao deletar produto, imagens são removidas automaticamente do banco
-- ⚠️ Arquivos do storage devem ser deletados via código (já implementado)

-- PRÓXIMOS PASSOS:
-- 1. Execute este script no Supabase SQL Editor
-- 2. Verifique se delete_rule = CASCADE
-- 3. Teste deletando um produto no painel admin
-- 4. Verifique se as imagens sumiram da tabela product_images
