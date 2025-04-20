import type { Metadata } from 'next'
import { Inter, Roboto_Mono } from 'next/font/google'
import './globals.css'
import { RecipeProvider } from '@/contexts/RecipeContext'

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
      <body className={`${inter.className} ${robotoMono.variable} bg-gray-50`}>
        <RecipeProvider>
          {children}
        </RecipeProvider>
      </body>
    </html>
  )
}
