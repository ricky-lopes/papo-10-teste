# 📱 Configuração WhatsApp e Instagram - PAPO 10

## 🔧 Como Configurar

### 1. WhatsApp

Abra o arquivo `app/page.tsx` e localize esta linha (próximo ao início do componente):

```typescript
const whatsappNumber = '5511999999999' // ALTERE PARA SEU NÚMERO
```

**Formato do número:**
- Código do país: 55 (Brasil)
- DDD: 11, 21, 31, etc.
- Número: 9 dígitos (com o 9 na frente)

**Exemplos:**
- São Paulo: `5511999887766`
- Rio de Janeiro: `5521988776655`
- Belo Horizonte: `5531977665544`

### 2. Instagram

Na mesma linha, configure seu Instagram:

```typescript
const instagramHandle = '@papo10oficial' // ALTERE PARA SEU INSTAGRAM
```

**Formato:**
- Mantenha o `@` no início
- Use apenas o nome de usuário
- Exemplo: `@papo10oficial`

## 📝 Exemplo Completo

```typescript
export default function Home() {
  const [produtos, setProdutos] = useState<ProductWithImages[]>([])
  const [filteredProdutos, setFilteredProdutos] = useState<ProductWithImages[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<ProductWithImages | null>(null)

  // Configure aqui 👇
  const whatsappNumber = '5511987654321' // SEU NÚMERO
  const instagramHandle = '@papo10oficial' // SEU INSTAGRAM
```

## 🎯 Funcionalidades Implementadas

### WhatsApp
- ✅ Botão no Hero (Fale Conosco)
- ✅ Seção de Contato
- ✅ Modal do produto (Verificar Disponibilidade)
- ✅ Mensagem personalizada com nome do produto

### Instagram
- ✅ Botão na seção de Contato
- ✅ Link direto para o perfil
- ✅ Ícone do Instagram

## 📱 Mensagens Automáticas

### Quando clicar em "Verificar Disponibilidade":
```
Olá! Gostaria de verificar a disponibilidade da [Nome da Camiseta] - [Time]
```

### Quando clicar em "Fale Conosco":
```
Olá! Gostaria de mais informações sobre os produtos.
```

## 🧪 Como Testar

1. **Salve as alterações** no arquivo `app/page.tsx`
2. **Reinicie o servidor** (se necessário)
3. **Abra o site** no navegador
4. **Clique nos botões** de WhatsApp
5. **Verifique** se abre o WhatsApp Web/App com a mensagem correta

## 🔍 Verificação

### WhatsApp
- [ ] Número está no formato correto (55 + DDD + número)
- [ ] Botão "Fale Conosco" funciona
- [ ] Botão "Verificar Disponibilidade" funciona
- [ ] Mensagem aparece corretamente no WhatsApp

### Instagram
- [ ] Handle está correto (com @)
- [ ] Botão redireciona para o perfil
- [ ] Perfil abre corretamente

## 🚨 Problemas Comuns

### WhatsApp não abre
- Verifique se o número está no formato correto
- Certifique-se de incluir o código do país (55)
- Não use espaços, traços ou parênteses

### Instagram não abre
- Verifique se o @ está incluído
- Certifique-se de que o nome de usuário está correto
- Teste o link manualmente: `https://instagram.com/seuusuario`

## 💡 Dicas

1. **Teste em diferentes dispositivos:**
   - Desktop: Abre WhatsApp Web
   - Mobile: Abre o app do WhatsApp

2. **Personalize as mensagens:**
   - Edite a função `handleWhatsAppContact()` em `app/page.tsx`
   - Adicione mais informações na mensagem

3. **Adicione mais redes sociais:**
   - Copie o botão do Instagram
   - Altere o link e o ícone
   - Adicione Facebook, Twitter, etc.

## 📞 Exemplo de Uso

```typescript
// Mensagem personalizada
function handleWhatsAppContact(product?: ProductWithImages) {
  const message = product
    ? `Olá! Gostaria de verificar a disponibilidade da ${product.name} - ${product.team}. Qual o prazo de entrega?`
    : 'Olá! Gostaria de saber mais sobre as camisetas disponíveis e formas de pagamento.'
  
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank')
}
```

---

**Pronto!** Agora seu site está integrado com WhatsApp e Instagram. 🎉
