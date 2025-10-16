import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, Heart, Zap, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const Home = () => {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: <Shield className="text-neonPurple" size={40} />,
      title: 'Seguro & Privado',
      description: 'Suas conversas são 100% privadas e criptografadas'
    },
    {
      icon: <Heart className="text-neonPink" size={40} />,
      title: 'Modelos Verificadas',
      description: 'Todas as modelos são verificadas e maiores de 18 anos'
    },
    {
      icon: <Zap className="text-accent" size={40} />,
      title: 'Chat em Tempo Real',
      description: 'Converse instantaneamente com suas modelos favoritas'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen">
        {/* Banner de Fundo */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/img/banner.png)" }}
        ></div>
        
        <div className="container mx-auto px-4 relative z-10 h-full flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <p className="text-xl md:text-2xl text-lightText/80 mb-8 leading-relaxed">
              Conecte-se com modelos online em um ambiente
              <span className="text-accent font-semibold"> seguro, discreto </span>
              e profissional
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link 
                  to="/models"
                  className="group px-8 py-4 bg-gradient-to-r from-neonPurple to-accent rounded-xl font-bold text-lg hover:shadow-neon transition-all btn-glow flex items-center space-x-2"
                >
                  <span>Ver Modelos Online</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
              ) : (
                <>
                  <Link 
                    to="/register"
                    className="group px-8 py-4 bg-gradient-to-r from-neonPurple to-accent rounded-xl font-bold text-lg hover:shadow-neon transition-all btn-glow flex items-center space-x-2"
                  >
                    <span>Começar Agora</span>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
                  
                  <Link 
                    to="/login"
                    className="px-8 py-4 border-2 border-neonPurple rounded-xl font-bold text-lg hover:bg-neonPurple/10 transition-all"
                  >
                    Já Tenho Conta
                  </Link>
                </>
              )}
            </div>

            {/* Aviso +18 */}
            <p className="mt-8 text-sm text-lightText/50">
              🔞 Conteúdo exclusivo para maiores de 18 anos
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-darkGray/50">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 neon-text"
          >
            Por Que Escolher a Gente?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-black/50 border border-neonPurple/20 rounded-xl p-8 text-center hover:border-neonPurple/50 hover:shadow-neon transition-all"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-lightText">
                  {feature.title}
                </h3>
                <p className="text-lightText/70">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-neonPurple/20 to-accent/20 border border-neonPurple/30 rounded-2xl p-12 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 neon-text">
              Pronto Para Começar?
            </h2>
            <p className="text-xl text-lightText/80 mb-8 max-w-2xl mx-auto">
              Cadastre-se agora e comece a conversar com as <span className="text-accent font-bold">modelos mais lindas</span> da plataforma
            </p>
            
            {!isAuthenticated && (
              <Link 
                to="/register"
                className="inline-flex items-center space-x-2 px-10 py-5 bg-gradient-to-r from-neonPurple to-accent rounded-xl font-bold text-xl hover:shadow-neon-pink transition-all btn-glow"
              >
                <span>Criar Minha Conta</span>
                <ArrowRight size={24} />
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home

