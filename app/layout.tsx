import { Metadata } from 'next';
import "./styles.css"

export const metadata: Metadata = {
  title: "Markupv1",
  description: "Agência DLB",
  icons: "https://agenciadlb.com.br/wp-content/uploads/2023/08/cropped-Logo-DLB-Redondo-2-32x32.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
