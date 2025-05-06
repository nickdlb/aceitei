import {
    Github,
    Instagram,
    Twitter,
    Youtube,
    Music2
  } from 'lucide-react'
  
  export default function FooterSection() {
    return (
      <footer className="bg-white text-gray-700 text-base flex items-center justify-center">
        <div className='max-w-[1400px]'>
          <div className="mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-black text-xl font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2">
                <li>Feedback visual direto</li>
                <li>Gestão de mudanças</li>
                <li>Compartilhamento fácil</li>
                <li>Controle de revisões</li>
                <li>Integrações futuras</li>
              </ul>
            </div>
            <div>
              <h4 className="text-black text-xl font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2">
                <li>FAQ</li>
                <li>Central de ajuda</li>
                <li>Políticas de privacidade</li>
              </ul>
            </div>
            <div>
              <h4 className="text-black text-xl font-semibold mb-4">Sobre o Pinify</h4>
              <ul className="space-y-2">
                <li>Sobre nós</li>
                <li>Para quem é?</li>
                <li>Termos de uso</li>
              </ul>
            </div>
            <div>
              <p className="text-black text-base font-semibold mb-4">
                Fique por dentro! Receba as últimas novidades do Pinify em primeira mão.
              </p>
              <div className="flex items-center mb-4 overflow-hidden rounded-full border border-gray-300">
                <input
                  type="email"
                  placeholder="Email"
                  className="px-4 py-2 w-full text-sm outline-none"
                />
                <button className="bg-indigo-500 text-white px-5 py-2 text-sm font-semibold">
                  Assinar
                </button>
              </div>
              <div className="flex gap-3 text-indigo-500 text-xl">
                <Github size={20} />
                <Instagram size={20} />
                <Twitter size={20} />
                <Youtube size={20} />
                <Music2 size={20} /> {/* usado como alternativa ao TikTok */}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 text-center py-4 text-xs text-gray-500">
            <p>Copyright © 2025 Pinify, Todos os direitos reservados</p>
          </div>
        </div>
      </footer>
    )
  }
  