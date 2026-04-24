'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getAdminSession, clearAdminSession } from '@/lib/auth'
import Image from 'next/image'

interface Product {
  id: number
  name: string
  price: number
  team: string
  created_at: string
}

interface ProductImage {
  id: number
  image_url: string
  display_order: number
}

export default function Admin() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Estados para produtos
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Estados para modal de criação/edição
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    team: ''
  })
  const [files, setFiles] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<ProductImage[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  useEffect(() => {
    const user = getAdminSession()
    if (!user) {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
      fetchProducts()
    }
    setLoading(false)
  }, [router])

  useEffect(() => {
    // Filtrar produtos baseado na pesquisa
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.team.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredProducts(filtered)
    setCurrentPage(1)
  }, [searchTerm, products])

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('camisetas')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setProducts(data)
      setFilteredProducts(data)
    }
  }

  async function fetchProductImages(productId: string) {
    const { data } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('display_order')

    return data || []
  }

  function handleLogout() {
    clearAdminSession()
    router.push('/admin/login')
  }

  function openCreateModal() {
    setEditingProduct(null)
    setFormData({ name: '', price: '', team: '' })
    setFiles([])
    setExistingImages([])
    setShowModal(true)
  }

  async function openEditModal(product: Product) {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      team: product.team
    })
    setFiles([])
    
    const images = await fetchProductImages(product.id.toString())
    setExistingImages(images)
    setShowModal(true)
  }

  async function handleSubmit() {
    if (!formData.name || !formData.price || !formData.team) {
      alert('Preencha todos os campos')
      return
    }

    if (!editingProduct && files.length === 0) {
      alert('Adicione pelo menos uma imagem')
      return
    }

    setIsSubmitting(true)

    try {
      let productId = editingProduct?.id

      // Criar ou atualizar produto
      if (editingProduct) {
        const { error } = await supabase
          .from('camisetas')
          .update({
            name: formData.name,
            price: Number(formData.price),
            team: formData.team
          })
          .eq('id', editingProduct.id)

        if (error) {
          console.error('Erro ao atualizar:', error)
          throw error
        }
      } else {
        const { data, error } = await supabase
          .from('camisetas')
          .insert([{
            name: formData.name,
            price: Number(formData.price),
            team: formData.team
          }])
          .select()
          .single()

        if (error) {
          console.error('Erro ao criar:', error)
          throw error
        }
        productId = data.id
      }

      // Upload de novas imagens
      if (files.length > 0 && productId) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          const fileName = `${Date.now()}-${i}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`

          const { error: uploadError } = await supabase.storage
            .from('camisetas')
            .upload(fileName, file)

          if (uploadError) {
            console.error('Erro no upload:', uploadError)
            throw uploadError
          }

          const { data: urlData } = supabase.storage
            .from('camisetas')
            .getPublicUrl(fileName)

          const { error: insertError } = await supabase.from('product_images').insert([{
            product_id: productId,
            image_url: urlData.publicUrl,
            display_order: existingImages.length + i
          }])

          if (insertError) {
            console.error('Erro ao inserir imagem:', insertError)
            throw insertError
          }
        }
      }

      alert(editingProduct ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!')
      setShowModal(false)
      setFormData({ name: '', price: '', team: '' })
      setFiles([])
      setExistingImages([])
      fetchProducts()
    } catch (error: any) {
      console.error('Erro completo:', error)
      alert('Erro: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Deseja realmente excluir "${product.name}"?`)) return

    setIsDeleting(product.id)

    try {
      // Primeiro, buscar e deletar as imagens do storage
      const { data: images } = await supabase
        .from('product_images')
        .select('image_url')
        .eq('product_id', product.id)

      // Deletar imagens do storage
      if (images && images.length > 0) {
        for (const img of images) {
          const fileName = img.image_url.split('/').pop()
          if (fileName) {
            await supabase.storage.from('camisetas').remove([fileName])
          }
        }
      }

      // Deletar registros de imagens (CASCADE deve fazer isso automaticamente, mas garantindo)
      await supabase
        .from('product_images')
        .delete()
        .eq('product_id', product.id)

      // Deletar o produto
      const { error } = await supabase
        .from('camisetas')
        .delete()
        .eq('id', product.id)

      if (error) throw error

      alert('Produto excluído com sucesso!')
      fetchProducts()
    } catch (error: any) {
      console.error('Erro ao excluir:', error)
      alert('Erro ao excluir: ' + error.message)
    } finally {
      setIsDeleting(null)
    }
  }

  async function handleDeleteImage(imageId: number) {
    if (!confirm('Deseja remover esta imagem?')) return

    try {
      // Buscar a URL da imagem antes de deletar
      const imageToDelete = existingImages.find(img => img.id === imageId)
      
      if (imageToDelete) {
        // Deletar do storage
        const fileName = imageToDelete.image_url.split('/').pop()
        if (fileName) {
          await supabase.storage.from('camisetas').remove([fileName])
        }
      }

      // Deletar do banco
      const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId)

      if (error) throw error

      setExistingImages(existingImages.filter(img => img.id !== imageId))
      alert('Imagem removida com sucesso!')
    } catch (error: any) {
      console.error('Erro ao deletar imagem:', error)
      alert('Erro ao remover imagem: ' + error.message)
    }
  }

  // Paginação
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Header */}
      <header className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image src="/logo.jpeg" alt="PAPO 10" width={40} height={40} className="rounded-full" />
            <div>
              <h1 className="text-xl font-bold">PAPO 10</h1>
              <p className="text-xs text-gray-400">Painel Administrativo</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 rounded-lg text-sm transition"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Barra de ações */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
          <div className="flex-1 w-full md:max-w-md">
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:border-white transition"
            />
          </div>
          <button
            onClick={openCreateModal}
            className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            + Novo Produto
          </button>
        </div>

        {/* Tabela de produtos */}
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Nome</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Preço</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {paginatedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-800/50 transition">
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4 text-gray-400">{product.team}</td>
                    <td className="px-6 py-4">R$ {product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEditModal(product)}
                        disabled={isDeleting === product.id}
                        className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded text-sm mr-2 transition disabled:opacity-50"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        disabled={isDeleting === product.id}
                        className="px-3 py-1 bg-red-900/50 hover:bg-red-900 rounded text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDeleting === product.id ? (
                          <span className="flex items-center gap-2">
                            <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Excluindo...
                          </span>
                        ) : (
                          'Excluir'
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-neutral-800 flex justify-between items-center">
              <p className="text-sm text-gray-400">
                Página {currentPage} de {totalPages} ({filteredProducts.length} produtos)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Criação/Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <div className="bg-neutral-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-white transition"
                  placeholder="Ex: Camisa Brasil 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <input
                  type="text"
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-white transition"
                  placeholder="Ex: Brasil"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-white transition"
                  placeholder="Ex: 199.90"
                />
              </div>

              {/* Imagens existentes */}
              {existingImages.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Imagens Atuais</label>
                  <div className="grid grid-cols-3 gap-3">
                    {existingImages.map((img) => (
                      <div key={img.id} className="relative group">
                        <img
                          src={img.image_url}
                          alt="Produto"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleDeleteImage(img.id)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload de novas imagens */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {editingProduct ? 'Adicionar Mais Imagens' : 'Imagens do Produto'}
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setFiles(Array.from(e.target.files || []))}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-white file:text-black file:font-semibold hover:file:bg-gray-100"
                />
                {files.length > 0 && (
                  <p className="text-sm text-gray-400 mt-2">
                    {files.length} arquivo(s) selecionado(s)
                  </p>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-neutral-800 flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                disabled={isSubmitting}
                className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px]"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    {editingProduct ? 'Salvando...' : 'Criando...'}
                  </span>
                ) : (
                  editingProduct ? 'Salvar Alterações' : 'Criar Produto'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
