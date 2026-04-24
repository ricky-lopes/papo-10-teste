// Tipos do Produto
export interface Product {
  id: string
  name: string
  price: number
  team: string
  created_at?: string
}

// Produto com imagens
export interface ProductWithImages extends Product {
  images: string[]
}

// Imagem do produto
export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  display_order: number
  created_at?: string
}

// Usuário Admin
export interface AdminUser {
  id: string
  email: string
  created_at?: string
}

// Formulário de produto
export interface ProductFormData {
  name: string
  price: string
  team: string
}

// Resposta de autenticação
export interface AuthResponse {
  user: AdminUser | null
  error?: string
}

// Paginação
export interface PaginationProps {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
}

// Modal Props
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

// Supabase Database Types
export interface Database {
  public: {
    Tables: {
      camisetas: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at'>
        Update: Partial<Omit<Product, 'id' | 'created_at'>>
      }
      product_images: {
        Row: ProductImage
        Insert: Omit<ProductImage, 'id' | 'created_at'>
        Update: Partial<Omit<ProductImage, 'id' | 'created_at'>>
      }
      admin_users: {
        Row: AdminUser & { password_hash: string }
        Insert: Omit<AdminUser, 'id' | 'created_at'> & { password_hash: string }
        Update: Partial<Omit<AdminUser, 'id' | 'created_at'>>
      }
    }
  }
}
