'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import ImageCarousel from '@/components/ImageCarousel'

interface Product {
  id: number
  name: string
  price: number
  team: string
}

interface ProductWithImages extends Product {
  images: string[]
}

export default function Home() {
  const [produtos, setProdutos] = useState<ProductWithImages[]>([])
  const [filteredProdutos, setFilteredProdutos] = useState<ProductWithImages[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<ProductWithImages | null>(null)

  // Número de WhatsApp (formato: 5511999999999)
  const whatsappNumber = '5543996457473' // ALTERE PARA SEU NÚMERO
  const instagramHandle = '@sportspapo10' // ALTERE PARA SEU INSTAGRAM

  useEffect(() => {
    async function fetchData() {
      // Buscar produtos
      const { data: productsData } = await supabase
        .from('camisetas')
        .select('*')
        .order('created_at', { ascending: false })

      if (productsData) {
        // Buscar imagens para cada produto
        const productsWithImages = await Promise.all(
          productsData.map(async (product) => {
            const { data: imagesData } = await supabase
              .from('product_images')
              .select('image_url')
              .eq('product_id', product.id)
              .order('display_order')

            return {
              ...product,
              images: imagesData?.map(img => img.image_url) || []
            }
          })
        )

        setProdutos(productsWithImages)
        setFilteredProdutos(productsWithImages)
      }
    }

    fetchData()
  }, [])

  // Filtrar produtos baseado na pesquisa
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProdutos(produtos)
    } else {
      const filtered = produtos.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.team.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProdutos(filtered)
    }
  }, [searchTerm, produtos])

  function handleWhatsAppContact(product?: ProductWithImages) {
    const message = product
      ? `Olá! Gostaria de verificar a disponibilidade da ${product.name} - ${product.team}`
      : 'Olá! Gostaria de mais informações sobre as camisas.'
    
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <main className="bg-black text-white min-h-screen">

      {/* HEADER */}
      <header className="w-full border-b border-neutral-800 backdrop-blur-sm bg-black/50 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image 
              src="/logo.jpeg" 
              alt="logo" 
              width={45} 
              height={45}
              className="rounded-full"
            />
            <span className="font-bold text-xl tracking-[0.3em]">PAPO 10</span>
          </div>

          <nav className="hidden md:flex gap-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors duration-300">Home</a>
            <a href="#colecao" className="hover:text-white transition-colors duration-300">Coleção</a>
            <a href="#contato" className="hover:text-white transition-colors duration-300">Contato</a>
          </nav>

          <button className="md:hidden text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative w-full overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/50 to-black pointer-events-none"></div>
        
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 py-20 md:py-32 grid md:grid-cols-2 items-center gap-16 relative">

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs tracking-wider mb-6">
              {'COLEÇÃO ' + new Date().getFullYear()}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6">
              Vista o jogo.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                Seja o 10.
              </span>
            </h1>

            <p className="text-gray-400 mb-10 max-w-lg text-lg leading-relaxed">
              Camisetas premium com identidade. Estilo de quem joga diferente. 
              Qualidade superior para verdadeiros apaixonados.
            </p>

            <div className="flex gap-4">
              <a 
                href="#colecao"
                className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition-transform duration-300"
              >
                Explorar Coleção
              </a>
              <button 
                onClick={() => handleWhatsAppContact()}
                className="px-8 py-4 border border-white/20 rounded-full font-semibold hover:bg-white/5 transition-colors duration-300"
              >
                Fale Conosco
              </button>
            </div>
          </motion.div>

          <motion.div
            className="flex justify-center relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full"></div>
            <Image 
              src="/logo.jpeg" 
              alt="hero" 
              width={380} 
              height={380}
              className="relative z-10 rounded-full shadow-2xl"
            />
          </motion.div>

        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-neutral-800 bg-neutral-900/30">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 py-12">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">100+</div>
              <div className="text-gray-400 text-sm">Modelos</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">Conforto</div>
              <div className="text-gray-400 text-sm">Qualidade</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">Entrega</div>
              <div className="text-gray-400 text-sm">Rápida</div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUTOS */}
      <section id="colecao" className="w-full py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-3">Nossa Coleção</h2>
              <p className="text-gray-400">Descubra as últimas novidades</p>
            </div>
          </div>

          {/* Barra de Pesquisa */}
          <div className="mb-10">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Pesquisar camisetas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-4 bg-neutral-900 border border-neutral-800 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors pr-12"
              />
              <svg 
                className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchTerm && (
              <p className="text-sm text-gray-400 mt-3">
                {filteredProdutos.length} {filteredProdutos.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {filteredProdutos.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-400 text-lg">Nenhuma camiseta encontrada</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-white hover:underline"
                >
                  Limpar pesquisa
                </button>
              </div>
            ) : (
              filteredProdutos.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="group cursor-pointer"
                onClick={() => setSelectedProduct(item)}
              >

                <div className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all duration-300">

                  {/* imagem */}
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={item.images[0] || '/placeholder.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Badge de múltiplas imagens */}
                    {item.images.length > 1 && (
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                        +{item.images.length - 1} fotos
                      </div>
                    )}
                  </div>

                  {/* overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <div className="w-full flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Ver Detalhes
                      </span>
                      <div className="bg-white text-black px-4 py-2 rounded-full text-xs font-semibold">
                        →
                      </div>
                    </div>
                  </div>

                </div>

                {/* info */}
                <div className="mt-5 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-500 text-sm">{item.team}</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold">R$ {item.price.toFixed(2)}</p>
                </div>

              </motion.div>
            ))
            )}

          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="w-full py-20 bg-gradient-to-b from-black to-neutral-900">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Entre em Contato
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Tire suas dúvidas, verifique disponibilidade ou faça seu pedido pelo WhatsApp
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => handleWhatsAppContact()}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-semibold transition-colors duration-300 flex items-center gap-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </button>
            
            <a 
              href={`https://instagram.com/${instagramHandle.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center gap-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              {instagramHandle}
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section - Removida */}
      <section className="w-full py-20 bg-gradient-to-b from-black to-neutral-900">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto para elevar seu estilo?
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Junte-se aos clientes satisfeitos que escolheram qualidade e autenticidade.
          </p>
          <button onClick={() => handleWhatsAppContact()} className="bg-white text-black px-10 py-4 rounded-full font-semibold hover:scale-105 transition-transform duration-300">
            Fale Conosco
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-800 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 py-8 text-center">
          <p className="text-sm text-gray-500">
            © 2026 PAPO 10 — Todos os direitos reservados
          </p>
        </div>
      </footer>

      {/* Modal de Detalhes do Produto */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 z-50 overflow-y-auto"
          onClick={() => setSelectedProduct(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-900 rounded-2xl max-w-5xl w-full my-8 border border-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-white text-3xl leading-none transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-8">
              {/* Carrossel de Imagens */}
              <div>
                <ImageCarousel 
                  images={selectedProduct.images} 
                  productName={selectedProduct.name}
                />
              </div>

              {/* Informações */}
              <div className="flex flex-col">
                <div className="mb-6">
                  <p className="text-gray-400 mb-2">{selectedProduct.team}</p>
                  <p className="text-4xl font-bold mb-6">R$ {selectedProduct.price.toFixed(2)}</p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-400">✓</span>
                      <span>Material premium de alta qualidade</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-400">✓</span>
                      <span>Entrega rápida em todo Brasil</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-400">✓</span>
                      <span>Garantia de autenticidade</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleWhatsAppContact(selectedProduct)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-full font-semibold transition-colors duration-300 flex items-center justify-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Verificar Disponibilidade
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </main>
  )
}
