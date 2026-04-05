import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { AuthProvider } from '../contexts/AuthContext'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
})

export const metadata: Metadata = {
  title: 'QuestIA — Plataforma Educacional com IA',
  description:
    'Gere quizzes inteligentes com IA a partir de materiais de apoio. Plataforma educacional para professores e alunos.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={geistSans.variable}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
