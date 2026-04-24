# 🛠️ Guia de Desenvolvimento - PAPO 10

## 📦 Comandos Disponíveis

### Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Abrir em uma porta específica
npm run dev -- -p 3001

# Modo turbo (mais rápido)
npm run dev -- --turbo
```

### Build e Produção
```bash
# Criar build de produção
npm run build

# Iniciar servidor de produção
npm run start

# Build + Start
npm run build && npm run start
```

### Qualidade de Código
```bash
# Executar linter
npm run lint

# Corrigir problemas automaticamente
npm run lint -- --fix

# Verificar tipos TypeScript
npx tsc --noEmit
```

### Testes (quando implementados)
```bash
# Executar todos os testes
npm test

# Testes em modo watch
npm test -- --watch

# Cobertura de testes
npm test -- --coverage
```

## 🗂️ Estrutura de Pastas

```
catalogo-camisas/
├── app/                    # App Router do Next.js
│   ├── admin/             # Área administrativa
│   │   ├── login/         # Login do admin
│   │   └── page.tsx       # Dashboard admin
│   ├── page.tsx           # Página inicial (catálogo)
│   ├── layout.tsx         # Layout raiz
│   ├── globals.css        # Estilos globais
│   ├── loading.tsx        # Loading state
│   └── not-found.tsx      # Página 404
├── components/            # Componentes reutilizáveis
│   ├── Button.tsx         # Botão customizado
│   └── Input.tsx          # Input customizado
├── lib/                   # Utilitários e configurações
│   ├── supabase.ts        # Cliente Supabase
│   └── auth.ts            # Funções de autenticação
├── types/                 # Definições TypeScript
│   └── index.ts           # Tipos principais
├── public/                # Assets estáticos
│   ├── logo.jpeg          # Logo da marca
│   └── ...                # Outros assets
└── ...                    # Arquivos de configuração
```

## 🔧 Configurações Importantes

### Next.js Config (`next.config.ts`)
```typescript
const nextConfig = {
  images: {
    domains: ['pbfhdsvcantbvixhkqyj.supabase.co'], // Supabase storage
    formats: ['image/webp', 'image/avif'],
  },
  // Outras configurações...
}
```

### TypeScript Config (`tsconfig.json`)
- Strict mode habilitado
- Path aliases configurados (@/*)
- Incremental compilation

### Tailwind Config
- Tailwind CSS 4.0
- Custom colors e themes
- Plugins configurados

## 🎨 Padrões de Código

### Componentes React
```typescript
// Sempre use TypeScript
interface Props {
  title: string
  onClick?: () => void
}

export default function Component({ title, onClick }: Props) {
  return <div onClick={onClick}>{title}</div>
}
```

### Async/Await
```typescript
// Sempre trate erros
async function fetchData() {
  try {
    const { data, error } = await supabase.from('table').select()
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}
```

### Hooks
```typescript
// Use hooks no topo do componente
const [state, setState] = useState(initialValue)
const router = useRouter()

useEffect(() => {
  // Efeitos aqui
}, [dependencies])
```

## 🗄️ Trabalhando com Supabase

### Queries Básicas
```typescript
// SELECT
const { data, error } = await supabase
  .from('camisetas')
  .select('*')
  .order('created_at', { ascending: false })

// INSERT
const { data, error } = await supabase
  .from('camisetas')
  .insert([{ name: 'Produto', price: 100 }])
  .select()

// UPDATE
const { error } = await supabase
  .from('camisetas')
  .update({ price: 150 })
  .eq('id', productId)

// DELETE
const { error } = await supabase
  .from('camisetas')
  .delete()
  .eq('id', productId)
```

### Upload de Arquivos
```typescript
// Upload
const { error } = await supabase.storage
  .from('camisetas')
  .upload(fileName, file)

// Get URL
const { data } = supabase.storage
  .from('camisetas')
  .getPublicUrl(fileName)

// Delete
const { error } = await supabase.storage
  .from('camisetas')
  .remove([fileName])
```

## 🐛 Debug

### Console Logs
```typescript
// Desenvolvimento
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}
```

### React DevTools
- Instale a extensão React DevTools
- Inspecione componentes e props
- Monitore re-renders

### Network Tab
- Verifique requisições ao Supabase
- Analise tempos de resposta
- Identifique erros de API

## 🔐 Variáveis de Ambiente

### Criar arquivo `.env.local`
```bash
cp .env.example .env.local
```

### Acessar variáveis
```typescript
// Apenas variáveis com NEXT_PUBLIC_ são expostas ao cliente
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
```

## 📝 Convenções de Nomenclatura

### Arquivos
- Componentes: `PascalCase.tsx`
- Utilitários: `camelCase.ts`
- Tipos: `types.ts` ou `index.ts`

### Variáveis
- Constantes: `UPPER_SNAKE_CASE`
- Variáveis: `camelCase`
- Componentes: `PascalCase`
- Interfaces: `PascalCase` (sem prefixo I)

### Funções
- Handlers: `handleClick`, `handleSubmit`
- Fetchers: `fetchProducts`, `getUser`
- Setters: `setName`, `updatePrice`

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

### Variáveis de Ambiente no Vercel
1. Acesse o dashboard do projeto
2. Settings → Environment Variables
3. Adicione as variáveis do `.env.local`

## 🔄 Git Workflow

### Branches
```bash
# Criar nova branch
git checkout -b feature/nome-da-feature

# Commit
git add .
git commit -m "feat: descrição da feature"

# Push
git push origin feature/nome-da-feature
```

### Conventional Commits
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Manutenção

## 📊 Performance

### Lighthouse
```bash
# Instalar
npm i -g lighthouse

# Executar
lighthouse http://localhost:3000 --view
```

### Bundle Analyzer
```bash
# Instalar
npm i @next/bundle-analyzer

# Analisar
ANALYZE=true npm run build
```

## 🧪 Testes (Futuro)

### Jest + React Testing Library
```bash
npm i -D jest @testing-library/react @testing-library/jest-dom
```

### Cypress (E2E)
```bash
npm i -D cypress
npx cypress open
```

## 📚 Recursos Úteis

### Documentação
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

### Ferramentas
- [VS Code](https://code.visualstudio.com/)
- [Postman](https://www.postman.com/) - Testar APIs
- [Figma](https://www.figma.com/) - Design
- [Excalidraw](https://excalidraw.com/) - Diagramas

### Extensões VS Code Recomendadas
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint
- GitLens
- Auto Rename Tag
- Path Intellisense

## 💡 Dicas

1. **Use TypeScript** - Evita muitos bugs
2. **Componentes pequenos** - Mais fácil de manter
3. **Nomeie bem** - Código auto-documentado
4. **Comente quando necessário** - Explique o "porquê"
5. **Teste localmente** - Antes de fazer push
6. **Commits frequentes** - Pequenos e descritivos
7. **Code review** - Sempre revise antes de merge
8. **Performance** - Otimize imagens e código

---

**Happy Coding! 🚀**
