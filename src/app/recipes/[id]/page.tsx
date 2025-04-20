import { recipes } from '@/data/recipes'

export function generateStaticParams() {
  return recipes.map((recipe) => ({
    id: recipe.id,
  }))
}
import Link from 'next/link'
import RecipeDetail from '@/components/RecipeDetail'
import Tetsu46Customizer from '@/components/Tetsu46Customizer'

export default function RecipePage({ params }: { params: { id: string } }) {
  const recipe = recipes.find(r => r.id === params.id)
  if (!recipe) {
    return (
      <main className="min-h-screen p-8">
        <div>Recipe not found</div>
        <Link href="/recipes" className="text-emerald-600 hover:text-emerald-700">
          ← Back to Recipes
        </Link>
      </main>
    )
  }

  // テツ式4:6メソッドの場合は直接カスタマイズコンポーネントを表示
  if (recipe.id === 'tetsu-4-6') {
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-2xl font-bold mb-6">テツ式4:6メソッド</h1>
        <Tetsu46Customizer />
      </main>
    )
  }

  return <RecipeDetail recipe={recipe} />
}
