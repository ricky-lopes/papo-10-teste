import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <Image 
          src="/logo.jpeg" 
          alt="PAPO 10" 
          width={100} 
          height={100}
          className="mx-auto mb-8 rounded-full"
        />
        
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Página não encontrada</h2>
        <p className="text-gray-400 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        
        <Link 
          href="/"
          className="inline-block bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
        >
          Voltar para Home
        </Link>
      </div>
    </div>
  )
}
