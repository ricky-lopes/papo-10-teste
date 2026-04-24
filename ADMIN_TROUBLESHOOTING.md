# 🔧 Troubleshooting - Painel Admin

## ✅ Correções Aplicadas

### 1. Tipo de ID Corrigido
- ✅ Alterado de `string` para `number`
- ✅ Compatível com tabela `camisetas` (serial/integer)

### 2. Função de Exclusão Melhorada
- ✅ Deleta imagens do storage
- ✅ Deleta registros de `product_images`
- ✅ Deleta o produto
- ✅ Tratamento de erros aprimorado
- ✅ Logs no console para debug

### 3. Função de Edição Melhorada
- ✅ Validação de campos
- ✅ Upload de múltiplas imagens
- ✅ Nomes de arquivo sanitizados
- ✅ Tratamento de erros completo
- ✅ Logs detalhados

### 4. Função de Deletar Imagem
- ✅ Remove do storage
- ✅ Remove do banco de dados
- ✅ Atualiza interface imediatamente
- ✅ Confirmação antes de deletar

## 🐛 Problemas Comuns e Soluções

### Problema: "Erro ao excluir produto"

**Possíveis causas:**
1. Produto não existe
2. Permissões do Supabase
3. Cascade delete não configurado

**Solução:**
```sql
-- Execute no Supabase SQL Editor
ALTER TABLE product_images 
DROP CONSTRAINT IF EXISTS product_images_product_id_fkey;

ALTER TABLE product_images 
ADD CONSTRAINT product_images_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES camisetas(id) 
ON DELETE CASCADE;
```

### Problema: "Erro ao atualizar produto"

**Verificar:**
1. Abra o console do navegador (F12)
2. Vá na aba Console
3. Procure por erros em vermelho
4. Verifique a mensagem de erro

**Soluções comuns:**
- Campos vazios: Preencha todos os campos
- Preço inválido: Use apenas números
- Permissões: Verifique RLS no Supabase

### Problema: "Imagens não aparecem após upload"

**Verificar:**
1. Bucket `camisetas` existe?
2. Bucket está público?
3. URL da imagem está correta?

**Solução:**
```sql
-- Verificar se as imagens foram inseridas
SELECT * FROM product_images WHERE product_id = SEU_PRODUTO_ID;
```

### Problema: "Não consigo deletar imagem"

**Verificar:**
1. Console do navegador (F12)
2. Mensagem de erro
3. Permissões do storage

**Solução:**
- Verifique se o bucket permite delete
- Verifique as políticas de RLS

## 🔍 Como Debugar

### 1. Abrir Console do Navegador
- Pressione **F12**
- Vá na aba **Console**
- Procure por mensagens em vermelho

### 2. Verificar Network
- Aba **Network** no DevTools
- Filtre por "Fetch/XHR"
- Veja as requisições ao Supabase
- Verifique status codes (200 = OK, 400/500 = Erro)

### 3. Logs Adicionados
O código agora tem `console.error()` em vários lugares:
- Erro ao criar produto
- Erro ao atualizar produto
- Erro ao deletar produto
- Erro ao fazer upload
- Erro ao deletar imagem

### 4. Testar no Supabase
```sql
-- Testar se consegue deletar manualmente
DELETE FROM camisetas WHERE id = 1;

-- Testar se consegue atualizar
UPDATE camisetas SET name = 'Teste' WHERE id = 1;

-- Ver todas as imagens
SELECT * FROM product_images;
```

## 📋 Checklist de Verificação

### Antes de Editar/Deletar:
- [ ] Produto existe na lista
- [ ] ID do produto é válido
- [ ] Você está autenticado
- [ ] Console não tem erros

### Ao Editar:
- [ ] Todos os campos preenchidos
- [ ] Preço é um número válido
- [ ] Imagens (se adicionar) são válidas
- [ ] Formato de imagem suportado (jpg, png, webp)

### Ao Deletar:
- [ ] Confirmou a exclusão
- [ ] Aguardou a mensagem de sucesso
- [ ] Produto sumiu da lista
- [ ] Imagens foram removidas do storage

## 🔐 Permissões do Supabase

### Verificar RLS (Row Level Security)

```sql
-- Ver políticas da tabela camisetas
SELECT * FROM pg_policies WHERE tablename = 'camisetas';

-- Ver políticas da tabela product_images
SELECT * FROM pg_policies WHERE tablename = 'product_images';
```

### Políticas Recomendadas

```sql
-- Permitir tudo para usuários autenticados (desenvolvimento)
CREATE POLICY "Enable all for authenticated users" ON camisetas
FOR ALL USING (true);

CREATE POLICY "Enable all for authenticated users" ON product_images
FOR ALL USING (true);

-- Storage: Permitir upload e delete
CREATE POLICY "Enable upload for authenticated users" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'camisetas');

CREATE POLICY "Enable delete for authenticated users" ON storage.objects
FOR DELETE USING (bucket_id = 'camisetas');
```

## 🧪 Testes

### Teste 1: Criar Produto
1. Clique em "+ Novo Produto"
2. Preencha todos os campos
3. Adicione 2-3 imagens
4. Clique em "Criar Produto"
5. ✅ Deve aparecer na lista

### Teste 2: Editar Produto
1. Clique em "Editar" em um produto
2. Altere o nome
3. Adicione mais uma imagem
4. Clique em "Salvar Alterações"
5. ✅ Deve atualizar na lista

### Teste 3: Deletar Imagem
1. Edite um produto
2. Clique no X de uma imagem
3. Confirme
4. ✅ Imagem deve sumir

### Teste 4: Deletar Produto
1. Clique em "Excluir"
2. Confirme
3. ✅ Produto deve sumir da lista

## 📞 Ainda com Problemas?

### Informações para Debug:

1. **Mensagem de erro completa** (do console)
2. **Ação que estava fazendo** (criar, editar, deletar)
3. **Dados do produto** (nome, preço, etc.)
4. **Screenshot do erro** (se possível)

### Comandos Úteis:

```bash
# Ver logs do servidor
# (no terminal onde está rodando npm run dev)

# Limpar cache
rm -rf .next
npm run dev

# Reinstalar dependências
rm -rf node_modules
npm install
```

## 💡 Dicas

1. **Sempre verifique o console** antes de reportar erro
2. **Teste com dados simples** primeiro
3. **Use imagens pequenas** para testes (< 1MB)
4. **Faça backup** antes de deletar em massa
5. **Teste em ambiente de desenvolvimento** primeiro

---

**Última atualização:** Abril 2026  
**Versão:** 2.1
