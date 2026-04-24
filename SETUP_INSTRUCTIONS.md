# 🎯 Instruções de Configuração - PAPO 10

## 📋 Passo a Passo

### 1. Configurar o Banco de Dados Supabase

1. Acesse seu projeto no [Supabase](https://supabase.com)
2. Vá em **SQL Editor**
3. Copie e execute o conteúdo do arquivo `SUPABASE_SETUP.sql`

Isso vai criar:
- ✅ Tabela `admin_users` (usuários administrativos)
- ✅ Tabela `product_images` (múltiplas imagens por produto)
- ✅ Usuário admin padrão: `admin@papo10.com` / `admin123`
- ✅ Migração das imagens existentes

### 2. Configurar Storage no Supabase

1. No Supabase, vá em **Storage**
2. Verifique se o bucket `camisetas` existe
3. Se não existir, crie um novo bucket chamado `camisetas`
4. Configure o bucket como **público**

### 3. Instalar Dependências

```bash
npm install
```

### 4. Executar o Projeto

```bash
npm run dev
```

Acesse: `http://localhost:3000`

## 🔐 Acesso Administrativo

**URL:** `http://localhost:3000/admin/login`

**Credenciais padrão:**
- Email: `admin@papo10.com`
- Senha: `admin123`

⚠️ **IMPORTANTE:** Altere essas credenciais em produção!

## 🎨 Funcionalidades Implementadas

### Painel Admin (`/admin`)
- ✅ Sistema de login com autenticação
- ✅ CRUD completo de produtos
- ✅ Upload de múltiplas imagens por produto
- ✅ Pesquisa de produtos
- ✅ Paginação (10 itens por página)
- ✅ Edição e exclusão de produtos
- ✅ Gerenciamento de imagens (adicionar/remover)

### Catálogo Público (`/`)
- ✅ Design moderno preto e branco
- ✅ Exibição de múltiplas imagens
- ✅ Modal de detalhes do produto
- ✅ Animações suaves com Framer Motion
- ✅ Layout responsivo
- ✅ Hero section sofisticado

## 🗄️ Estrutura do Banco de Dados

### Tabela: `camisetas`
```sql
- id (UUID/Serial)
- name (TEXT)
- price (NUMERIC)
- team (TEXT)
- created_at (TIMESTAMP)
```

### Tabela: `product_images`
```sql
- id (UUID)
- product_id (UUID) → FK para camisetas
- image_url (TEXT)
- display_order (INTEGER)
- created_at (TIMESTAMP)
```

### Tabela: `admin_users`
```sql
- id (UUID)
- email (TEXT)
- password_hash (TEXT)
- created_at (TIMESTAMP)
```

## 🔒 Segurança

⚠️ **Para Produção:**

1. **Senhas:** Implemente hash bcrypt para senhas
2. **JWT:** Use tokens JWT para autenticação
3. **RLS:** Configure Row Level Security no Supabase
4. **Variáveis de Ambiente:** Mova credenciais para `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_key
```

## 🎨 Personalização da Logo

Para usar a logo com fundo transparente:

1. Edite `public/logo.jpeg` com um editor de imagens
2. Remova o fundo
3. Salve como `public/logo.png` (PNG suporta transparência)
4. Atualize as referências no código de `.jpeg` para `.png`

## 📱 Responsividade

O projeto é totalmente responsivo:
- 📱 Mobile: 1 coluna
- 📱 Tablet: 2 colunas
- 💻 Desktop: 4 colunas

## 🚀 Próximos Passos Sugeridos

- [ ] Implementar carrinho de compras
- [ ] Integrar gateway de pagamento
- [ ] Sistema de categorias
- [ ] Filtros avançados
- [ ] Sistema de avaliações
- [ ] Painel de analytics
- [ ] Notificações por email
- [ ] Sistema de cupons de desconto

## 📞 Suporte

Para dúvidas ou problemas, verifique:
1. Console do navegador (F12)
2. Logs do Supabase
3. Configurações de CORS e Storage

---

**Desenvolvido com ❤️ para PAPO 10**
