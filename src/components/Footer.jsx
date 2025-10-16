import { Heart, Shield, Lock } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-black/80 border-t border-neonPurple/20 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Sobre */}
          <div>
            <div className="flex justify-center md:justify-start mb-4">
              <img 
                src="/img/logo.png" 
                alt="ConexaoProibida" 
                className="h-16 w-auto object-contain"
              />
            </div>
            <p className="text-lightText/70 text-sm">
              Conecte-se com modelos online em um ambiente seguro, discreto e profissional.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold text-lightText mb-3">Informações</h4>
            <ul className="space-y-2 text-sm text-lightText/70">
              <li className="flex items-center justify-center md:justify-start space-x-2">
                <Shield size={16} className="text-neonPurple" />
                <span>100% Seguro e Privado</span>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-2">
                <Lock size={16} className="text-neonPurple" />
                <span>Transações Criptografadas</span>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-2">
                <Heart size={16} className="text-neonPurple" />
                <span>Suporte 24/7</span>
              </li>
            </ul>
          </div>

          {/* Aviso Legal */}
          <div>
            <h4 className="text-lg font-semibold text-lightText mb-3">Aviso Legal</h4>
            <p className="text-xs text-lightText/60">
              Este site é destinado exclusivamente para maiores de 18 anos. 
              Ao acessar, você concorda com nossos termos de uso e política de privacidade.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-neonPurple/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-lightText/60">
              © {new Date().getFullYear()} ConexaoProibida. Todos os direitos reservados. | +18
            </p>
            
            {/* Engine by Clerky */}
            <div className="flex items-center gap-2 text-sm text-lightText/60">
              <span>Engine by</span>
              <a 
                href="https://www.clerky.com.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <img 
                  src="/img/Clerky.png" 
                  alt="Clerky" 
                  className="h-6 w-auto object-contain"
                />
              </a>
              <a 
                href="https://www.clerky.com.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent font-semibold hover:text-neonPink transition-colors"
              >
                Hub WhatsApp com API
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

