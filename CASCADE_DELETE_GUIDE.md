# 🗑️ Guia de Exclusão em Cascata - PAPO 10

## 📋 Como Funciona

Quando você deleta um produto, o sistema remove automaticamente:

1. ✅ **Arquivos de imagem do Storage** (via código JavaScript)
2. ✅ **Registros da tabela `product_images`** (via CASCADE DELETE do SQL)
3. ✅ **Registro da tabela `camisetas`** (ação principal)

## 🔧 Configuração Necessária

### Passo 1: Execute o SQL

Execute o arquivo `SUPABASE_FIX_CASCADE_DELETE.sql` no Supabase SQL Editor.

Isso vai:
- Remover constraint antiga (se existir)
- Adicionar constraint com `ON DELETE CASCADE`
- Verificar se funcionou

### Passo 2: Verifique a Configuração

```sql
-- Execute no Supabase SQL Editor
SELECT 
    tc.constraint_name, 
    rc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.referential_constraints AS rc
    ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'product_images';
```

**Resultado esperado:**
```
constraint_name: product_images_product_id_fkey
delete_rule: CASCADE
```

Se `delete_rule` não for `CASCADE`, execute novamente o SQL.

## 🎯 Fluxo de Exclusão

### Quando você clica em "Excluir" no painel admin:

```
1. Usuário clica em "Excluir"
   ↓
2. Confirmação: "Deseja realmente excluir?"
   ↓
3. JavaScript busca todas as imagens do produto
   ↓
4. JavaScript deleta cada arquivo do Storage
   ↓
5. JavaScript deleta registros de product_images (redundante com CASCADE)
   ↓
6. JavaScript deleta o produto da tabela camisetas
   ↓
7. SQL CASCADE DELETE remove automaticamente registros órfãos (se houver)
   ↓
8. Sucesso! Produto e imagens removidos
```

## 🧪 Como Testar

### Teste 1: Exclusão Normal

1. **Crie um produto de teste:**
   - Acesse `/admin`
   - Clique em "+ Novo Produto"
   - Preencha: Nome: "Teste DELETE", Preço: 99.99, Time: "Teste"
   - Adicione 2-3 imagens
   - Salve

2. **Verifique no banco:**
   ```sql
   -- Anote o ID do produto criado
   SELECT id, name FROM camisetas WHERE name = 'Teste DELETE';
   
   -- Verifique as imagens (substitua 999 pelo ID real)
   SELECT * FROM product_images WHERE product_id = 999;
   ```

3. **Delete o produto:**
   - No painel admin, clique em "Excluir"
   - Confirme

4. **Verifique se foi removido:**
   ```sql
   -- Produto deve ter sumido
   SELECT * FROM camisetas WHERE name = 'Teste DELETE';
   -- Resultado: 0 linhas
   
   -- Imagens devem ter sumido
   SELECT * FROM product_images WHERE product_id = 999;
   -- Resultado: 0 linhas
   ```

### Teste 2: Verificar Storage

1. **Antes de deletar:**
   - Vá no Supabase → Storage → camisetas
   - Anote os nomes dos arquivos

2. **Depois de deletar:**
   - Verifique se os arquivos sumiram
   - ✅ Devem ter sido removidos

### Teste 3: Imagens Órfãs

```sql
-- Verificar se há imagens sem produto
SELECT pi.* 
FROM product_images pi
LEFT JOIN camisetas c ON pi.product_id = c.id
WHERE c.id IS NULL;

-- Resultado esperado: 0 linhas (nenhuma imagem órfã)
```

## ⚠️ Problemas Comuns

### Problema 1: Imagens não são removidas do banco

**Causa:** CASCADE DELETE não configurado

**Solução:**
```sql
-- Execute no Supabase
ALTER TABLE product_images 
DROP CONSTRAINT IF EXISTS product_images_product_id_fkey;

ALTER TABLE product_images 
ADD CONSTRAINT product_images_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES camisetas(id) 
ON DELETE CASCADE;
```

### Problema 2: Arquivos não são removidos do Storage

**Causa:** Permissões do Storage ou erro no código

**Verificação:**
1. Abra o console do navegador (F12)
2. Tente deletar um produto
3. Procure por erros relacionados a "storage"

