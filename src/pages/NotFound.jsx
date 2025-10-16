import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24">
      <div className="text-center">
        <h1 className="text-9xl font-black mb-4 bg-gradient-to-r from-neonPurple to-accent bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-3xl font-bold mb-4">Página Não Encontrada</h2>
        <p className="text-lightText/70 mb-8">
          A página que você está procurando não existe.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-neonPurple to-accent rounded-lg font-semibold hover:shadow-neon transition-all btn-glow"
        >
          <Home size={20} />
          <span>Voltar para Home</span>
        </Link>
      </div>
    </div>
  )
}

export default NotFound

