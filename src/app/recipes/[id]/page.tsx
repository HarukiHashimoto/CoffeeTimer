import { recipes } from '@/data/recipes'
import Link from 'next/link'
import RecipeDetail from '@/components/RecipeDetail'
import dynamic from 'next/dynamic'

const Tetsu46Customizer = dynamic(() => import('@/components/Tetsu46Customizer'), {
  ssr: false,
})

export function generateStaticParams() {
  return recipes.map((recipe) => ({
    id: recipe.id,
  }))
}

type Props = {
  params: { id: string }
}

export default function RecipePage({ params }: Props) {
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
    return <Tetsu46Customizer />
  }

  return <RecipeDetail recipe={recipe} />
}
