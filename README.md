📁 Estrutura do Projeto — Feedybacky

Este documento descreve a estrutura geral da aplicação Feedybacky, com foco em modularidade, boas práticas e divisão de responsabilidades.

🧱 app/

Diretório principal com base no App Router do Next.js:

(private): rotas protegidas

/account, /dashboard, /document/[id], /register, /site/[id]

(public): rotas públicas e páginas de marketing

/blog, /login, /pagamento, /success, etc.

api/: rotas de API internas, separadas por domínio

create-checkout-session, pdfconverter, proxy, webhook, etc.

layout.tsx / page.tsx: entry points do App Router global e público

🔍 Observação: as pastas (private) e (public) são usadas como agrupadores invisíveis. Ideal para organização, mas não geram rotas por si só.

🧩 components/

Componentes organizados por domínio e reutilização:

account/: gerencia perfil, assinatura, foto, etc.

comment/: sistema completo de comentários e feedback visual

dashboard/: galeria, upload, sidebar, header

home/: seções da landing page (Hero, FAQ, CTA...)

common/: loaders, auth, feedbacks genéricos

ui/: design system (avatar, badge, input, skeleton...)

🔁 Sugestão: agrupar arquivos de comment/ em subpastas por função (ex: layout/, ui/, logic/).

🧠 contexts/

Gerenciadores globais de estado:

CardContext, DashboardContext, ImagesContext, PageContext, ThemeContext

🎯 Responsabilidades bem definidas e com boa separação de escopo.

🪝 hooks/

Hooks reutilizáveis e bem modularizados:

usePins/: funções específicas para carregar comentários e replies

Gerais: useAuthLogin, useEscapeKey, usePinIframe, useSession, etc.

🔁 usePins.ts e a pasta usePins/ coexistem — podem ser unificados ou mantidos conforme crescimento.

📐 types/

Estrutura clara, com index.ts centralizador

Tipos por domínio (PinProps, DocumentProps, ImageAreaProps)

💡 Sugestão: considerar nomes por contexto (comment.types.ts, dashboard.types.ts) caso escale.

🛠 utils/

Funções auxiliares organizadas por responsabilidade:

Supabase: supabaseClient, supabaseServerClient, createServerClient

Domínio: authAnonymousComment, commentUtils, replyUtils, pdfUtils, etc.

Diversos: formatDate, handleImageClick, uploadImage

10 de maio de 2025