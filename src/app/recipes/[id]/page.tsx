import { recipes } from '@/data/recipes'
import Link from 'next/link'
import RecipeDetail from '@/components/RecipeDetail'
import Tetsu46Customizer from '@/components/Tetsu46Customizer'

export function generateStaticParams() {
  return recipes.map((recipe) => ({
    id: recipe.id,
  }))
}

export default function RecipePage({ params }: { params: { id: string } }) {
  const recipe = recipes.find(r => r.id === params.id)
  if (!recipe) {
    return (
      <main className="min-h-screen p-8">
        <div className="flex items-center justify-between mb-8">
          <div>Recipe not found</div>
          <Link href="/" className="text-emerald-600 hover:text-emerald-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            トップに戻る
          </Link>
        </div>
      </main>
    )
  }

  // 4:6メソッドの場合は直接カスタマイズコンポーネントを表示
  if (recipe.id === 'tetsu-4-6') {
    return (
      <main className="min-h-screen p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold mb-6">4:6メソッド</h1>
          <Link href="/" className="text-emerald-600 hover:text-emerald-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            トップに戻る
          </Link>
        </div>
        <Tetsu46Customizer />
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Recipe Details</h1>
        <Link href="/" className="text-emerald-600 hover:text-emerald-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          トップに戻る
        </Link>
      </div>
      <RecipeDetail recipe={recipe} />
    </main>
  )
}
