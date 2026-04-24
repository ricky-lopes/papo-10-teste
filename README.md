# ⚽ PAPO 10 - Catálogo de Camisetas

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Latest-3ecf8e?style=flat-square&logo=supabase)

Catálogo moderno e sofisticado de camisetas de time com painel administrativo completo.

## ✨ Funcionalidades

### 🛍️ Catálogo Público
- Design moderno preto e branco
- Galeria de produtos com múltiplas imagens
- Modal de detalhes do produto
- Animações suaves com Framer Motion
- Layout totalmente responsivo
- Hero section impactante

### 🔐 Painel Administrativo
- Sistema de autenticação
- CRUD completo de produtos
- Upload de múltiplas imagens por produto
- Pesquisa e filtros
- Paginação inteligente
- Gerenciamento de imagens

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+ instalado
- Conta no Supabase
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone <seu-repositorio>
cd catalogo-camisas
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o Supabase**
   - Acesse o [Supabase](https://supabase.com)
   - Execute o SQL em `SUPABASE_SETUP.sql`
   - Configure o bucket de storage `camisetas`

4. **Execute o projeto**
```bash
npm run dev
```

5. **Acesse**
   - Catálogo: http://localhost:3000
   - Admin: http://localhost:3000/admin/login

## 🔑 Credenciais Padrão

**Email:** admin@papo10.com  
**Senha:** admin123

⚠️ Altere em produção!

## 📁 Estrutura do Projeto

```
catalogo-camisas/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx      # Página de login
│   │   └── page.tsx          # Painel admin
│   ├── page.tsx              # Catálogo público
│   ├── layout.tsx            # Layout principal
│   ├── globals.css           # Estilos globais
│   ├── loading.tsx           # Página de loading
│   └── not-found.tsx         # Página 404
├── components/
│   ├── Button.tsx            # Componente de botão
│   └── Input.tsx             # Componente de input
├── lib/
│   ├── supabase.ts           # Cliente Supabase
│   └── auth.ts               # Funções de autenticação
├── public/
│   └── logo.jpeg             # Logo da marca
├── SUPABASE_SETUP.sql        # Script SQL
├── SETUP_INSTRUCTIONS.md     # Instruções detalhadas
└── LOGO_INSTRUCTIONS.md      # Como converter logo
```

## 🗄️ Banco de Dados

### Tabelas

**camisetas**
- id, name, price, team, created_at

**product_images**
- id, product_id, image_url, display_order, created_at

**admin_users**
- id, email, password_hash, created_at

## 🎨 Tecnologias

- **Framework:** Next.js 16.2 (App Router)
- **UI:** React 19.2 + TypeScript
- **Estilização:** Tailwind CSS 4.0
- **Animações:** Framer Motion
- **Backend:** Supabase (PostgreSQL + Storage)
- **Autenticação:** Custom (localStorage)

## 📱 Responsividade

- 📱 Mobile: 1 coluna
- 📱 Tablet: 2 colunas  
- 💻 Desktop: 4 colunas

## 🔒 Segurança

Para produção, implemente:
- ✅ Hash bcrypt para senhas
- ✅ JWT para autenticação
- ✅ Row Level Security (RLS)
- ✅ Variáveis de ambiente
- ✅ Rate limiting
- ✅ HTTPS obrigatório

## 📚 Documentação Adicional

- [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) - Guia completo de configuração
- [LOGO_INSTRUCTIONS.md](./LOGO_INSTRUCTIONS.md) - Como converter a logo

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Outras plataformas
- Netlify
- Railway
- Render

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto é privado e proprietário.

---

**Desenvolvido com ❤️ para PAPO 10**  
*Performance & Estilo*
