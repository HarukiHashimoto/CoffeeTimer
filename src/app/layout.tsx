import type { Metadata } from 'next'
import { Inter, Roboto_Mono } from 'next/font/google'
import './globals.css'
import { RecipeProvider } from '@/contexts/RecipeContext'
import ThemeToggle from '@/components/ThemeToggle'

const inter = Inter({ subsets: ['latin'] })
const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-roboto-mono' })

export const metadata: Metadata = {
  title: 'Coffee Timer',
  description: 'コーヒーを美味しく淹れるためのタイマーとレシピ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} ${robotoMono.variable} bg-light-bg dark:bg-dark-bg`}>
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <RecipeProvider>
          {children}
        </RecipeProvider>
      </body>
    </html>
  )
}
