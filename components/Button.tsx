import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  children: ReactNode
  loading?: boolean
}

export default function Button({ 
  variant = 'primary', 
  children, 
  loading = false,
  disabled,
  className = '',
  ...props 
}: ButtonProps) {
  
  const baseStyles = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-white text-black hover:bg-gray-100',
    secondary: 'bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700',
    danger: 'bg-red-900/50 text-white hover:bg-red-900 border border-red-800'
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
          Carregando...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
