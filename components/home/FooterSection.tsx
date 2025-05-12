import {
  Github,
  Instagram,
  Twitter,
  Youtube,
  Music2
} from 'lucide-react'

export default function FooterSection() {
  return (
    <footer className="bg-white text-gray-700 text-base">
      <div className="max-w-[1300px] mx-auto px-6 py-16 flex flex-col md:flex-row justify-between gap-12">
        {/* Bloco esquerdo com 3 colunas */}
        <div className="flex flex-col sm:flex-row gap-16">
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
            <h4 className="text-black text-xl font-semibold mb-4">Sobre o Feedybacky</h4>
            <ul className="space-y-2">
              <li>Sobre nós</li>
              <li>Para quem é?</li>
              <li>Termos de uso</li>
            </ul>
          </div>
        </div>

        {/* Coluna direita com newsletter */}
        <div className="max-w-sm w-full">
          <p className="text-black text-lg font-semibold mb-4">
            Fique por dentro! Receba as últimas novidades do Feedybacky em primeira mão.
          </p>
          <div className="flex items-center mb-6 rounded-full overflow-hidden bg-gray-100">
  <input
    type="email"
    placeholder="Email"
    className="px-4 py-2 w-full bg-gray-100 text-sm outline-none"
  />
  <button className="bg-[#6366f1] text-white px-5 py-2 text-sm font-semibold rounded-full">
    Assinar
  </button>
</div>
          <div className="flex gap-3">
            {[Github, Instagram, Twitter, Youtube, Music2].map((Icon, i) => (
              <div key={i} className="bg-[#6366f1] p-2 rounded-full text-white">
                <Icon size={16} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rodapé inferior com logo e copyright */}
      <div className="border-t border-gray-200 mt-6">
        <div className="max-w-[1300px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <img src="/logo-feedybacky.png" alt="Feedybacky Logo" className="h-6" />
          <p>Copyright © 2025 Feedybacky, Todos os direitos reservados</p>
        </div>
      </div>
    </footer>
  )
}