**Solução:**
```sql
-- Verificar políticas do Storage
SELECT * FROM storage.policies WHERE bucket_id = 'camisetas';

-- Deve ter política de DELETE
-- Se não tiver, execute:
CREATE POLICY "Enable delete for all" ON storage.objects
FOR DELETE USING (bucket_id = 'camisetas');
```

### Problema 3: Erro "violates foreign key constraint"

**Causa:** CASCADE DELETE não está funcionando

**Solução:**
1. Execute `SUPABASE_FIX_CASCADE_DELETE.sql`
2. Verifique se `delete_rule = CASCADE`
3. Tente novamente

### Problema 4: Imagens órfãs no banco

**Causa:** Produtos foram deletados antes do CASCADE ser configurado

**Solução:**
```sql
-- Limpar imagens órfãs
DELETE FROM product_images
WHERE product_id NOT IN (SELECT id FROM camisetas);

-- Verificar
SELECT COUNT(*) FROM product_images pi
LEFT JOIN camisetas c ON pi.product_id = c.id
WHERE c.id IS NULL;
-- Deve retornar: 0
```

## 📊 Monitoramento

### Verificar integridade dos dados

```sql
-- Total de produtos
SELECT COUNT(*) as total_produtos FROM camisetas;

-- Total de imagens
SELECT COUNT(*) as total_imagens FROM product_images;

-- Produtos com imagens
SELECT COUNT(DISTINCT product_id) as produtos_com_imagens 
FROM product_images;

-- Produtos sem imagens
SELECT COUNT(*) as produtos_sem_imagens
FROM camisetas c
LEFT JOIN product_images pi ON c.id = pi.product_id
WHERE pi.id IS NULL;

-- Imagens órfãs (não deveria ter nenhuma)
SELECT COUNT(*) as imagens_orfas
FROM product_images pi
LEFT JOIN camisetas c ON pi.product_id = c.id
WHERE c.id IS NULL;
```

## 🔍 Debug

### Ver logs detalhados

O código já tem logs no console:

```javascript
console.error('Erro ao excluir:', error)
```

**Como ver:**
1. Abra o DevTools (F12)
2. Vá na aba Console
3. Tente deletar um produto
4. Veja os logs

### Testar manualmente no SQL

```sql
-- Criar produto de teste
INSERT INTO camisetas (name, price, team) 
VALUES ('Teste Manual', 50.00, 'Teste')
RETURNING id;

-- Adicionar imagens (substitua 999 pelo ID retornado)
INSERT INTO product_images (product_id, image_url, display_order)
VALUES 
    (999, 'https://exemplo.com/img1.jpg', 0),
    (999, 'https://exemplo.com/img2.jpg', 1);

-- Verificar
SELECT * FROM product_images WHERE product_id = 999;

-- Deletar produto
DELETE FROM camisetas WHERE id = 999;

-- Verificar se imagens foram deletadas automaticamente
SELECT * FROM product_images WHERE product_id = 999;
-- Deve retornar: 0 linhas ✅
```

## ✅ Checklist de Verificação

Antes de usar em produção:

- [ ] CASCADE DELETE configurado (`delete_rule = CASCADE`)
- [ ] Políticas de Storage permitem DELETE
- [ ] Teste de exclusão funciona
- [ ] Imagens são removidas do banco
- [ ] Arquivos são removidos do Storage
- [ ] Não há imagens órfãs
- [ ] Console não mostra erros
- [ ] Loading aparece durante exclusão

## 📚 Referências

- `SUPABASE_FIX_CASCADE_DELETE.sql` - Script de configuração
- `app/admin/page.tsx` - Código de exclusão
- `ADMIN_TROUBLESHOOTING.md` - Troubleshooting geral

---

## 🎯 Resumo

**O que acontece ao deletar um produto:**

1. ✅ Arquivos de imagem são removidos do Storage (JavaScript)
2. ✅ Registros de `product_images` são removidos (CASCADE DELETE)
3. ✅ Produto é removido de `camisetas` (ação principal)

**Configuração necessária:**
- Execute `SUPABASE_FIX_CASCADE_DELETE.sql`
- Verifique `delete_rule = CASCADE`
- Teste a exclusão

**Tudo funcionando?**
- Produto some da lista ✅
- Imagens somem do banco ✅
- Arquivos somem do Storage ✅
- Sem erros no console ✅

---

**Versão:** 3.1  
**Data:** Abril 2026
